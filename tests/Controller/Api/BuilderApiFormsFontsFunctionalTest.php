<?php

declare(strict_types=1);

namespace App\Tests\Controller\Api;

use App\Entity\BuilderFormConfig;
use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class BuilderApiFormsFontsFunctionalTest extends WebTestCase
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

    public function testFormsCatalogReturnsItems(): void
    {
        $slug = 'contact-demo';
        $form = (new BuilderFormConfig())
            ->setSlug($slug)
            ->setLabel('Contact')
            ->setRecipientEmails(['contact@example.org'])
            ->setEmailSubjectTemplate('Sujet')
            ->setEmailBodyTemplate('Corps');
        $this->entityManager->persist($form);
        $this->entityManager->flush();

        $client = static::createClient();
        $client->loginUser($this->createUser('forms-api@example.test'));

        $client->request('GET', '/api/page-builder/forms/catalog', server: [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        self::assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent() ?: '{}', true);
        self::assertIsArray($data);
        self::assertArrayHasKey('items', $data);
        self::assertNotEmpty($data['items']);
        self::assertSame($slug, $data['items'][0]['id'] ?? null);
        self::assertSame(
            '/api/page-builder/forms/' . $slug . '/submit',
            $data['items'][0]['action'] ?? null,
        );
    }

    public function testFontsListReturnsItemsAndTotal(): void
    {
        $font = (new Font())
            ->setName('Roboto API')
            ->setType(FontTypeEnum::Google)
            ->setFallback('sans-serif')
            ->setSlug('roboto-api')
            ->setGoogleFontUrl('https://fonts.googleapis.com/css2?family=Roboto');
        $this->entityManager->persist($font);
        $this->entityManager->flush();

        $client = static::createClient();
        $client->loginUser($this->createUser('fonts-api@example.test'));

        $client->request('GET', '/api/page-builder/fonts', server: [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        self::assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent() ?: '{}', true);
        self::assertArrayHasKey('items', $data);
        self::assertArrayHasKey('total', $data);
        self::assertGreaterThan(0, $data['total']);
    }

    public function testFontResolveRequiresFamily(): void
    {
        $client = static::createClient();
        $client->loginUser($this->createUser('fonts-resolve@example.test'));

        $client->request('GET', '/api/page-builder/fonts/resolve', server: [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        self::assertResponseStatusCodeSame(400);
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
}
