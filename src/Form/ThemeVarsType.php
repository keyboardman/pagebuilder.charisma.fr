<?php

declare(strict_types=1);

namespace App\Form;

use App\Theme\ThemeSchema;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ThemeVarsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        foreach (ThemeSchema::VAR_KEYS as $canonical) {
            $formName = ThemeSchema::toFormName($canonical);
            $builder->add($formName, TextType::class, [
                'required' => false,
                'label' => $canonical,
            ]);
        }

        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event): void {
            $data = $event->getData();
            if (!is_array($data)) {
                return;
            }
            $out = [];
            foreach ($data as $k => $v) {
                $out[ThemeSchema::toFormName((string) $k)] = $v;
            }
            $event->setData($out);
        });

        $builder->addEventListener(FormEvents::SUBMIT, function (FormEvent $event): void {
            $data = $event->getData();
            if (!is_array($data)) {
                return;
            }
            $out = [];
            foreach ($data as $k => $v) {
                $out[ThemeSchema::toCanonicalName((string) $k)] = $v;
            }
            $event->setData($out);
        });
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['label' => 'Variables']);
    }
}
