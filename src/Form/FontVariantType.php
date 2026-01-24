<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\FontVariant;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;

class FontVariantType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('weight', ChoiceType::class, [
                'label' => 'Poids',
                'choices' => array_combine(FontVariant::WEIGHTS, FontVariant::WEIGHTS),
            ])
            ->add('style', ChoiceType::class, [
                'label' => 'Style',
                'choices' => array_combine(FontVariant::STYLES, FontVariant::STYLES),
            ])
            ->add('width', ChoiceType::class, [
                'label' => 'Largeur',
                'choices' => array_combine(FontVariant::WIDTHS, FontVariant::WIDTHS),
            ])
            ->add('file', FileType::class, [
                'label' => 'Fichier',
                'mapped' => false,
                'required' => ($options['data'] ?? null)?->getPath() === '',
                'constraints' => ($options['data'] ?? null)?->getPath() === '' ? [new File(['mimeTypes' => ['font/woff2', 'font/woff', 'font/ttf', 'application/font-woff2', 'application/font-woff', 'application/x-font-ttf'], 'mimeTypesMessage' => 'Fichier .woff2, .woff ou .ttf attendu.'])] : [],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => FontVariant::class]);
    }
}
