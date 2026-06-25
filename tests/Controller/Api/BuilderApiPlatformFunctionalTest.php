<?php

declare(strict_types=1);

namespace App\Tests\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class BuilderApiPlatformFunctionalTest extends WebTestCase
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

    public function testCardsListIsPubliclyAccessible(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/page-builder/cards', server: [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        self::assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent() ?: '[]', true);
        self::assertIsArray($data);
    }

    public function testCardsListReturnsRegisteredApis(): void
    {
        $client = static::createClient();
        $client->loginUser($this->createUser('builder-api@example.test'));

        $client->request('GET', '/api/page-builder/cards', server: [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        self::assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent() ?: '[]', true);
        self::assertIsArray($data);

        $ids = array_column($data, 'id');
        self::assertContains('stub-nav-list', $ids);
    }

    public function testCardItemsPageReturnsMappedCollection(): void
    {
        $client = static::createClient();
        $client->loginUser($this->createUser('builder-api-items@example.test'));

        $client->request('GET', '/api/page-builder/cards/stub-nav-list/items', server: [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        self::assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent() ?: '{}', true);
        self::assertIsArray($data);
        self::assertArrayHasKey('items', $data);
        self::assertArrayHasKey('total', $data);
        self::assertGreaterThan(0, $data['total']);
        self::assertSame('home', $data['items'][0]['id'] ?? null);
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
