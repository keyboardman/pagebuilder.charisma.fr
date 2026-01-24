<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration initiale minimale : initialise la table doctrine_migration_versions.
 * Aucun changement de schéma métier.
 */
final class Version20260124120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Migration initiale (no-op) : initialise doctrine_migration_versions.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('SELECT 1');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('SELECT 1');
    }
}
