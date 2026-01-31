<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Theme\ThemeSchema;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Formulaire dynamique construit à partir du schéma theme.yaml (vars, body, h1–h6, div, p).
 * Inclut un champ fonts (IDS des polices à importer) géré par le composant React ThemeFontPicker.
 */
class ThemeConfigType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $fontsField = $builder->add('fonts', TextType::class, [
            'required' => false,
            'label' => false,
            'attr' => ['type' => 'hidden', 'id' => 'theme-config-fonts'],
        ]);
        $fontsField->addModelTransformer(new CallbackTransformer(
            function (mixed $ids): string {
                if ($ids === null || $ids === []) {
                    return '';
                }
                if (is_string($ids)) {
                    return $ids;
                }
                if (!is_array($ids)) {
                    return '';
                }
                $list = [];
                foreach ($ids as $id) {
                    if (is_scalar($id)) {
                        $n = (int) $id;
                        if ($n > 0) {
                            $list[] = $n;
                        }
                    }
                }

                return $list === [] ? '' : implode(',', array_map('strval', $list));
            },
            function (?string $v): array {
                if ($v === null || trim($v) === '') {
                    return [];
                }
                return array_values(array_filter(array_map('intval', explode(',', $v)), fn (int $n): bool => $n > 0));
            }
        ));

        $builder->add('vars', ThemeVarsType::class);

        $allFonts = $options['fonts'] ?? [];
        $selectedIds = array_map('intval', (array) ($options['selected_font_ids'] ?? []));
        $filteredFonts = $this->filterFontsForBlocks($allFonts, $selectedIds);

        foreach (ThemeSchema::BLOCKS as $block) {
            $builder->add($block, ThemeBlockType::class, [
                'block' => $block,
                'label' => $block,
                'fonts' => $filteredFonts,
            ]);
        }
    }

    /**
     * Polices disponibles pour les champs font-family : Native toujours, Google/Custom seulement si dans selectedIds.
     *
     * @param list<Font> $allFonts
     * @param list<int>  $selectedIds
     * @return list<Font>
     */
    private function filterFontsForBlocks(array $allFonts, array $selectedIds): array
    {
        if ($selectedIds === []) {
            return $allFonts;
        }
        return array_values(array_filter($allFonts, function (Font $f) use ($selectedIds): bool {
            if ($f->getType() === FontTypeEnum::Native) {
                return true;
            }
            return in_array((int) $f->getId(), $selectedIds, true);
        }));
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['fonts' => [], 'selected_font_ids' => []]);
    }
}
