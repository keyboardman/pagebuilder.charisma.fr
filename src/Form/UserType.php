<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints As Assert;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;

class UserType extends AbstractType
{
    public function __construct()
    {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            //->add('roles')
            ->add('plainPassword', RepeatedType::class, [
                'first_options' => [
                    'attr' => ['autocomplete' => 'new-password', 'placeholder' => 'Votre nouveau mot de passe'],
                    'constraints' => [
                        new Assert\Length(min: 6, minMessage: 'Votre mot de passe doit contenir au minimum {{ limit }} caractères', max: 4096),
                    ],
                    'label' => false,
                ],  
                'second_options' => [
                    'attr' => ['autocomplete' => 'new-password', 'placeholder' => 'Confirmer votre mot de passe'],
                    'label' => false,
                ],
                'invalid_message' => 'Les mots de passe ne correspondent pas.',
                'mapped' => false,
                'required' => false,
                'help' => 'Ne pas remplir si vous ne voulez pas changer de mot de passe',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
