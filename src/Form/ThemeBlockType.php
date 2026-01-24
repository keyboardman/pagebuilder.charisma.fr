<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Font;
use App\Theme\ThemeSchema;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ThemeBlockType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $block = $options['block'];
        $fonts = array_values(array_filter($options['fonts'] ?? [], fn ($f) => $f instanceof Font));
        foreach (ThemeSchema::getBlockKeys($block) as $key) {
            if ($key === 'font-family') {
                $builder->add($key, ChoiceType::class, [
                    'required' => false,
                    'label' => $key,
                    'choices' => $fonts,
                    'choice_value' => fn (?Font $f) => $f ? ($f->getName() . ', ' . $f->getFallback()) : '',
                    'choice_label' => fn (?Font $f) => $f ? $f->getName() : '',
                    'choice_attr' => function (?Font $f): array {
                        if (!$f) {
                            return [];
                        }
                        $n = $f->getName();
                        $fb = $f->getFallback();
                        $quoted = (str_contains($n, ' ') || str_contains($n, "'"))
                            ? "'" . str_replace("'", "\\'", $n) . "'" : $n;

                        return ['style' => 'font-family: ' . $quoted . ', ' . $fb];
                    },
                    'placeholder' => '—',
                    'attr' => ['data-controller' => 'font-family-autocomplete'],
                ]);
            } elseif ($key === 'font-weight') {
                $builder->add($key, ChoiceType::class, [
                    'required' => false,
                    'label' => $key,
                    'choices' => array_flip(ThemeSchema::FONT_WEIGHT_CHOICES),
                    'placeholder' => '—',
                ]);
            } elseif ($key === 'font-style') {
                $builder->add($key, ChoiceType::class, [
                    'required' => false,
                    'label' => $key,
                    'choices' => array_flip(ThemeSchema::FONT_STYLE_CHOICES),
                    'placeholder' => '—',
                ]);
            } else {
                $builder->add($key, TextType::class, [
                    'required' => false,
                    'label' => $key,
                ]);
            }
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->define('block');
        $resolver->setAllowedTypes('block', 'string');
        $resolver->setRequired('block');
        $resolver->setDefaults(['fonts' => []]);
    }
}
