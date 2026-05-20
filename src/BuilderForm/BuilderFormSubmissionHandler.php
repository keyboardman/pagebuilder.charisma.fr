<?php

declare(strict_types=1);

namespace App\BuilderForm;

use App\Entity\BuilderFormConfig;
use App\Repository\BuilderFormConfigRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Twig\Environment;

final class BuilderFormSubmissionHandler
{
    public function __construct(
        private readonly BuilderFormConfigRepository $repository,
        private readonly Environment $twig,
        private readonly MailerInterface $mailer,
        private readonly BuilderFormRateLimiter $rateLimiter,
        private readonly HttpClientInterface $httpClient,
        private readonly LoggerInterface $logger,
        #[Autowire('%app.builder_form.honeypot_field%')]
        private readonly string $honeypotField,
        #[Autowire('%app.builder_form.mail_from%')]
        private readonly string $mailFrom,
        #[Autowire('%app.builder_form.generic_error_message%')]
        private readonly string $genericErrorMessage,
    ) {
    }

    /**
     * @return array{success: bool, message: string, status: int}
     */
    public function handle(string $slug, Request $request): array
    {
        $form = $this->repository->findEnabledBySlug($slug);
        if ($form === null) {
            return [
                'success' => false,
                'message' => 'Formulaire introuvable.',
                'status' => 404,
            ];
        }

        $clientKey = $request->getClientIp() ?? 'unknown';
        if ($this->rateLimiter->isTooManyAttempts($clientKey, $slug)) {
            return [
                'success' => false,
                'message' => $this->genericErrorMessage,
                'status' => 200,
            ];
        }

        $hp = (string) $request->request->get($this->honeypotField, '');
        if ($hp !== '') {
            return [
                'success' => false,
                'message' => $this->genericErrorMessage,
                'status' => 200,
            ];
        }

        $rows = $this->extractRows($request);

        try {
            $subject = $this->renderStringTemplate($form->getEmailSubjectTemplate(), $form, $rows);
            $html = $this->renderStringTemplate($form->getEmailBodyTemplate(), $form, $rows);
        } catch (\Throwable $e) {
            $this->logger->error('Builder form template render failed', ['exception' => $e, 'slug' => $slug]);

            return [
                'success' => false,
                'message' => $this->genericErrorMessage,
                'status' => 200,
            ];
        }

        $recipients = array_values(array_filter(array_map('trim', $form->getRecipientEmails())));
        if ($recipients === []) {
            $this->logger->warning('Builder form has no recipients', ['slug' => $slug]);

            return [
                'success' => false,
                'message' => $this->genericErrorMessage,
                'status' => 200,
            ];
        }

        try {
            $email = (new Email())
                ->from(new Address($this->mailFrom))
                ->subject($subject)
                ->html($html);
            foreach ($recipients as $to) {
                $email->addTo($to);
            }
            $this->mailer->send($email);
        } catch (\Throwable $e) {
            $this->logger->error('Builder form mail send failed', ['exception' => $e, 'slug' => $slug]);

            return [
                'success' => false,
                'message' => $this->genericErrorMessage,
                'status' => 200,
            ];
        }

        $this->notifyWebhook($form, $rows);

        return [
            'success' => true,
            'message' => 'Votre message a bien été envoyé.',
            'status' => 200,
        ];
    }

    /**
     * @return list<array{label: string, value: string}>
     */
    private function extractRows(Request $request): array
    {
        $reserved = array_flip(BuilderFormAntispam::reservedFieldNames());
        $rows = [];
        foreach ($request->request->all() as $key => $value) {
            if (isset($reserved[(string) $key])) {
                continue;
            }
            if (!\is_string($key)) {
                continue;
            }
            if (\is_array($value)) {
                $value = implode(', ', array_map(static fn ($v) => (string) $v, $value));
            }
            $rows[] = [
                'label' => $key,
                'value' => (string) $value,
            ];
        }

        return $rows;
    }

    /**
     * @param list<array{label: string, value: string}> $rows
     */
    private function renderStringTemplate(string $template, BuilderFormConfig $form, array $rows): string
    {
        $twigTemplate = $this->twig->createTemplate($template);

        return $twigTemplate->render([
            'form_label' => $form->getLabel(),
            'form_slug' => $form->getSlug(),
            'rows' => $rows,
        ]);
    }

    /**
     * @param list<array{label: string, value: string}> $rows
     */
    private function notifyWebhook(BuilderFormConfig $form, array $rows): void
    {
        $url = $form->getWebhookUrl();
        if ($url === null || $url === '') {
            return;
        }

        $fields = [];
        foreach ($rows as $row) {
            $fields[$row['label']] = $row['value'];
        }

        try {
            $this->httpClient->request('POST', $url, [
                'timeout' => 5,
                'headers' => ['Content-Type' => 'application/json'],
                'json' => [
                    'formId' => $form->getSlug(),
                    'submittedAt' => (new \DateTimeImmutable())->format(\DateTimeInterface::ATOM),
                    'fields' => $fields,
                ],
            ]);
        } catch (\Throwable $e) {
            $this->logger->warning('Builder form webhook failed', [
                'exception' => $e,
                'slug' => $form->getSlug(),
            ]);
        }
    }
}
