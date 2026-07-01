<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\Page;
use App\Entity\Theme;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PageControllerTest extends WebTestCase
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

    public function testDuplicatePageCreatesEditableCopy(): void
    {
        $client = static::createClient();
        $admin = $this->createUser('admin-page@example.test');
        $source = $this->createPage('Landing Page', 'landing-page');
        $source->setMetaTitle('Landing SEO Title');
        $this->entityManager->flush();
        $client->loginUser($admin);

        $token = $this->fetchDuplicateTokenFromPagesList($client, (int) $source->getId());

        $client->request('POST', '/admin/page/duplicate/' . $source->getId(), [
            '_token' => $token,
        ]);

        self::assertResponseRedirects();
        $location = (string) $client->getResponse()->headers->get('Location');
        self::assertMatchesRegularExpression('#/admin/page/edit/\d+$#', $location);

        /** @var Page[] $pages */
        $pages = $this->entityManager->getRepository(Page::class)->findBy([], ['id' => 'ASC']);
        self::assertCount(2, $pages);

        $copy = $pages[1];
        self::assertNotSame($source->getId(), $copy->getId());
        self::assertSame('Landing Page (copie)', $copy->getTitle());
        self::assertNotSame($source->getSlug(), $copy->getSlug());
        self::assertStringStartsWith('landing-page-copie', $copy->getSlug());
        self::assertSame($source->getTheme()?->getId(), $copy->getTheme()?->getId());
        self::assertSame($source->getDescription(), $copy->getDescription());
        self::assertSame($source->getMetaTitle(), $copy->getMetaTitle());
        self::assertSame($source->getContent(), $copy->getContent());
        self::assertSame($source->getRender(), $copy->getRender());
    }

    public function testRenderPageContainsAbsoluteApiBaseUrl(): void
    {
        $client = static::createClient();
        $page = $this->createPage('Public Page', 'public-page');

        $client->request('GET', '/page/render/' . $page->getSlug());

        self::assertResponseIsSuccessful();
        $apiBaseUrl = $client->getCrawler()->filter('#page-preview-root')->attr('data-api-cards-base-url');
        self::assertMatchesRegularExpression(
            '#^https?://[^/]+/api/page-builder$#',
            (string) $apiBaseUrl,
        );
    }

    public function testRenderPageUsesMetaTitleInDocumentTitle(): void
    {
        $client = static::createClient();
        $page = $this->createPage('Public Page', 'public-page-meta');
        $page->setMetaTitle('SEO Meta Title');
        $this->entityManager->flush();

        $crawler = $client->request('GET', '/page/render/' . $page->getSlug());

        self::assertResponseIsSuccessful();
        self::assertSame('SEO Meta Title', trim($crawler->filter('title')->text()));
    }

    public function testRenderPageFallsBackToTitleWhenMetaTitleIsEmpty(): void
    {
        $client = static::createClient();
        $page = $this->createPage('Fallback Title', 'fallback-title-page');

        $crawler = $client->request('GET', '/page/render/' . $page->getSlug());

        self::assertResponseIsSuccessful();
        self::assertSame('Fallback Title', trim($crawler->filter('title')->text()));
    }

    public function testEditPagePersistsMetaTitle(): void
    {
        $client = static::createClient();
        $admin = $this->createUser('admin-page-meta@example.test');
        $page = $this->createPage('Editable Page', 'editable-page');
        $client->loginUser($admin);

        $crawler = $client->request('GET', '/admin/page/edit/' . $page->getId());
        self::assertResponseIsSuccessful();

        $form = $crawler->selectButton('Enregistrer')->form([
            'admin_page_form[metaTitle]' => 'Nouveau titre SEO',
            'admin_page_form[title]' => 'Editable Page',
            'admin_page_form[description]' => 'Description test',
        ]);

        $client->submit($form);
        self::assertResponseRedirects('/admin/page/edit/' . $page->getId());

        $this->entityManager->clear();
        $updated = $this->entityManager->getRepository(Page::class)->find($page->getId());
        self::assertNotNull($updated);
        self::assertSame('Nouveau titre SEO', $updated->getMetaTitle());
    }

    public function testDuplicatePageWithInvalidCsrfIsRefused(): void
    {
        $client = static::createClient();
        $admin = $this->createUser('admin-page-csrf@example.test');
        $source = $this->createPage('Pricing', 'pricing');
        $client->loginUser($admin);

        $client->request('POST', '/admin/page/duplicate/' . $source->getId(), [
            '_token' => 'invalid-token',
        ]);

        self::assertResponseRedirects('/admin/page/');
        /** @var Page[] $pages */
        $pages = $this->entityManager->getRepository(Page::class)->findBy([]);
        self::assertCount(1, $pages);
    }

    private function fetchDuplicateTokenFromPagesList($client, int $pageId): string
    {
        $crawler = $client->request('GET', '/admin/page/');
        $tokenInput = $crawler->filter(sprintf('form[action="/admin/page/duplicate/%d"] input[name="_token"]', $pageId));
        self::assertGreaterThan(0, $tokenInput->count());

        return (string) $tokenInput->attr('value');
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

    private function createPage(string $title, string $slug): Page
    {
        $theme = new Theme();
        $theme->setName('Theme test');
        $this->entityManager->persist($theme);

        $page = new Page();
        $page->setTitle($title);
        $page->setSlug($slug);
        $page->setTheme($theme);
        $page->setDescription('Description test');
        $page->setContent(['root' => ['id' => 'root']]);
        $page->setRender('<html><body>Test</body></html>');

        $this->entityManager->persist($page);
        $this->entityManager->flush();

        return $page;
    }
}
