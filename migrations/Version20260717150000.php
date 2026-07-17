<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use App\PageBuilder\ApiCollection\ApiCollectionDefinitionSeeder;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Seed de la source videos (Hydra JSON-LD) dans api_collection_definition.
 *
 * Idempotent via ApiCollectionDefinitionSeeder::seed() (n’insère que les lignes manquantes).
 * Rollback : DELETE WHERE api_id = 'videos' ; re-taguer CharismaVideosApiCard dans services.yaml.
 */
final class Version20260717150000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Seed api_collection_definition videos (media.jsonld + filtres picking)';
    }

    public function up(Schema $schema): void
    {
        ApiCollectionDefinitionSeeder::seed($this->connection);
    }

    public function down(Schema $schema): void
    {
        $this->connection->executeStatement(
            "DELETE FROM api_collection_definition WHERE api_id = 'videos'",
        );
    }
}
