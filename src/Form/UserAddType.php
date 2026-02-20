<?php

namespace App\Form;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints As Assert;

class UserAddType extends AbstractType
{
    public function __construct(private readonly UserRepository $userRepository) {}

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class, [])
            //->add('roles')
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'first_options' => [
                    'attr' => [
                        'autocomplete' => 'new-password',
                        'placeholder' => 'Votre nouveau mot de passe',
                    ],
                    'label' => false,
                    'constraints' => [
                        new Assert\NotBlank(message: 'Saisissez un mot de passe' ),
                        new Assert\Length(min: 6, minMessage: 'Votre mot de passe doit contenir au minimum {{ limit }} caractères', max: 4096),
                    ],
                ],
                'second_options' => [
                    'attr' => [
                        'autocomplete' => 'new-password',
                        'placeholder' => 'Confirmer votre mot de passe',
                    ],
                    'label' => false,
                ],
                'invalid_message' => 'Les mots de passe ne correspondent pas.',
                'mapped' => false,
            ])
            ->add('actif')
        ;

        $builder->get('email')->addEventListener(FormEvents::PRE_SUBMIT, $this->checkEmailExist(...));
    }

    public function checkEmailExist(FormEvent $event)
    {
        $email = $event->getData();
        $element = $event->getForm();
        if ($email) {
            $exist = $this->userRepository->findOneBy(['email' => $email]);
            if ($exist) {
                $element->addError(new FormError('L\'email existe déjà'));
            }
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }


}
