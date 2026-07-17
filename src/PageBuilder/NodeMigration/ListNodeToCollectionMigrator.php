<?php

declare(strict_types=1);

namespace App\PageBuilder\NodeMigration;

/**
 * Transforme les nœuds legacy node-list-api / node-list-image en node-collection
 * dans une map de nœuds (page.content).
 */
final class ListNodeToCollectionMigrator
{
    public const TYPE_LIST_API = 'node-list-api';
    public const TYPE_LIST_IMAGE = 'node-list-image';
    public const TYPE_COLLECTION = 'node-collection';

    public const DEFAULT_LIST_GAP = 3;

    /**
     * @param array<string, mixed>|null $nodes Map id → nœud (page.content)
     *
     * @return array{
     *     content: array<string, mixed>|null,
     *     convertedListApi: int,
     *     convertedListImage: int,
     *     changed: bool
     * }
     */
    public static function migrate(?array $nodes): array
    {
        if ($nodes === null || $nodes === []) {
            return [
                'content' => $nodes,
                'convertedListApi' => 0,
                'convertedListImage' => 0,
                'changed' => false,
            ];
        }

        $convertedListApi = 0;
        $convertedListImage = 0;
        $changed = false;
        $result = [];

        foreach ($nodes as $id => $node) {
            if (!\is_array($node)) {
                $result[$id] = $node;
                continue;
            }

            $type = $node['type'] ?? null;
            if ($type === self::TYPE_LIST_API) {
                $result[$id] = self::mapListApiToCollection($node);
                ++$convertedListApi;
                $changed = true;
                continue;
            }

            if ($type === self::TYPE_LIST_IMAGE) {
                $result[$id] = self::mapListImageToCollection($node);
                ++$convertedListImage;
                $changed = true;
                continue;
            }

            // Idempotence : node-collection (et tout autre type) inchangé
            $result[$id] = $node;
        }

        return [
            'content' => $result,
            'convertedListApi' => $convertedListApi,
            'convertedListImage' => $convertedListImage,
            'changed' => $changed,
        ];
    }

    /**
     * Reverse best-effort via `_migratedFrom` (pour down() de migration).
     *
     * @param array<string, mixed>|null $nodes
     *
     * @return array{
     *     content: array<string, mixed>|null,
     *     revertedListApi: int,
     *     revertedListImage: int,
     *     changed: bool
     * }
     */
    public static function reverse(?array $nodes): array
    {
        if ($nodes === null || $nodes === []) {
            return [
                'content' => $nodes,
                'revertedListApi' => 0,
                'revertedListImage' => 0,
                'changed' => false,
            ];
        }

        $revertedListApi = 0;
        $revertedListImage = 0;
        $changed = false;
        $result = [];

        foreach ($nodes as $id => $node) {
            if (!\is_array($node) || ($node['type'] ?? null) !== self::TYPE_COLLECTION) {
                $result[$id] = $node;
                continue;
            }

            $content = \is_array($node['content'] ?? null) ? $node['content'] : [];
            $from = $content['_migratedFrom'] ?? null;

            if ($from === self::TYPE_LIST_API) {
                $result[$id] = self::mapCollectionBackToListApi($node, $content);
                ++$revertedListApi;
                $changed = true;
                continue;
            }

            if ($from === self::TYPE_LIST_IMAGE) {
                $result[$id] = self::mapCollectionBackToListImage($node, $content);
                ++$revertedListImage;
                $changed = true;
                continue;
            }

            $result[$id] = $node;
        }

        return [
            'content' => $result,
            'revertedListApi' => $revertedListApi,
            'revertedListImage' => $revertedListImage,
            'changed' => $changed,
        ];
    }

    /**
     * @param array<string, mixed> $node
     *
     * @return array<string, mixed>
     */
    private static function mapListApiToCollection(array $node): array
    {
        $content = \is_array($node['content'] ?? null) ? $node['content'] : [];
        $listMode = ($content['listMode'] ?? null) === 'dynamic' ? 'dynamic' : 'fixed';

        $listPart = \is_array($content['list'] ?? null) ? $content['list'] : [];
        if (!isset($listPart['gap'])) {
            $listPart['gap'] = self::DEFAULT_LIST_GAP;
        }

        $show = \is_array($content['show'] ?? null) ? $content['show'] : [];
        if (!\array_key_exists('image', $show)) {
            $show['image'] = true;
        }
        if (!\array_key_exists('labels', $show)) {
            $show['labels'] = true;
        }

        $newContent = $content;
        unset($newContent['listMode'], $newContent['dynamicItems']);

        $newContent['collectionType'] = 'article';
        $newContent['mode'] = $listMode;
        $newContent['display'] = 'list';
        $newContent['view'] = 'article';
        $newContent['apiId'] = $content['apiId'] ?? '';
        $newContent['page'] = $content['page'] ?? 1;
        $newContent['itemsPerPage'] = $content['itemsPerPage'] ?? 10;
        $newContent['dynamicArticleItems'] = \is_array($content['dynamicItems'] ?? null)
            ? $content['dynamicItems']
            : [];
        $newContent['show'] = $show;
        $newContent['list'] = $listPart;
        $newContent['_migratedFrom'] = self::TYPE_LIST_API;

        $node['type'] = self::TYPE_COLLECTION;
        $node['content'] = $newContent;

        return $node;
    }

    /**
     * @param array<string, mixed> $node
     *
     * @return array<string, mixed>
     */
    private static function mapListImageToCollection(array $node): array
    {
        $content = \is_array($node['content'] ?? null) ? $node['content'] : [];
        $listMode = ($content['listMode'] ?? null) === 'dynamic' ? 'dynamic' : 'fixed';

        $listPart = \is_array($content['list'] ?? null) ? $content['list'] : [];
        if (!isset($listPart['gap'])) {
            $listPart['gap'] = self::DEFAULT_LIST_GAP;
        }

        $newContent = $content;
        unset($newContent['listMode'], $newContent['dynamicItems']);

        $newContent['collectionType'] = 'image';
        $newContent['mode'] = $listMode;
        $newContent['display'] = 'list';
        $newContent['view'] = 'default';
        $newContent['apiId'] = $content['apiId'] ?? '';
        $newContent['page'] = $content['page'] ?? 1;
        $newContent['itemsPerPage'] = $content['itemsPerPage'] ?? 10;
        $newContent['dynamicImageItems'] = \is_array($content['dynamicItems'] ?? null)
            ? $content['dynamicItems']
            : [];
        $newContent['list'] = $listPart;
        $newContent['_migratedFrom'] = self::TYPE_LIST_IMAGE;

        $node['type'] = self::TYPE_COLLECTION;
        $node['content'] = $newContent;

        return $node;
    }

    /**
     * @param array<string, mixed> $node
     * @param array<string, mixed> $content
     *
     * @return array<string, mixed>
     */
    private static function mapCollectionBackToListApi(array $node, array $content): array
    {
        $newContent = $content;
        unset(
            $newContent['collectionType'],
            $newContent['mode'],
            $newContent['display'],
            $newContent['view'],
            $newContent['dynamicArticleItems'],
            $newContent['dynamicImageItems'],
            $newContent['dynamicVideoItems'],
            $newContent['_migratedFrom'],
        );

        $newContent['listMode'] = ($content['mode'] ?? null) === 'dynamic' ? 'dynamic' : 'fixed';
        $newContent['dynamicItems'] = \is_array($content['dynamicArticleItems'] ?? null)
            ? $content['dynamicArticleItems']
            : [];

        $node['type'] = self::TYPE_LIST_API;
        $node['content'] = $newContent;

        return $node;
    }

    /**
     * @param array<string, mixed> $node
     * @param array<string, mixed> $content
     *
     * @return array<string, mixed>
     */
    private static function mapCollectionBackToListImage(array $node, array $content): array
    {
        $newContent = $content;
        unset(
            $newContent['collectionType'],
            $newContent['mode'],
            $newContent['display'],
            $newContent['view'],
            $newContent['dynamicArticleItems'],
            $newContent['dynamicImageItems'],
            $newContent['dynamicVideoItems'],
            $newContent['show'],
            $newContent['_migratedFrom'],
        );

        $newContent['listMode'] = ($content['mode'] ?? null) === 'dynamic' ? 'dynamic' : 'fixed';
        $newContent['dynamicItems'] = \is_array($content['dynamicImageItems'] ?? null)
            ? $content['dynamicImageItems']
            : [];

        $node['type'] = self::TYPE_LIST_IMAGE;
        $node['content'] = $newContent;

        return $node;
    }
}
