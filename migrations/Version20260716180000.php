<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use App\PageBuilder\NodeMigration\ListNodeToCollectionMigrator;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migre les nœuds node-list-api / node-list-image vers node-collection dans page.content.
 *
 * Rollback : reverse best-effort via content._migratedFrom ; préférer un restore dump
 * si le contenu a été édité après migration.
 */
final class Version20260716180000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Migrate node-list-api / node-list-image vers node-collection dans page.content';
    }

    public function up(Schema $schema): void
    {
        $rows = $this->connection->fetchAllAssociative('SELECT id, content FROM page');
        $totalListApi = 0;
        $totalListImage = 0;
        $pagesTouched = 0;

        foreach ($rows as $row) {
            $raw = $row['content'];
            $nodes = $this->decodeContent($raw);
            $result = ListNodeToCollectionMigrator::migrate($nodes);

            $totalListApi += $result['convertedListApi'];
            $totalListImage += $result['convertedListImage'];

            if (!$result['changed']) {
                continue;
            }

            ++$pagesTouched;
            $this->connection->update(
                'page',
                ['content' => json_encode($result['content'], \JSON_UNESCAPED_UNICODE | \JSON_UNESCAPED_SLASHES)],
                ['id' => $row['id']],
            );
        }

        $this->write(sprintf(
            'List→Collection: %d page(s), %d node-list-api, %d node-list-image',
            $pagesTouched,
            $totalListApi,
            $totalListImage
        ));
    }

    public function down(Schema $schema): void
    {
        $rows = $this->connection->fetchAllAssociative('SELECT id, content FROM page');
        $totalListApi = 0;
        $totalListImage = 0;
        $pagesTouched = 0;

        foreach ($rows as $row) {
            $nodes = $this->decodeContent($row['content']);
            $result = ListNodeToCollectionMigrator::reverse($nodes);

            $totalListApi += $result['revertedListApi'];
            $totalListImage += $result['revertedListImage'];

            if (!$result['changed']) {
                continue;
            }

            ++$pagesTouched;
            $this->connection->update(
                'page',
                ['content' => json_encode($result['content'], \JSON_UNESCAPED_UNICODE | \JSON_UNESCAPED_SLASHES)],
                ['id' => $row['id']],
            );
        }

        $this->write(sprintf(
            'List←Collection reverse: %d page(s), %d list-api, %d list-image',
            $pagesTouched,
            $totalListApi,
            $totalListImage
        ));
    }

    /**
     * @return array<string, mixed>|null
     */
    private function decodeContent(mixed $raw): ?array
    {
        if ($raw === null || $raw === '') {
            return null;
        }

        if (\is_array($raw)) {
            return $raw;
        }

        if (!\is_string($raw)) {
            return null;
        }

        $decoded = json_decode($raw, true);

        return \is_array($decoded) ? $decoded : null;
    }
}
