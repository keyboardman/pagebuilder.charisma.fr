<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260716152000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajoute image_prefix sur api_collection_definition';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE api_collection_definition ADD image_prefix VARCHAR(2000) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE api_collection_definition DROP image_prefix');
    }
}
