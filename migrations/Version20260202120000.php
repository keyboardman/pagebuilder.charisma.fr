<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260202120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Change page.content from TEXT to JSON type.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE page ALTER COLUMN content TYPE JSON USING content::json');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE page ALTER COLUMN content TYPE TEXT USING content::text');
    }
}
