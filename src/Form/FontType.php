<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\String\Slugger\SluggerInterface;

class FontType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $slugger = $options['slugger'] ?? null;

        $builder
            ->add('name', TextType::class, ['label' => 'Nom'])
            ->add('type', EnumType::class, [
                'class' => FontTypeEnum::class,
                'label' => 'Type',
                'choice_label' => fn (FontTypeEnum $t) => $t->value,
            ])
            ->add('fallback', TextType::class, ['label' => 'Police de repli'])
            ->add('googleFontUrl', TextType::class, ['label' => 'URL Google Font', 'required' => false])
            ->add('variants', CollectionType::class, [
                'entry_type' => FontVariantType::class,
                'entry_options' => ['label' => false],
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'label' => 'Variantes (custom)',
            ]);

        if ($slugger instanceof SluggerInterface) {
            $builder->addEventListener(FormEvents::SUBMIT, static function ($event) use ($slugger): void {
                $font = $event->getData();
                if ($font instanceof Font) {
                    $font->setSlug($slugger->slug($font->getName())->toString());
                }
            });
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Font::class,
            'slugger' => null,
        ]);
        $resolver->setAllowedTypes('slugger', [SluggerInterface::class, 'null']);
    }
}
