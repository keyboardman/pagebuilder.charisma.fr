<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\ApiCollectionDefinition;
use App\PageBuilder\ApiCollection\ApiCollectionRegistry;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;

final class ApiCollectionDefinitionType extends AbstractType
{
    /** @var array<string, string> field key => human label */
    private const MAPPING_FIELDS = [
        'id' => 'Identifiant item',
        'image' => 'Image',
        'title' => 'Titre',
        'description' => 'Description',
        'label' => 'Label',
        'labels' => 'Labels (liste)',
        'counter' => 'Compteur',
        'like' => 'Likes',
        'link' => 'Lien',
        'alt' => 'Texte alternatif',
    ];

    public function __construct(
        private readonly ApiCollectionRegistry $registry,
    ) {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('apiId', TextType::class, [
                'label' => 'Identifiant (apiId)',
                'help' => 'Utilisé comme apiId dans NodeCollection. Minuscules, chiffres, tirets, underscores.',
                'attr' => ['class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm', 'placeholder' => 'ma_collection_articles'],
                'constraints' => [
                    new NotBlank(),
                    new Regex(pattern: '/^[a-z0-9][a-z0-9_-]*$/', message: 'Identifiant invalide.'),
                ],
            ])
            ->add('label', TextType::class, [
                'label' => 'Libellé',
                'attr' => ['class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'],
                'constraints' => [new NotBlank()],
            ])
            ->add('type', ChoiceType::class, [
                'label' => 'Type',
                'choices' => [
                    'Article' => 'article',
                    'Image' => 'image',
                    'Vidéo' => 'video',
                ],
                'attr' => ['class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'],
            ])
            ->add('supportedModes', ChoiceType::class, [
                'label' => 'Modes supportés',
                'choices' => [
                    'Fixed (paginé)' => 'fixed',
                    'Dynamic (picking)' => 'dynamic',
                ],
                'expanded' => true,
                'multiple' => true,
                'constraints' => [new NotBlank(message: 'Sélectionnez au moins un mode.')],
            ])
            ->add('endpointUrl', UrlType::class, [
                'label' => 'URL de la collection',
                'help' => 'Endpoint qui renvoie la liste d’items (JSON).',
                'default_protocol' => 'https',
                'attr' => [
                    'class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                    'placeholder' => 'https://api.example.com/articles',
                ],
                'constraints' => [new NotBlank()],
            ])
            ->add('itemUrlTemplate', TextType::class, [
                'label' => 'URL d’un item (mode dynamic)',
                'required' => false,
                'help' => 'Modèle pour charger un item par id. Placeholders : {endpoint}, {id}. Ex. {endpoint}/{id}',
                'attr' => [
                    'class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                    'placeholder' => '{endpoint}/{id}',
                ],
            ])
            ->add('imagePrefix', TextType::class, [
                'label' => 'Préfixe image (optionnel)',
                'required' => false,
                'help' => 'Préfixe pour les chemins image relatifs. Ignoré si l’URL est déjà absolue (http/https).',
                'attr' => [
                    'class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                    'placeholder' => 'https://cdn.example.com',
                ],
            ])
            ->add('paginationStyle', ChoiceType::class, [
                'label' => 'Style de pagination',
                'choices' => [
                    'Hydra (page + itemsPerPage)' => 'hydra',
                    'Offset / limit' => 'offset',
                    'Aucune (découpe locale)' => 'none',
                ],
                'attr' => ['class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'],
            ])
            ->add('memberPath', TextType::class, [
                'label' => 'Chemin vers la liste d’items',
                'help' => 'Chemin pointé dans le JSON jusqu’au tableau d’items. Défaut Hydra : member. Ex. data.items',
                'attr' => [
                    'class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-xs',
                    'placeholder' => 'member',
                ],
            ])
            ->add('queryParamsText', TextareaType::class, [
                'mapped' => false,
                'required' => false,
                'label' => 'Paramètres de requête fixes',
                'help' => 'Ajoutés à chaque appel collection. Une paire clé=valeur par ligne.',
                'attr' => [
                    'rows' => 3,
                    'class' => 'flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-xs',
                    'placeholder' => "order[date]=desc\nlocale=fr",
                ],
            ])
            ->add('headersText', TextareaType::class, [
                'mapped' => false,
                'required' => false,
                'label' => 'En-têtes HTTP (optionnel)',
                'help' => 'Une paire clé=valeur par ligne (ex. Authorization=Bearer …). Stockés en clair.',
                'attr' => [
                    'rows' => 3,
                    'class' => 'flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-xs',
                    'placeholder' => 'Authorization=Bearer …',
                ],
            ])
            ->add('enabled', CheckboxType::class, [
                'label' => 'API active (visible dans le catalogue builder)',
                'required' => false,
            ]);

        foreach (self::MAPPING_FIELDS as $field => $label) {
            $placeholder = match ($field) {
                'title' => 'titre',
                'image' => 'visuel.url',
                'labels' => 'classements.?.nom',
                default => $field,
            };
            $help = $field === 'labels'
                ? 'Chemin JSON → liste de chaînes. Pour plucker une propriété dans chaque élément : classements.?.nom (ou classements[].nom). Laisser vide pour ne pas exposer.'
                : 'Chemin JSON source → champ « ' . $field . ' ». Laisser vide pour ne pas exposer.';

            $builder->add('map_' . $field, TextType::class, [
                'mapped' => false,
                'required' => false,
                'label' => $label,
                'help' => $help,
                'attr' => [
                    'class' => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-xs',
                    'placeholder' => $placeholder,
                ],
            ]);
        }

        $builder->addEventListener(FormEvents::POST_SET_DATA, function (FormEvent $event): void {
            $data = $event->getData();
            if (!$data instanceof ApiCollectionDefinition) {
                return;
            }
            $form = $event->getForm();
            $form->get('queryParamsText')->setData($this->assocToLines($data->getQueryParams()));
            $form->get('headersText')->setData($this->assocToLines($data->getHeaders()));
            $mapping = $data->getFieldMapping();
            foreach (self::MAPPING_FIELDS as $field => $_) {
                $form->get('map_' . $field)->setData($mapping[$field] ?? '');
            }
        });

        $builder->addEventListener(FormEvents::SUBMIT, function (FormEvent $event): void {
            $definition = $event->getData();
            if (!$definition instanceof ApiCollectionDefinition) {
                return;
            }
            $form = $event->getForm();
            $definition->setQueryParams($this->linesToAssoc((string) $form->get('queryParamsText')->getData()));
            $definition->setHeaders($this->linesToAssoc((string) $form->get('headersText')->getData()));

            $mapping = [];
            foreach (self::MAPPING_FIELDS as $field => $_) {
                $path = trim((string) $form->get('map_' . $field)->getData());
                if ($path !== '') {
                    $mapping[$field] = $path;
                }
            }
            $definition->setFieldMapping($mapping);

            $reserved = $this->registry->getReservedAdapterIds();
            if (\in_array($definition->getApiId(), $reserved, true)) {
                $form->get('apiId')->addError(new FormError(
                    'Cet identifiant est réservé par une API PHP existante.'
                ));
            }
        });
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ApiCollectionDefinition::class,
        ]);
    }

    /**
     * @param array<string, string> $assoc
     */
    private function assocToLines(array $assoc): string
    {
        $lines = [];
        foreach ($assoc as $key => $value) {
            $lines[] = $key . '=' . $value;
        }

        return implode("\n", $lines);
    }

    /**
     * @return array<string, string>
     */
    private function linesToAssoc(string $text): array
    {
        $out = [];
        foreach (preg_split('/\r\n|\r|\n/', $text) ?: [] as $line) {
            $line = trim($line);
            if ($line === '' || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            if ($key === '') {
                continue;
            }
            $out[$key] = trim($value);
        }

        return $out;
    }
}
