<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260203120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add page.render column (TEXT, nullable) for full HTML document storage.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE page ADD COLUMN render TEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE page DROP COLUMN render');
    }
}
