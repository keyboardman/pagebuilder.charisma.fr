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
use Symfony\Component\OptionsResolver\OptionsResolver;

class FontType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, ['label' => 'Nom'])
            ->add('type', EnumType::class, [
                'class' => FontTypeEnum::class,
                'label' => 'Type',
                'choice_label' => fn (FontTypeEnum $t) => $t->value,
            ])
            ->add('fallback', TextType::class, ['label' => 'Police de repli'])
            ->add('slug', TextType::class, ['label' => 'Slug'])
            ->add('googleFontUrl', TextType::class, ['label' => 'URL Google Font', 'required' => false])
            ->add('variants', CollectionType::class, [
                'entry_type' => FontVariantType::class,
                'entry_options' => ['label' => false],
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'label' => 'Variantes (custom)',
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => Font::class]);
    }
}
