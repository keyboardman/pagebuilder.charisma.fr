<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListArticleDynamique;

/**
 * Référence éditoriale vers un item distant.
 *
 * - id   : identifiant de l'item
 * - type : identifiant de la source ApiListArticleDynamique
 */
final readonly class ApiListArticleDynamiqueEntry
{
    public function __construct(
        public string $id,
        public string $type,
    ) {
    }

    /**
     * @param array{id?: mixed, type?: mixed} $data
     */
    public static function fromArray(array $data): ?self
    {
        $id = trim((string) ($data['id'] ?? ''));
        $type = trim((string) ($data['type'] ?? ''));

        if ($id === '' || $type === '') {
            return null;
        }

        return new self($id, $type);
    }
}
