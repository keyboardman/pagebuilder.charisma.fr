<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use App\PageBuilder\ApiCollection\ApiCollectionDefinitionSeeder;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Seed ApiList / ApiCard exprimables dans api_collection_definition.
 *
 * Hors scope (restent PHP) : charisma_evenement_home, charisma_evenement_retrospective.
 * Rollback : down() supprime les api_id seedés ; re-taguer les ApiList* dans services.yaml si besoin.
 */
final class Version20260716170000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Seed api_collection_definition depuis ApiList / ApiCard (labels … — Collection)';
    }

    public function up(Schema $schema): void
    {
        ApiCollectionDefinitionSeeder::seed($this->connection);
    }

    public function down(Schema $schema): void
    {
        $ids = ApiCollectionDefinitionSeeder::seededApiIds();
        if ($ids === []) {
            return;
        }

        $placeholders = implode(', ', array_fill(0, \count($ids), '?'));
        $this->connection->executeStatement(
            "DELETE FROM api_collection_definition WHERE api_id IN ($placeholders)",
            $ids,
        );
    }
}
