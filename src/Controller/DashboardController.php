<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Font;
use App\Entity\Theme;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route(name: 'app_dashboard_')]
class DashboardController extends AbstractController
{
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): Response
    {
        $fontCount = $em->getRepository(Font::class)->count([]);
        $themeCount = $em->getRepository(Theme::class)->count([]);

        return $this->render('dashboard/index.html.twig', [
            'font_count' => $fontCount,
            'theme_count' => $themeCount,
        ]);
    }
}
