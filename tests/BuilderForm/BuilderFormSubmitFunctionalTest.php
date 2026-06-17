<?php

declare(strict_types=1);

namespace App\Tests\BuilderForm;

use App\BuilderForm\BuilderFormAntispam;
use App\Entity\BuilderFormConfig;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class BuilderFormSubmitFunctionalTest extends WebTestCase
{
    public function testSubmitSucceedsWithEmptyHoneypot(): void
    {
        $client = static::createClient();
        $slug = $this->seedForm();
        try {
            $client->request('POST', '/api/page-builder/forms/' . $slug . '/submit', [
                BuilderFormAntispam::HONEYPOT_FIELD => '',
                'message' => 'hello',
            ]);

            self::assertResponseIsSuccessful();
            $data = json_decode($client->getResponse()->getContent(), true);
            self::assertIsArray($data);
            self::assertTrue($data['success'] ?? false, (string) ($data['message'] ?? ''));
        } finally {
            $this->removeForm($slug);
        }
    }

    public function testHoneypotFilledRejects(): void
    {
        $client = static::createClient();
        $slug = $this->seedForm();
        try {
            $client->request('POST', '/api/page-builder/forms/' . $slug . '/submit', [
                BuilderFormAntispam::HONEYPOT_FIELD => 'bot',
                'message' => 'spam',
            ]);

            self::assertResponseIsSuccessful();
            $data = json_decode($client->getResponse()->getContent(), true);
            self::assertIsArray($data);
            self::assertFalse($data['success'] ?? true);
        } finally {
            $this->removeForm($slug);
        }
    }

    public function testUnknownSlugReturns404(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/page-builder/forms/no-such-form-404-test/submit', [
            BuilderFormAntispam::HONEYPOT_FIELD => '',
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testRateLimitBlocksAfterMaxAttempts(): void
    {
        $client = static::createClient();
        $slug = $this->seedForm();
        try {
            for ($i = 0; $i < 2; ++$i) {
                $client->request('POST', '/api/page-builder/forms/' . $slug . '/submit', [
                    BuilderFormAntispam::HONEYPOT_FIELD => '',
                    'field' => 'a' . (string) $i,
                ]);
                self::assertResponseIsSuccessful();
                $row = json_decode($client->getResponse()->getContent(), true);
                self::assertIsArray($row);
                self::assertTrue($row['success'] ?? false, 'soumission ' . $i);
            }

            $client->request('POST', '/api/page-builder/forms/' . $slug . '/submit', [
                BuilderFormAntispam::HONEYPOT_FIELD => '',
                'field' => 'blocked',
            ]);
            self::assertResponseIsSuccessful();
            $row = json_decode($client->getResponse()->getContent(), true);
            self::assertIsArray($row);
            self::assertFalse($row['success'] ?? true);
        } finally {
            $this->removeForm($slug);
        }
    }

    private function removeForm(string $slug): void
    {
        try {
            $em = static::getContainer()->get(EntityManagerInterface::class);
            $found = $em->getRepository(BuilderFormConfig::class)->findOneBy(['slug' => $slug]);
            if ($found !== null) {
                $em->remove($found);
                $em->flush();
            }
        } catch (\Throwable) {
            // ignore cleanup errors (kernel shut down, etc.)
        }
    }

    private function seedForm(): string
    {
        $em = static::getContainer()->get(EntityManagerInterface::class);

        $slug = 'junit-' . bin2hex(random_bytes(4));
        $form = (new BuilderFormConfig())
            ->setSlug($slug)
            ->setLabel('JUnit form')
            ->setRecipientEmails(['test@example.com'])
            ->setEmailSubjectTemplate('{{ form_label }}')
            ->setEmailBodyTemplate('{% for row in rows %}{{ row.label }}={{ row.value }};{% endfor %}');
        $em->persist($form);
        $em->flush();

        return $slug;
    }
}
