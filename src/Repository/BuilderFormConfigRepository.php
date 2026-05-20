<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\BuilderFormConfig;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<BuilderFormConfig>
 */
final class BuilderFormConfigRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BuilderFormConfig::class);
    }

    public function findEnabledBySlug(string $slug): ?BuilderFormConfig
    {
        return $this->findOneBy(['slug' => $slug, 'enabled' => true]);
    }

    /**
     * @return list<BuilderFormConfig>
     */
    public function findAllEnabledForCatalog(): array
    {
        /** @var list<BuilderFormConfig> $rows */
        $rows = $this->createQueryBuilder('f')
            ->where('f.enabled = true')
            ->orderBy('f.label', 'ASC')
            ->getQuery()
            ->getResult();

        return $rows;
    }
}
