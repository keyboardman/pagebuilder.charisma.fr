<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-user',
    description: 'Créer un compte utilisateur',
)]
class CreateUserCommand extends Command
{

    public function __construct(private readonly EntityManagerInterface $em, private readonly UserPasswordHasherInterface $encoder)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Creation compte utilisateur')
            ->addArgument('email', InputArgument::REQUIRED, 'Email')
            ->addArgument('password', InputArgument::REQUIRED, 'Mot de passe')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        new SymfonyStyle($input, $output);
        $email = $input->getArgument('email');
        $motDePasse = $input->getArgument('password');


        $compte = (new User())
            ->setEmail($email)
            ->setActif(true)
        ;

        $compte->setPassword(
            $this->encoder->hashPassword($compte, $motDePasse)
        );

        $this->em->persist($compte);

        $this->em->flush();

        return Command::SUCCESS;
    }
}