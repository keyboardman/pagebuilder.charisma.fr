<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Filtres picking ApiCollection : search/category query params + catégories.
 *
 * Les UPDATE passent aussi par addSql pour s’exécuter après les ALTER (pas via
 * $this->connection->update() immédiat, qui voit encore l’ancien schéma).
 */
final class Version20260717140000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajoute search/category/categories* sur api_collection_definition + seed data filtres';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE api_collection_definition ADD search_query_param VARCHAR(128) DEFAULT NULL');
        $this->addSql('ALTER TABLE api_collection_definition ADD category_query_param VARCHAR(128) DEFAULT NULL');
        $this->addSql('ALTER TABLE api_collection_definition ADD categories_url VARCHAR(2000) DEFAULT NULL');
        $this->addSql("ALTER TABLE api_collection_definition ADD categories_member_path VARCHAR(128) DEFAULT 'member' NOT NULL");
        $this->addSql("ALTER TABLE api_collection_definition ADD categories_id_path VARCHAR(128) DEFAULT 'id' NOT NULL");
        $this->addSql("ALTER TABLE api_collection_definition ADD categories_label_path VARCHAR(128) DEFAULT 'label' NOT NULL");

        // Flashnews : search → titre, category → themes, catégories via /api/themes
        foreach (['flashnews', 'flashnews_article', 'flashnews_article_home'] as $apiId) {
            $this->addSql(
                "UPDATE api_collection_definition SET
                    search_query_param = 'titre',
                    category_query_param = 'themes',
                    categories_url = 'https://www.flashnews.fr/api/themes',
                    categories_member_path = 'member',
                    categories_id_path = 'nom',
                    categories_label_path = 'nom'
                 WHERE api_id = ?",
                [$apiId],
            );
        }

        // Charisma articles / témoignages dynamic : search → titre
        foreach ([
            'charisma_article_enaction',
            'charisma_article_expression',
            'charisma_temoignage',
            'charisma_article_auteur',
            'charisma_article_temoignage',
            'charisma_evenement',
        ] as $apiId) {
            $this->addSql(
                "UPDATE api_collection_definition SET search_query_param = 'titre' WHERE api_id = ?",
                [$apiId],
            );
        }
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE api_collection_definition DROP search_query_param');
        $this->addSql('ALTER TABLE api_collection_definition DROP category_query_param');
        $this->addSql('ALTER TABLE api_collection_definition DROP categories_url');
        $this->addSql('ALTER TABLE api_collection_definition DROP categories_member_path');
        $this->addSql('ALTER TABLE api_collection_definition DROP categories_id_path');
        $this->addSql('ALTER TABLE api_collection_definition DROP categories_label_path');
    }
}
