<?php

namespace App\Form;

use App\Entity\Font;
use App\DTO\Theme\ThemeDTO;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ThemeDTOType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('fonts', EntityType::class, [
            'class' => Font::class,
            'choice_label' => 'name',
            'choice_attr' => fn (Font $font) => [
                'data-font-family' => $font->toString(), 
            ],
            'multiple' => true,
            'autocomplete' => true,
            'placeholder' => 'Choisir des polices…',
            'query_builder' => fn($repo) =>
            $repo->createQueryBuilder('f')->orderBy('f.name', 'ASC'),
            'attr' => [
                'data-controller' => 'font-autocomplete',
            ],
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ThemeDTO::class,
        ]);
    }
}
