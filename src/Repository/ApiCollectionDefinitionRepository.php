<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\ApiCollectionDefinition;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ApiCollectionDefinition>
 */
final class ApiCollectionDefinitionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ApiCollectionDefinition::class);
    }

    /**
     * @return list<ApiCollectionDefinition>
     */
    public function findAllEnabled(): array
    {
        /** @var list<ApiCollectionDefinition> $rows */
        $rows = $this->createQueryBuilder('d')
            ->where('d.enabled = true')
            ->orderBy('d.label', 'ASC')
            ->getQuery()
            ->getResult();

        return $rows;
    }
}
