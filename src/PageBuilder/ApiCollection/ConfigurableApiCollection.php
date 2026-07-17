<?php

declare(strict_types=1);

namespace App\PageBuilder\ApiCollection;

use App\Entity\ApiCollectionDefinition;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Runtime HTTP générique pour une déclaration admin ApiCollectionDefinition.
 */
final class ConfigurableApiCollection implements ApiCollectionInterface
{
    private const MAX_ITEMS_PER_PAGE = 100;

    public function __construct(
        private readonly ApiCollectionDefinition $definition,
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getId(): string
    {
        return $this->definition->getApiId();
    }

    public function getLabel(): string
    {
        return $this->definition->getLabel();
    }

    public function getType(): string
    {
        return $this->definition->getType();
    }

    public function getSupportedModes(): array
    {
        /** @var list<'fixed'|'dynamic'> $modes */
        $modes = array_values(array_filter(
            $this->definition->getSupportedModes(),
            static fn (string $m): bool => \in_array($m, ['fixed', 'dynamic'], true)
        ));

        return $modes !== [] ? $modes : ['fixed'];
    }

    public function fetchItems(array $params = []): ApiCollectionPageResult
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $itemsPerPage = max(1, min(self::MAX_ITEMS_PER_PAGE, (int) ($params['itemsPerPage'] ?? 10)));

        try {
            $query = $this->definition->getQueryParams();
            $style = $this->definition->getPaginationStyle();
            if ($style === 'hydra') {
                $query['page'] = (string) $page;
                $query['itemsPerPage'] = (string) $itemsPerPage;
            } elseif ($style === 'offset') {
                $query['offset'] = (string) (($page - 1) * $itemsPerPage);
                $query['limit'] = (string) $itemsPerPage;
            }

            $searchParam = $this->definition->getSearchQueryParam();
            if (
                $searchParam !== null
                && isset($params['search'])
                && \is_string($params['search'])
                && $params['search'] !== ''
            ) {
                $query[$searchParam] = $params['search'];
            }

            $categoryParam = $this->definition->getCategoryQueryParam();
            if (
                $categoryParam !== null
                && isset($params['category'])
                && \is_string($params['category'])
                && $params['category'] !== ''
            ) {
                $query[$categoryParam] = $params['category'];
            }

            $response = $this->httpClient->request('GET', $this->definition->getEndpointUrl(), [
                'query' => $query,
                'headers' => $this->definition->getHeaders(),
                'timeout' => 30,
            ]);
            $data = $response->toArray(false);
            $member = $this->extractMember($data);
            $items = array_map(fn (mixed $raw): array => $this->mapItem($raw), $member);

            if ($style === 'none') {
                $totalItems = \count($items);
                $slice = array_slice($items, ($page - 1) * $itemsPerPage, $itemsPerPage);
                $totalPages = $totalItems > 0 ? (int) max(1, (int) ceil($totalItems / $itemsPerPage)) : 0;

                return new ApiCollectionPageResult($slice, $totalItems, $totalPages, $page, $itemsPerPage);
            }

            $totalItems = $this->resolveTotalItems($data, \count($items));
            $totalPages = $totalItems > 0 ? (int) max(1, (int) ceil($totalItems / $itemsPerPage)) : 0;

            return new ApiCollectionPageResult($items, $totalItems, $totalPages, $page, $itemsPerPage);
        } catch (\Throwable) {
            return ApiCollectionPageResult::empty($page, $itemsPerPage);
        }
    }

    public function fetchItem(string $id): ?array
    {
        $template = $this->definition->getItemUrlTemplate();
        if ($template === null || $template === '') {
            $template = rtrim($this->definition->getEndpointUrl(), '/') . '/{id}';
        }

        $url = str_replace(['{id}', '{endpoint}'], [$id, rtrim($this->definition->getEndpointUrl(), '/')], $template);

        try {
            $response = $this->httpClient->request('GET', $url, [
                'headers' => $this->definition->getHeaders(),
                'timeout' => 30,
            ]);
            $data = $response->toArray(false);

            return $this->mapItem($data);
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * @return list<array{id: string, label: string}>
     */
    public function fetchCategories(): array
    {
        $url = $this->definition->getCategoriesUrl();
        if ($url === null || $url === '') {
            return [];
        }

        try {
            $response = $this->httpClient->request('GET', $url, [
                'query' => ['pagination' => 'false'],
                'headers' => $this->definition->getHeaders(),
                'timeout' => 30,
            ]);
            $data = $response->toArray(false);
            $member = $this->extractCategoriesMember($data);
            $idPath = $this->definition->getCategoriesIdPath();
            $labelPath = $this->definition->getCategoriesLabelPath();
            $out = [];

            foreach ($member as $raw) {
                if (!\is_array($raw)) {
                    continue;
                }
                $id = DotPathResolver::get($raw, $idPath);
                $label = DotPathResolver::get($raw, $labelPath);
                if ($id === null || $label === null || (string) $label === '') {
                    continue;
                }
                $out[] = [
                    'id' => (string) $id,
                    'label' => (string) $label,
                ];
            }

            usort(
                $out,
                static function (array $a, array $b): int {
                    return strcasecmp($a['label'], $b['label']);
                },
            );

            return $out;
        } catch (\Throwable) {
            return [];
        }
    }

    /**
     * @param list<mixed>|array<string, mixed> $data
     */
    private function resolveTotalItems(mixed $data, int $fallback): int
    {
        if (!\is_array($data)) {
            return $fallback;
        }

        if (isset($data['totalItems']) && is_numeric($data['totalItems'])) {
            return (int) $data['totalItems'];
        }

        if (isset($data['hydra:totalItems']) && is_numeric($data['hydra:totalItems'])) {
            return (int) $data['hydra:totalItems'];
        }

        return $fallback;
    }

    /**
     * @return list<mixed>
     */
    private function extractCategoriesMember(mixed $data): array
    {
        if (\is_array($data) && array_is_list($data)) {
            return $data;
        }

        $path = $this->definition->getCategoriesMemberPath();
        $member = DotPathResolver::get($data, $path);
        if (\is_array($member)) {
            return array_values($member);
        }

        return [];
    }

    /**
     * @return list<mixed>
     */
    private function extractMember(mixed $data): array
    {
        if (\is_array($data) && array_is_list($data)) {
            return $data;
        }

        $path = $this->definition->getMemberPath();
        $member = DotPathResolver::get($data, $path);
        if (\is_array($member)) {
            return array_values($member);
        }

        return [];
    }

    /**
     * @return array<string, mixed>
     */
    private function mapItem(mixed $raw): array
    {
        $mapping = $this->definition->getFieldMapping();
        $mapped = [];

        foreach ($mapping as $target => $sourcePath) {
            if (!\is_string($target) || !\is_string($sourcePath) || $sourcePath === '') {
                continue;
            }
            $value = DotPathResolver::get($raw, $sourcePath);
            if ($value === null) {
                continue;
            }
            $mapped[$target] = $value;
        }

        if (!isset($mapped['id'])) {
            $id = DotPathResolver::get($raw, 'id') ?? DotPathResolver::get($raw, '@id');
            $mapped['id'] = $id !== null ? (string) $id : '';
        }

        if (isset($mapped['image'])) {
            $mapped['image'] = $this->applyImagePrefix((string) $mapped['image']);
        }

        return ApiCollectionItemNormalizer::normalize($mapped);
    }

    private function applyImagePrefix(string $image): string
    {
        $image = trim($image);
        if ($image === '') {
            return $image;
        }

        // Already absolute or protocol-relative.
        if (preg_match('#^(https?:)?//#i', $image) === 1 || str_starts_with($image, 'data:')) {
            return $image;
        }

        $prefix = $this->definition->getImagePrefix();
        if ($prefix === null || $prefix === '') {
            return $image;
        }

        return rtrim($prefix, '/') . '/' . ltrim($image, '/');
    }
}
