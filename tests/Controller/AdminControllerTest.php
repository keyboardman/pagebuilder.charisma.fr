<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AdminControllerTest extends WebTestCase
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

    public function testDeleteAccountSuccess(): void
    {
        $client = static::createClient();
        $admin = $this->createUser('admin@example.test');
        $target = $this->createUser('target@example.test');
        $client->loginUser($admin);
        $token = $this->fetchDeleteTokenFromAccountsPage($client, (int) $target->getId());

        $client->request('POST', '/admin/compte/' . $target->getId() . '/delete', [
            '_token' => $token,
        ]);

        self::assertResponseRedirects('/admin/comptes');
        $client->followRedirect();
        self::assertSelectorTextContains('body', 'a ete supprime');
        self::assertNull($this->entityManager->getRepository(User::class)->find($target->getId()));
    }

    public function testDeleteOwnAccountIsRefused(): void
    {
        $client = static::createClient();
        $admin = $this->createUser('self@example.test');
        $client->loginUser($admin);
        $token = $this->fetchDeleteTokenFromAccountsPage($client, (int) $admin->getId());

        $client->request('POST', '/admin/compte/' . $admin->getId() . '/delete', [
            '_token' => $token,
        ]);

        self::assertResponseRedirects('/admin/comptes');
        $client->followRedirect();
        self::assertSelectorTextContains('body', 'Vous ne pouvez pas supprimer votre propre compte');
        self::assertNotNull($this->entityManager->getRepository(User::class)->find($admin->getId()));
    }

    public function testDeleteAccountWithInvalidCsrfIsRefused(): void
    {
        $client = static::createClient();
        $admin = $this->createUser('admin2@example.test');
        $target = $this->createUser('target2@example.test');
        $client->loginUser($admin);
        $validToken = $this->fetchDeleteTokenFromAccountsPage($client, (int) $target->getId());
        $invalidToken = $validToken . '-invalid';

        $client->request('POST', '/admin/compte/' . $target->getId() . '/delete', [
            '_token' => $invalidToken,
        ]);

        self::assertResponseRedirects('/admin/comptes');
        $client->followRedirect();
        self::assertSelectorTextContains('body', 'Le jeton de securite est invalide');
        self::assertNotNull($this->entityManager->getRepository(User::class)->find($target->getId()));
    }

    private function fetchDeleteTokenFromAccountsPage($client, int $userId): string
    {
        $crawler = $client->request('GET', '/admin/comptes');
        $tokenInput = $crawler->filter(sprintf('form[action="/admin/compte/%d/delete"] input[name="_token"]', $userId));
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
}
