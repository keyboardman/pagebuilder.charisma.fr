<?php

declare(strict_types=1);

namespace App\Tests\PageBuilder;

use App\PageBuilder\Api\ApiRequestParamHelper;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;

final class ApiRequestParamHelperTest extends TestCase
{
    public function testBuildCardCollectionParamsNormalizesPageAndLimit(): void
    {
        $helper = new ApiRequestParamHelper();
        $request = new Request([
            'page' => '0',
            'limit' => '200',
            'search' => 'query',
            'sort' => 'recent',
            'category' => 'music',
        ]);

        $params = $helper->buildCardCollectionParams($request, 'category');

        $this->assertSame(1, $params['page']);
        $this->assertSame(100, $params['limit']);
        $this->assertSame('query', $params['search']);
        $this->assertSame('recent', $params['sort']);
        $this->assertSame('music', $params['category']);
    }

    public function testBuildCardCollectionParamsCopiesCategoryToCustomParam(): void
    {
        $helper = new ApiRequestParamHelper();
        $request = new Request(['category' => 'videos']);

        $params = $helper->buildCardCollectionParams($request, 'topic');

        $this->assertSame('videos', $params['category']);
        $this->assertSame('videos', $params['topic']);
    }

    public function testParseExcludeIdsReturnsPositiveIdsOnly(): void
    {
        $helper = new ApiRequestParamHelper();
        $request = new Request(['excludeIds' => '1, 2, abc, -4, 0, 2']);

        $excludeIds = $helper->parseExcludeIds($request);

        $this->assertSame([1 => true, 2 => true], $excludeIds);
    }

    public function testBuildDynamicListCollectionParamsIncludesSearchAndCategory(): void
    {
        $helper = new ApiRequestParamHelper();
        $request = new Request([
            'page' => '2',
            'itemsPerPage' => '15',
            'search' => '  paris  ',
            'category' => '  actu  ',
        ]);

        $params = $helper->buildDynamicListCollectionParams($request);

        $this->assertSame(2, $params['page']);
        $this->assertSame(15, $params['itemsPerPage']);
        $this->assertSame('paris', $params['search']);
        $this->assertSame('actu', $params['category']);
    }

    public function testBuildDynamicListCollectionParamsOmitsEmptyFilters(): void
    {
        $helper = new ApiRequestParamHelper();
        $request = new Request(['page' => '1', 'search' => '  ', 'category' => '']);

        $params = $helper->buildDynamicListCollectionParams($request);

        $this->assertArrayNotHasKey('search', $params);
        $this->assertArrayNotHasKey('category', $params);
    }
}
