<?php

declare(strict_types=1);

namespace App\Tests\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class BuilderApiCategoriesFunctionalTest extends WebTestCase
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

    public function testFlashnewsCategoriesReturnsJsonArray(): void
    {
        $client = static::createClient();
        $client->loginUser($this->createUser('categories@example.test'));

        $client->request('GET', '/api/page-builder/cards/flashnews/categories', server: [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        self::assertResponseIsSuccessful();
        $content = $client->getResponse()->getContent() ?: '[]';
        $data = json_decode($content, true);
        self::assertIsArray($data);
        self::assertNotEmpty($data);
        self::assertArrayHasKey('id', $data[0]);
        self::assertArrayHasKey('label', $data[0]);
    }

    public function testStubNavListCategoriesReturnsEmptyArray(): void
    {
        $client = static::createClient();
        $client->loginUser($this->createUser('stub-categories@example.test'));

        $client->request('GET', '/api/page-builder/cards/stub-nav-list/categories', server: [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        self::assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent() ?: '[]', true);
        self::assertSame([], $data);
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
