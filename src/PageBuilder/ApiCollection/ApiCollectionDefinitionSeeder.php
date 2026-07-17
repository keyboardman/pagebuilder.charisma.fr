<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

use Doctrine\DBAL\Connection;

/**
 * Seed idempotent des ApiList / ApiCard exprimables vers api_collection_definition.
 *
 * Hors scope v1 (restent adapters PHP actifs) :
 * - charisma_evenement_home / charisma_evenement_retrospective (pagination custom)
 *
 * Classes PHP seedées : tags DI retirés + @deprecated (conservées pour rollback / tests).
 *
 * Rollback : DELETE FROM api_collection_definition WHERE api_id IN (…ids seedés…)
 * puis re-taguer les services ApiList* / ApiCard correspondants dans config/services.yaml.
 */
final class ApiCollectionDefinitionSeeder
{
    private const LABEL_SUFFIX = ' — Collection';

    private const FLASHNEWS_THEMES_URL = 'https://www.flashnews.fr/api/themes';

    private const VIDEOS_CATEGORIES_URL = 'https://content.charisma.fr/web/api/categories.json';

    /**
     * @return list<array{
     *   api_id: string,
     *   label: string,
     *   type: string,
     *   supported_modes: list<string>,
     *   endpoint_url: string,
     *   item_url_template: ?string,
     *   image_prefix: ?string,
     *   query_params: array<string, string>,
     *   pagination_style: string,
     *   member_path: string,
     *   field_mapping: array<string, string>,
     *   headers: array<string, string>,
     *   search_query_param: ?string,
     *   category_query_param: ?string,
     *   categories_url: ?string,
     *   categories_member_path: string,
     *   categories_id_path: string,
     *   categories_label_path: string,
     *   enabled: bool
     * }>
     */
    public static function definitions(): array
    {
        $charismaArticleMapping = [
            'id' => 'id',
            'title' => 'titre',
            'description' => 'resume',
            'link' => 'url',
            'counter' => 'vues',
            'like' => 'likes',
        ];

        $temoignageMapping = [
            'id' => 'id',
            'title' => 'titre',
            'description' => 'resume',
            'link' => 'url',
            'image' => 'thumbnails.normal',
        ];

        $flashnewsArticleMapping = [
            'id' => 'id',
            'title' => 'titre',
            'description' => 'viewResume',
            'link' => 'link',
            'counter' => 'compteur',
            'like' => 'likes',
        ];

        $flashnewsFilters = [
            'search_query_param' => 'titre',
            'category_query_param' => 'themes',
            'categories_url' => self::FLASHNEWS_THEMES_URL,
            'categories_member_path' => 'member',
            'categories_id_path' => 'nom',
            'categories_label_path' => 'nom',
        ];

        $charismaSearchOnly = [
            'search_query_param' => 'titre',
        ];

        return [
            // ApiListArticle fixed
            self::row(
                'charisma_article_enaction_home',
                'En Action (home)',
                'article',
                ['fixed'],
                'https://api.charisma.fr/api/charisma/article/enactions',
                null,
                null,
                [],
                'hydra',
                $charismaArticleMapping,
            ),
            self::row(
                'charisma_article_expression_home',
                'Expressions (home)',
                'article',
                ['fixed'],
                'https://api.charisma.fr/api/charisma/article/expressions',
                null,
                null,
                [],
                'hydra',
                $charismaArticleMapping,
            ),
            self::row(
                'charisma_temoignage_home',
                'Témoignages (home)',
                'article',
                ['fixed'],
                'https://api.charisma.fr/api/charisma/temoignages',
                null,
                null,
                [],
                'hydra',
                $temoignageMapping,
            ),
            self::row(
                'flashnews_article_home',
                'Flashnews (home)',
                'article',
                ['fixed'],
                'https://www.flashnews.fr/api/articles',
                null,
                null,
                ['order[publication]' => 'desc'],
                'hydra',
                $flashnewsArticleMapping,
                $flashnewsFilters,
            ),
            self::row(
                'flashnews-themes',
                'Flashnews thèmes',
                'article',
                ['fixed'],
                'https://www.flashnews.fr/api/themes',
                null,
                null,
                ['pagination' => 'false'],
                'none',
                [
                    'id' => 'id',
                    'title' => 'nom',
                    'link' => 'link',
                ],
            ),
            // ApiListArticleDynamique
            self::row(
                'charisma_article_enaction',
                'En Action',
                'article',
                ['dynamic'],
                'https://api.charisma.fr/api/charisma/article/enactions',
                '{endpoint}/{id}',
                null,
                [],
                'hydra',
                $charismaArticleMapping,
                $charismaSearchOnly,
            ),
            self::row(
                'charisma_article_expression',
                'Expressions',
                'article',
                ['dynamic'],
                'https://api.charisma.fr/api/charisma/article/expressions',
                '{endpoint}/{id}',
                null,
                [],
                'hydra',
                $charismaArticleMapping,
                $charismaSearchOnly,
            ),
            self::row(
                'charisma_temoignage',
                'Témoignages',
                'article',
                ['dynamic'],
                'https://api.charisma.fr/api/charisma/temoignages',
                '{endpoint}/{id}',
                null,
                [],
                'hydra',
                $temoignageMapping,
                $charismaSearchOnly,
            ),
            self::row(
                'flashnews_article',
                'Flashnews',
                'article',
                ['dynamic'],
                'https://www.flashnews.fr/api/articles',
                '{endpoint}/{id}',
                null,
                ['order[publication]' => 'desc'],
                'hydra',
                $flashnewsArticleMapping,
                $flashnewsFilters,
            ),
            self::row(
                'charisma_article_auteur',
                'Articles Auteur',
                'article',
                ['dynamic'],
                'https://api.charisma.fr/api/charisma/article/auteurs',
                '{endpoint}/{id}',
                null,
                [],
                'hydra',
                $charismaArticleMapping + ['labels' => 'classements.?.nom', 'image' => 'auteur.photo'],
                $charismaSearchOnly,
            ),
            // ApiCard exprimables
            self::row(
                'flashnews',
                'Flashnews',
                'article',
                ['dynamic'],
                'https://www.flashnews.fr/api/articles',
                '{endpoint}/{id}',
                'https://www.flashnews.fr',
                [],
                'hydra',
                [
                    'id' => 'id',
                    'title' => 'titre',
                    'description' => 'viewResume',
                    'image' => 'image',
                    'link' => 'viewUrl',
                    'labels' => 'tags.member',
                ],
                $flashnewsFilters,
            ),
            self::row(
                'charisma_article_temoignage',
                'Articles Témoignage',
                'article',
                ['dynamic'],
                'https://api.charisma.fr/api/charisma/temoignages',
                '{endpoint}/{id}',
                null,
                [],
                'hydra',
                [
                    'id' => 'id',
                    'title' => 'titre',
                    'description' => 'resume',
                    'image' => 'thumbnails.normal',
                    'link' => 'url',
                    'label' => 'theme.nom',
                ],
                $charismaSearchOnly,
            ),
            self::row(
                'charisma_evenement',
                'Evènements',
                'image',
                ['dynamic'],
                'https://api.charisma.fr/api/charisma/evenements',
                '{endpoint}/{id}',
                null,
                [],
                'hydra',
                [
                    'id' => 'id',
                    'title' => 'titre',
                    'description' => 'resume',
                    'image' => 'thumbnails.normal',
                    'link' => 'url',
                ],
                $charismaSearchOnly,
            ),
            // ApiCard video (Hydra JSON-LD)
            self::row(
                'videos',
                'Videos',
                'video',
                ['fixed', 'dynamic'],
                'https://content.charisma.fr/web/api/media.jsonld',
                'https://content.charisma.fr/web/api/media/{id}.json',
                null,
                ['order[title]' => 'asc'],
                'hydra',
                [
                    'id' => 'id',
                    'title' => 'title',
                    'image' => 'thumbnails.medium',
                    'link' => 'play',
                    'like' => 'favori',
                ],
                [
                    'member_path' => 'hydra:member',
                    'search_query_param' => 'title',
                    'category_query_param' => 'viewCategorie',
                    'categories_url' => self::VIDEOS_CATEGORIES_URL,
                    'categories_member_path' => 'member',
                    'categories_id_path' => 'nom',
                    'categories_label_path' => 'fullTitle',
                ],
            ),
        ];
    }

    /**
     * @return list<string>
     */
    public static function seededApiIds(): array
    {
        return array_map(
            static fn (array $row): string => $row['api_id'],
            self::definitions(),
        );
    }

    /**
     * Insert les définitions manquantes. Ne réécrit jamais une ligne existante.
     *
     * @return int Nombre de lignes insérées
     */
    public static function seed(Connection $connection): int
    {
        $inserted = 0;

        foreach (self::definitions() as $row) {
            $exists = $connection->fetchOne(
                'SELECT 1 FROM api_collection_definition WHERE api_id = ?',
                [$row['api_id']],
            );
            if ($exists) {
                continue;
            }

            $connection->insert('api_collection_definition', [
                'api_id' => $row['api_id'],
                'label' => $row['label'],
                'type' => $row['type'],
                'supported_modes' => json_encode($row['supported_modes'], \JSON_THROW_ON_ERROR),
                'endpoint_url' => $row['endpoint_url'],
                'item_url_template' => $row['item_url_template'],
                'image_prefix' => $row['image_prefix'],
                'query_params' => json_encode($row['query_params'], \JSON_THROW_ON_ERROR),
                'pagination_style' => $row['pagination_style'],
                'member_path' => $row['member_path'],
                'field_mapping' => json_encode($row['field_mapping'], \JSON_THROW_ON_ERROR),
                'headers' => json_encode($row['headers'], \JSON_THROW_ON_ERROR),
                'search_query_param' => $row['search_query_param'],
                'category_query_param' => $row['category_query_param'],
                'categories_url' => $row['categories_url'],
                'categories_member_path' => $row['categories_member_path'],
                'categories_id_path' => $row['categories_id_path'],
                'categories_label_path' => $row['categories_label_path'],
                'enabled' => $row['enabled'],
            ]);
            ++$inserted;
        }

        return $inserted;
    }

    /**
     * @param list<string> $supportedModes
     * @param array<string, string> $queryParams
     * @param array<string, string> $fieldMapping
     * @param array{
     *   member_path?: string,
     *   search_query_param?: ?string,
     *   category_query_param?: ?string,
     *   categories_url?: ?string,
     *   categories_member_path?: string,
     *   categories_id_path?: string,
     *   categories_label_path?: string
     * } $filters
     *
     * @return array{
     *   api_id: string,
     *   label: string,
     *   type: string,
     *   supported_modes: list<string>,
     *   endpoint_url: string,
     *   item_url_template: ?string,
     *   image_prefix: ?string,
     *   query_params: array<string, string>,
     *   pagination_style: string,
     *   member_path: string,
     *   field_mapping: array<string, string>,
     *   headers: array<string, string>,
     *   search_query_param: ?string,
     *   category_query_param: ?string,
     *   categories_url: ?string,
     *   categories_member_path: string,
     *   categories_id_path: string,
     *   categories_label_path: string,
     *   enabled: bool
     * }
     */
    private static function row(
        string $apiId,
        string $baseLabel,
        string $type,
        array $supportedModes,
        string $endpointUrl,
        ?string $itemUrlTemplate,
        ?string $imagePrefix,
        array $queryParams,
        string $paginationStyle,
        array $fieldMapping,
        array $filters = [],
    ): array {
        return [
            'api_id' => $apiId,
            'label' => $baseLabel . self::LABEL_SUFFIX,
            'type' => $type,
            'supported_modes' => $supportedModes,
            'endpoint_url' => $endpointUrl,
            'item_url_template' => $itemUrlTemplate,
            'image_prefix' => $imagePrefix,
            'query_params' => $queryParams,
            'pagination_style' => $paginationStyle,
            'member_path' => $filters['member_path'] ?? 'member',
            'field_mapping' => $fieldMapping,
            'headers' => [],
            'search_query_param' => $filters['search_query_param'] ?? null,
            'category_query_param' => $filters['category_query_param'] ?? null,
            'categories_url' => $filters['categories_url'] ?? null,
            'categories_member_path' => $filters['categories_member_path'] ?? 'member',
            'categories_id_path' => $filters['categories_id_path'] ?? 'id',
            'categories_label_path' => $filters['categories_label_path'] ?? 'label',
            'enabled' => true,
        ];
    }
}
