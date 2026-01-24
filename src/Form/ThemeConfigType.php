<?php

declare(strict_types=1);

namespace App\Form;

use App\Theme\ThemeSchema;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Formulaire dynamique construit à partir du schéma theme.yaml (vars, body, h1–h6, div, p).
 */
class ThemeConfigType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('vars', ThemeVarsType::class);

        $fonts = $options['fonts'] ?? [];
        foreach (ThemeSchema::BLOCKS as $block) {
            $builder->add($block, ThemeBlockType::class, [
                'block' => $block,
                'label' => $block,
                'fonts' => $fonts,
            ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['fonts' => []]);
    }
}
