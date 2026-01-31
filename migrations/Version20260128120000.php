<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260128120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add config (JSON) column to theme table for ThemeConfigDTO.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE theme ADD config JSON DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE theme DROP config');
    }
}
