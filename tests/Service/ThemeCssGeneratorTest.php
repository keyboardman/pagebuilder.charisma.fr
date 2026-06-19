<?php

declare(strict_types=1);

namespace App\Tests\Service;

use App\Service\OklchScale;
use App\Service\ThemeCssGenerator;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class ThemeCssGeneratorTest extends TestCase
{
    private string $projectDir;
    /** @var UrlGeneratorInterface&\PHPUnit\Framework\MockObject\Stub */
    private $urlGenerator;
    private \Symfony\Component\HttpFoundation\RequestStack $requestStack;

    protected function setUp(): void
    {
        $this->projectDir = sys_get_temp_dir() . '/theme-css-gen-' . uniqid();
        mkdir($this->projectDir, 0755, true);
        $this->seedPublicAssets();
        $this->urlGenerator = $this->createStub(UrlGeneratorInterface::class);
        $this->urlGenerator
            ->method('generate')
            ->willReturn('https://example.test/font-file');
        $this->requestStack = new \Symfony\Component\HttpFoundation\RequestStack();
    }

    protected function tearDown(): void
    {
        if (!is_dir($this->projectDir)) {
            return;
        }
        $it = new \RecursiveDirectoryIterator($this->projectDir, \RecursiveDirectoryIterator::SKIP_DOTS);
        $files = new \RecursiveIteratorIterator($it, \RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($files as $f) {
            $f->isDir() ? @rmdir($f->getPathname()) : @unlink($f->getPathname());
        }
        @rmdir($this->projectDir);
    }

    public function testBuildCssProducesRootAndSelectors(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $config = [
            'nom' => 'Test',
            'vars' => ['--color-white' => '#ffffff', '--color-blue' => '#1858A0', '--font-size-base' => '16px'],
            'body' => ['font-family' => 'Arial', 'font-size' => '1rem'],
            'node_overrides' => [
                '.ce-container' => ['max-width' => '1280px', 'padding' => '0 24px'],
                '.ce-button' => ['border-radius' => '9999px'],
                '.ce-text' => ['color' => '#000000', 'font-family' => 'Arial'],
                '.ce-header-h1' => ['color' => '#000000']
            ],
        ];
        $css = $gen->buildCss($config);

        $this->assertStringContainsString(':root', $css);
        $this->assertStringContainsString('--color-white', $css);
        $this->assertStringContainsString('.ce-container', $css);
        //$this->assertStringContainsString('body {', $css);
        $this->assertStringContainsString('.ce-header-h1', $css);
        $this->assertStringContainsString('font-family:', $css);
    }

    public function testBuildCssIncludesVideoIconMaskUrlVariable(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $css = $gen->buildCss(['body' => []]);

        $this->assertStringContainsString('--ce-builder-icon-video-mask-url', $css);
        $this->assertStringContainsString('--ce-video-player-icon-url', $css);
        $this->assertStringContainsString("url('/assets/icons/video.svg')", $css);
        $this->assertStringContainsString("url('/assets/icons/play2.svg')", $css);
    }

    public function testBuildCssUsesCustomVideoPlayerIconUrl(): void
    {
        mkdir($this->projectDir . '/public/media', 0755, true);
        file_put_contents($this->projectDir . '/public/media/custom-play.svg', '<svg></svg>');

        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $css = $gen->buildCss([
            'body' => [],
            'video_player_icon_url' => '/media/custom-play.svg',
        ]);

        $this->assertStringContainsString("url('/media/custom-play.svg')", $css);
    }

    public function testBuildCssFallsBackToDefaultPlay2WhenPublicAssetMissing(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $css = $gen->buildCss([
            'body' => [],
            'video_player_icon_url' => '/assets/icons/missing.svg',
        ]);

        $this->assertStringContainsString("url('/assets/icons/play2.svg')", $css);
        $this->assertStringNotContainsString('missing.svg', $css);
    }

    private function seedPublicAssets(): void
    {
        $iconsDir = $this->projectDir . '/public/assets/icons';
        mkdir($iconsDir, 0755, true);
        file_put_contents($iconsDir . '/play2.svg', '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
        file_put_contents($iconsDir . '/video.svg', '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    }

    public function testBuildCssVideoIconMaskUrlIncludesRequestBasePath(): void
    {
        $request = \Symfony\Component\HttpFoundation\Request::create(
            'http://localhost/myapp/theme/1/css',
            'GET',
            [],
            [],
            [],
            [
                'SCRIPT_FILENAME' => '/var/www/public/index.php',
                'SCRIPT_NAME' => '/myapp/index.php',
            ]
        );
        $stack = new \Symfony\Component\HttpFoundation\RequestStack();
        $stack->push($request);

        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $stack);
        $css = $gen->buildCss(['body' => []]);

        $this->assertStringContainsString("url('/myapp/assets/icons/video.svg')", $css);
        $this->assertStringContainsString("url('/myapp/assets/icons/play2.svg')", $css);
    }

    public function testGenerateWritesFileWithVersionInName(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $config = ['vars' => ['--color-white' => '#fff'], 'body' => []];
        $path = $gen->generate($config, 'storage/themes/theme-1', null);
        $this->assertStringContainsString('theme.', $path);
        $this->assertStringContainsString('.css', $path);
        $full = $this->projectDir . '/' . $path;
        $this->assertFileExists($full);
        $content = file_get_contents($full);
        $this->assertStringContainsString(':root', $content);
    }

    public function testGenerateDeletesOldCssWhenProvided(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $themeDir = 'storage/themes/theme-1';
        $dir = $this->projectDir . '/' . $themeDir;
        mkdir($dir, 0755, true);
        $oldPath = $themeDir . '/theme.oldver.css';
        file_put_contents($this->projectDir . '/' . $oldPath, '/* old */');
        $config = ['vars' => ['--color-white' => '#fff']];
        $gen->generate($config, $themeDir, $oldPath);
        $this->assertFileDoesNotExist($this->projectDir . '/' . $oldPath);
    }

    public function testBuildCssIncludesNodeOverridesAfterBaseCss(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $config = [
            'node_overrides' => [
                '.ce-container' => ['max-width' => '1280px', 'padding' => '0 24px'],
                '.ce-button' => ['border-radius' => '9999px'],
            ],
        ];

        $css = $gen->buildCss($config);
        $this->assertStringContainsString('.ce-container {', $css);
        $this->assertStringContainsString('max-width: 1280px;', $css);
        $this->assertStringContainsString('.ce-button {', $css);
        $this->assertStringContainsString('border-radius: 9999px;', $css);
    }

    public function testBuildCssSanitizesSemicolonButKeepsVarAndUrl(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $config = [
            'vars' => [
                '--color-safe' => 'var(--color-red);',
                '--bg-image' => 'url("https://www.google.com");',
            ],
            'node_overrides' => [
                '.ce-container' => [
                    'background-image' => 'url("https://www.google.com");',
                ],
            ],
        ];

        $css = $gen->buildCss($config);
        $this->assertStringContainsString('--color-safe: var(--color-red);', $css);
        $this->assertStringContainsString('--bg-image: url("https://www.google.com");', $css);
        $this->assertStringContainsString('background-image: url("https://www.google.com");', $css);
        $this->assertStringNotContainsString(';;', $css);
    }

    public function testBuildCssIncludesConfiguredThemeIcons(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $config = [
            'icons' => [
                [
                    'id' => 1,
                    'name' => 'Home',
                    'className' => 'icon-home',
                    'url' => '/icons/home.svg',
                ],
            ],
        ];

        $css = $gen->buildCss($config);

        $this->assertStringContainsString('.icon-home {', $css);
        $this->assertStringContainsString('background-color: currentColor;', $css);
        $this->assertStringContainsString("mask-image: url('/icons/home.svg');", $css);
        $this->assertStringContainsString("-webkit-mask-image: url('/icons/home.svg');", $css);
        $this->assertStringContainsString('mask-size: auto 100%;', $css);
        $this->assertStringContainsString('width: auto;', $css);
        $this->assertStringContainsString('-webkit-mask-size: auto 100%;', $css);
    }

    public function testBuildCssThemeIconRasterEmitsOnlyBackgroundImage(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $config = [
            'icons' => [
                [
                    'id' => 1,
                    'name' => 'Article',
                    'className' => 'ce-icon-article',
                    'url' => '/media/icons/article.png',
                ],
                [
                    'id' => 2,
                    'name' => 'Photo',
                    'className' => 'ce-icon-photo',
                    'url' => '/media/photo.JPEG',
                ],
            ],
        ];

        $css = $gen->buildCss($config);

        $this->assertStringContainsString('.ce-icon-article {', $css);
        $this->assertStringContainsString("background-image: url('/media/icons/article.png');", $css);
        $this->assertStringContainsString('.ce-icon-photo {', $css);
        $this->assertStringContainsString("background-image: url('/media/photo.JPEG');", $css);
        $this->assertDoesNotMatchRegularExpression('/mask-image:[^;]*article\\.png/', $css);
        $this->assertDoesNotMatchRegularExpression('/mask-image:[^;]*photo\\.JPEG/', $css);
    }

    public function testBuildCssNormalizesIconClassNameAndSkipsInvalidEntries(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator, $this->requestStack);
        $config = [
            'icons' => [
                [
                    'id' => 1,
                    'name' => 'Valid',
                    'className' => '.icon*home',
                    'url' => '/icons/home.svg',
                ],
                [
                    'id' => 2,
                    'name' => 'Invalid',
                    'className' => '',
                    'url' => '/icons/skip.svg',
                ],
            ],
        ];

        $css = $gen->buildCss($config);

        $this->assertStringContainsString('.iconhome {', $css);
        $this->assertStringNotContainsString('skip.svg', $css);
    }
}
