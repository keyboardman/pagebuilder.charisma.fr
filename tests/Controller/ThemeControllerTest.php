<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\Theme;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ThemeControllerTest extends WebTestCase
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

    public function testDuplicateThemeCreatesEditableCopy(): void
    {
        $client = static::createClient();
        $admin = $this->createUser('admin-theme@example.test');
        $source = $this->createTheme('Charisma', 'charisma');
        $client->loginUser($admin);

        $token = $this->fetchDuplicateTokenFromThemesList($client, (int) $source->getId());

        $client->request('POST', '/theme/duplicate/' . $source->getId(), [
            '_token' => $token,
        ]);

        self::assertResponseRedirects();
        $location = (string) $client->getResponse()->headers->get('Location');
        self::assertMatchesRegularExpression('#/theme/edit/\d+$#', $location);

        $this->entityManager->clear();

        /** @var Theme[] $themes */
        $themes = $this->entityManager->getRepository(Theme::class)->findBy([], ['id' => 'ASC']);
        self::assertCount(2, $themes);

        $sourceReloaded = $themes[0];
        $copy = $themes[1];
        self::assertNotSame($sourceReloaded->getId(), $copy->getId());
        self::assertSame('Charisma', $sourceReloaded->getName());
        self::assertSame('Charisma (copie)', $copy->getName());
        self::assertNotSame($sourceReloaded->getSlug(), $copy->getSlug());
        self::assertStringStartsWith('charisma-copie', (string) $copy->getSlug());
        self::assertSame($sourceReloaded->getConfig()['vars'], $copy->getConfig()['vars']);
        self::assertSame($sourceReloaded->getConfig()['custom_css'], $copy->getConfig()['custom_css']);
        self::assertSame('Charisma (copie)', $copy->getConfig()['name']);
        self::assertNotSame($sourceReloaded->getGeneratedCssPath(), $copy->getGeneratedCssPath());
        self::assertStringContainsString('theme-' . $copy->getId(), $copy->getGeneratedCssPath());
    }

    public function testDuplicateThemeWithInvalidCsrfIsRefused(): void
    {
        $client = static::createClient();
        $admin = $this->createUser('admin-theme-csrf@example.test');
        $source = $this->createTheme('Minimal', 'minimal');
        $client->loginUser($admin);

        $client->request('POST', '/theme/duplicate/' . $source->getId(), [
            '_token' => 'invalid-token',
        ]);

        self::assertResponseRedirects('/theme/');
        /** @var Theme[] $themes */
        $themes = $this->entityManager->getRepository(Theme::class)->findBy([]);
        self::assertCount(1, $themes);
    }

    private function fetchDuplicateTokenFromThemesList($client, int $themeId): string
    {
        $crawler = $client->request('GET', '/theme/');
        $tokenInput = $crawler->filter(sprintf('form[action="/theme/duplicate/%d"] input[name="_token"]', $themeId));
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

    private function createTheme(string $name, string $slug): Theme
    {
        $theme = new Theme();
        $theme->setName($name);
        $theme->setSlug($slug);
        $theme->setConfig([
            'name' => $name,
            'fonts' => [],
            'vars' => ['--color-primary' => '#570df8'],
            'node_overrides' => ['nodeText' => 'color: red;'],
            'custom_css' => '.variant { color: blue; }',
            'icons' => [
                [
                    'id' => 'icon-1',
                    'name' => 'home',
                    'className' => '.icon-home',
                    'url' => '/assets/icons/home.svg',
                ],
            ],
            'video_player_icon_url' => '/assets/icons/play2.svg',
        ]);

        $this->entityManager->persist($theme);
        $this->entityManager->flush();

        return $theme;
    }
}
