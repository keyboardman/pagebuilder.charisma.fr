<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Form\UserAddType;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route(path: '/admin')]
class AdminController extends AbstractController
{
    public function __construct(private readonly UserPasswordHasherInterface $encoder)
    {
    }
    #[Route(path: '/', name: 'app_admin')]
    public function index(): Response
    {
       return $this->redirectToRoute('app_admin_comptes');
    }

    #[Route(path: '/comptes', name: 'app_admin_comptes')]
    public function comptes(UserRepository $userRepository): Response
    {
        $comptes = $userRepository->findBy([], ['email' => "ASC"]);

        return $this->render('admin/user/index.html.twig', [
            'comptes' => $comptes
        ]);
    }


    #[Route(path: '/compte/add', name: 'app_admin_compte_add')]
    public function add(Request $request, UserRepository $userRepository): Response
    {
        $user = (new User())
            ->setCreatedAt(new \DateTimeImmutable('now'))
        ;
        
        $form = $this->createForm(UserAddType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            
            $plainPassword = $form->get('plainPassword')->getData();
            if($plainPassword) {
                $user->setPassword(
                    $this->encoder->hashPassword($user, $plainPassword)
                );
            }
            
            $userRepository->add($user, true);
            
            return $this->redirectToRoute('app_admin_compte_edit', ['id' => $user->getId()]);
        }

        return $this->render('admin/user/add.html.twig', [ 
            'form' => $form->createView() 
        ]);
    }

    #[Route(path: '/compte/{id}/edit', name: 'app_admin_compte_edit')]
    public function edit(User $user, Request $request, UserRepository $userRepository): Response
    {
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = $form->get('plainPassword')->getData();
            if($plainPassword) {
                $user->setPassword(
                    $this->encoder->hashPassword($user, $plainPassword)
                );
            }
            
            $userRepository->add($user, true);
        }

        return $this->render('admin/user/add.html.twig', [ 
            'form' => $form->createView() 
        ]);
    }

}
