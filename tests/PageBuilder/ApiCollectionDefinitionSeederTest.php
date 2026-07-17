<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\ApiCollection\ApiCollectionDefinitionSeeder;
use Doctrine\DBAL\DriverManager;
use PHPUnit\Framework\TestCase;

final class ApiCollectionDefinitionSeederTest extends TestCase
{
    public function testAllLabelsEndWithCollectionSuffix(): void
    {
        foreach (ApiCollectionDefinitionSeeder::definitions() as $row) {
            $this->assertStringEndsWith(' — Collection', $row['label'], $row['api_id']);
        }
    }

    public function testExcludedApisAreNotSeeded(): void
    {
        $ids = ApiCollectionDefinitionSeeder::seededApiIds();
        $this->assertNotContains('charisma_evenement_home', $ids);
        $this->assertNotContains('charisma_evenement_retrospective', $ids);
    }

    public function testVideosIsSeededWithHydraPathsAndFilters(): void
    {
        $ids = ApiCollectionDefinitionSeeder::seededApiIds();
        $this->assertContains('videos', $ids);

        $videos = null;
        foreach (ApiCollectionDefinitionSeeder::definitions() as $row) {
            if ($row['api_id'] === 'videos') {
                $videos = $row;
                break;
            }
        }

        $this->assertNotNull($videos);
        $this->assertSame('video', $videos['type']);
        $this->assertSame(['fixed', 'dynamic'], $videos['supported_modes']);
        $this->assertSame('hydra:member', $videos['member_path']);
        $this->assertSame('title', $videos['search_query_param']);
        $this->assertSame('viewCategorie', $videos['category_query_param']);
        $this->assertSame('https://content.charisma.fr/web/api/categories.json', $videos['categories_url']);
        $this->assertSame('nom', $videos['categories_id_path']);
        $this->assertSame('fullTitle', $videos['categories_label_path']);
        $this->assertStringContainsString('media.jsonld', $videos['endpoint_url']);
    }

    public function testSeedIsIdempotentAndDoesNotOverwrite(): void
    {
        $connection = DriverManager::getConnection([
            'driver' => 'pdo_sqlite',
            'memory' => true,
        ]);
        $connection->executeStatement(<<<'SQL'
            CREATE TABLE api_collection_definition (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                api_id VARCHAR(64) NOT NULL UNIQUE,
                label VARCHAR(255) NOT NULL,
                type VARCHAR(16) NOT NULL,
                supported_modes CLOB NOT NULL,
                endpoint_url VARCHAR(2000) NOT NULL,
                item_url_template VARCHAR(2000) DEFAULT NULL,
                image_prefix VARCHAR(2000) DEFAULT NULL,
                query_params CLOB NOT NULL,
                pagination_style VARCHAR(16) NOT NULL,
                member_path VARCHAR(128) NOT NULL,
                field_mapping CLOB NOT NULL,
                headers CLOB NOT NULL,
                search_query_param VARCHAR(128) DEFAULT NULL,
                category_query_param VARCHAR(128) DEFAULT NULL,
                categories_url VARCHAR(2000) DEFAULT NULL,
                categories_member_path VARCHAR(128) DEFAULT 'member' NOT NULL,
                categories_id_path VARCHAR(128) DEFAULT 'id' NOT NULL,
                categories_label_path VARCHAR(128) DEFAULT 'label' NOT NULL,
                enabled BOOLEAN DEFAULT 1 NOT NULL
            )
        SQL);

        $first = ApiCollectionDefinitionSeeder::seed($connection);
        $this->assertSame(\count(ApiCollectionDefinitionSeeder::definitions()), $first);

        $connection->update(
            'api_collection_definition',
            ['label' => 'Custom admin label'],
            ['api_id' => 'charisma_article_enaction_home'],
        );

        $second = ApiCollectionDefinitionSeeder::seed($connection);
        $this->assertSame(0, $second);

        $label = $connection->fetchOne(
            'SELECT label FROM api_collection_definition WHERE api_id = ?',
            ['charisma_article_enaction_home'],
        );
        $this->assertSame('Custom admin label', $label);
    }
}
