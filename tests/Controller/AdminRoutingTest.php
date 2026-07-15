<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\Theme;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AdminRoutingTest extends WebTestCase
{
    private EntityManagerInterface $entityManager;

    protected function setUp(): void
    {
        self::ensureKernelShutdown();
        self::bootKernel();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);

        $metadata = $this->entityManager->getMetadataFactory()->getAllMetadata();
        $schemaTool = new SchemaTool($this->entityManager);
        $schemaTool->dropDatabase();
        if ($metadata !== []) {
            $schemaTool->createSchema($metadata);
        }

        self::ensureKernelShutdown();
    }

    public function testAdminRoutesRequireAuthentication(): void
    {
        $client = static::createClient();

        foreach (['/admin/page/', '/admin/theme/', '/admin/font/'] as $path) {
            $client->request('GET', $path);
            self::assertResponseRedirects('/login');
        }
    }

    public function testThemeCssAssetIsPublic(): void
    {
        $client = static::createClient();
        $theme = $this->createThemeWithCss();

        $client->request('GET', '/assets/theme/' . $theme->getId() . '/css');

        self::assertResponseIsSuccessful();
        self::assertSame('text/css; charset=utf-8', $client->getResponse()->headers->get('Content-Type'));
    }

    public function testPageRenderRemainsPublic(): void
    {
        $client = static::createClient();
        $theme = $this->createThemeWithCss();

        $page = new \App\Entity\Page();
        $page->setTitle('Public');
        $page->setSlug('public-slug');
        $page->setTheme($theme);
        $page->setContent(['root' => ['id' => 'root']]);
        $page->setRender('<html><head></head><body><div id="page-preview-root"></div></body></html>');
        $this->entityManager->persist($page);
        $this->entityManager->flush();

        $client->request('GET', '/page/render/public-slug');

        self::assertResponseIsSuccessful();
    }

    public function testLegacyFontFileRedirectIsPublic(): void
    {
        $client = static::createClient();

        $client->request('GET', '/font/file/legacy-test/test.woff2');

        self::assertResponseRedirects('/assets/font/file/legacy-test/test.woff2', 301);
    }

    public function testMediaFileIsPublicAndHasCorsHeader(): void
    {
        $client = static::createClient();
        $projectDir = static::getContainer()->getParameter('kernel.project_dir');
        $mediaDir = $projectDir . '/public/media/icons';
        if (!is_dir($mediaDir)) {
            mkdir($mediaDir, 0755, true);
        }
        file_put_contents($mediaDir . '/phone.svg', '<svg xmlns="http://www.w3.org/2000/svg"></svg>');

        $client->request('GET', '/media/icons/phone.svg');

        self::assertResponseIsSuccessful();
        self::assertSame('*', $client->getResponse()->headers->get('Access-Control-Allow-Origin'));
    }

    public function testFilemanagerMediaRouteIsPublicAndHasCorsHeader(): void
    {
        $client = static::createClient();
        $projectDir = static::getContainer()->getParameter('kernel.project_dir');
        $mediaDir = $projectDir . '/public/media';
        if (!is_dir($mediaDir)) {
            mkdir($mediaDir, 0755, true);
        }
        file_put_contents($mediaDir . '/les_cultes.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='));

        $client->request('GET', '/kbd/filemanager/media/default/les_cultes.png');

        self::assertResponseIsSuccessful();
        self::assertSame('image/png', $client->getResponse()->headers->get('Content-Type'));
        self::assertSame('*', $client->getResponse()->headers->get('Access-Control-Allow-Origin'));
    }

    public function testFilemanagerUiRequiresAuthentication(): void
    {
        $client = static::createClient();

        $client->request('GET', '/kbd/filemanager');

        self::assertResponseRedirects('/login');
    }

    public function testPagesListShowsMediaUploadGuidelines(): void
    {
        $client = static::createClient();
        $admin = $this->createUser('admin-pages-guidelines@example.test');
        $client->loginUser($admin);

        $client->request('GET', '/admin/page/');

        self::assertResponseIsSuccessful();
        self::assertStringContainsString('Conventions médias', $client->getResponse()->getContent());
        self::assertStringContainsString('1920 × 800 px', $client->getResponse()->getContent());
    }

    public function testRootRedirectsToAdminDashboardWhenAuthenticated(): void
    {
        $client = static::createClient();
        $admin = $this->createUser('admin-routing@example.test');
        $client->loginUser($admin);

        $client->request('GET', '/');

        self::assertResponseRedirects('/admin');
    }

    private function createUser(string $email): User
    {
        $user = new User();
        $user->setEmail($email);
        $user->setRoles(['ROLE_ADMIN']);
        $user->setActif(true);

        $hasher = static::getContainer()->get(UserPasswordHasherInterface::class);
        $user->setPassword($hasher->hashPassword($user, 'test-password'));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }

    private function createThemeWithCss(): Theme
    {
        $projectDir = static::getContainer()->getParameter('kernel.project_dir');
        $cssDir = $projectDir . '/storage/themes/theme-test';
        if (!is_dir($cssDir)) {
            mkdir($cssDir, 0755, true);
        }
        $cssPath = 'storage/themes/theme-test/theme.test.css';
        file_put_contents($projectDir . '/' . $cssPath, 'body { color: red; }');

        $theme = new Theme();
        $theme->setName('Test theme');
        $theme->setSlug('test-theme');
        $theme->setGeneratedCssPath($cssPath);
        $this->entityManager->persist($theme);
        $this->entityManager->flush();

        return $theme;
    }
}
