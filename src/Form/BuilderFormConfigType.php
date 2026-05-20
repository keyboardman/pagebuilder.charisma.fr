<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\BuilderFormConfig;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;

final class BuilderFormConfigType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('slug', TextType::class, [
                'label' => 'Identifiant URL (slug)',
                'help' => 'Utilisé dans l’URL de soumission : /submit/form/{slug}. Lettres minuscules, chiffres, tirets et underscores uniquement.',
                'attr' => [
                    'placeholder' => 'contact', 
                    'class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                ],
                'constraints' => [
                    new NotBlank(),
                    new Regex(
                        pattern: '/^[a-z0-9][a-z0-9_-]*$/',
                        message: 'Slug invalide (ex. contact, contact-rh).',
                    ),
                ],
            ])
            ->add('label', TextType::class, [
                'label' => 'Libellé',
                'help' => 'Nom affiché dans le catalogue du builder et dans les gabarits Twig (form_label).',
                'attr' => ['class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'],
                'constraints' => [new NotBlank()],
            ])
            ->add('recipientEmailsText', TextareaType::class, [
                'mapped' => false,
                'label' => 'Destinataires e-mail',
                'help' => 'Une adresse par ligne.',
                'required' => true,
                'attr' => [
                    'rows' => 4,
                    'class' => 'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                    'placeholder' => "admin@example.com\nautre@example.com",
                ],
                'constraints' => [new NotBlank(message: 'Indiquez au moins une adresse e-mail.')],
            ])
            ->add('emailSubjectTemplate', TextareaType::class, [
                'label' => 'Gabarit du sujet (Twig)',
                'help' => 'Variables : form_label, form_slug, rows',
                'attr' => ['rows' => 2, 'class' => 'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-xs'],
                'constraints' => [new NotBlank()],
            ])
            ->add('emailBodyTemplate', TextareaType::class, [
                'label' => 'Gabarit du corps (Twig, HTML)',
                'help' => 'Variables : form_label, form_slug, rows (liste label/value).',
                'attr' => ['rows' => 12, 'class' => 'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-xs'],
                'constraints' => [new NotBlank()],
            ])
            ->add('webhookUrl', UrlType::class, [
                'label' => 'URL webhook (optionnel)',
                'required' => false,
                'attr' => ['class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'],
            ])
            ->add('enabled', CheckboxType::class, [
                'label' => 'Formulaire actif',
                'required' => false,
            ]);

        $builder->addEventListener(FormEvents::POST_SET_DATA, function (FormEvent $event): void {
            $data = $event->getData();
            if (!$data instanceof BuilderFormConfig) {
                return;
            }
            $emails = $data->getRecipientEmails();
            $event->getForm()->get('recipientEmailsText')->setData(implode("\n", $emails));
        });

        $builder->addEventListener(FormEvents::SUBMIT, function (FormEvent $event): void {
            $config = $event->getData();
            if (!$config instanceof BuilderFormConfig) {
                return;
            }
            $text = (string) $event->getForm()->get('recipientEmailsText')->getData();
            $lines = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $text)), static fn (string $e): bool => $e !== ''));
            $config->setRecipientEmails($lines);
        });
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => BuilderFormConfig::class,
        ]);
    }
}
