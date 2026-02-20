<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route(name: 'app_media_')]
class MediaController extends AbstractController
{
    #[Route('/media', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->redirectToRoute('keyboardman_filemanager');
    }
}
