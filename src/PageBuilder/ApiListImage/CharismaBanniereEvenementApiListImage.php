<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiListImage;

/**
 * Base Charisma bannières événements : l'API distante attend `itemPerPage`
 * (singulier) et renvoie `totalItems` pour la page courante, pas le total global.
 */
abstract class CharismaBanniereEvenementApiListImage extends ApiListImage
{
    protected function getItemsPerPageQueryParam(): string
    {
        return 'itemPerPage';
    }

    /**
     * @param array<string, mixed> $data
     * @return array{0: int, 1: int}
     */
    protected function resolvePaginationTotals(array $data, int $page, int $itemsPerPage, int $memberCount): array
    {
        unset($data);

        if ($memberCount === 0) {
            return [0, max(0, $page - 1)];
        }

        $lastPage = $page;
        $lastPageCount = $memberCount;

        if ($memberCount >= $itemsPerPage) {
            $probePage = $page + 1;

            while (true) {
                $probeData = $this->requestRemoteCollection($probePage, $itemsPerPage);
                $probeMember = $probeData['member'] ?? [];
                if (!\is_array($probeMember)) {
                    $probeMember = [];
                }

                $probeCount = \count($probeMember);
                if ($probeCount === 0) {
                    break;
                }

                $lastPage = $probePage;
                $lastPageCount = $probeCount;

                if ($probeCount < $itemsPerPage) {
                    break;
                }

                ++$probePage;
            }
        }

        $totalPages = $lastPage;
        $totalItems = ($totalPages - 1) * $itemsPerPage + $lastPageCount;

        return [$totalItems, $totalPages];
    }
}
