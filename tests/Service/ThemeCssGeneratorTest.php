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
    /** @var UrlGeneratorInterface&\PHPUnit\Framework\MockObject\MockObject */
    private $urlGenerator;

    protected function setUp(): void
    {
        $this->projectDir = sys_get_temp_dir() . '/theme-css-gen-' . uniqid();
        mkdir($this->projectDir, 0755, true);
        $this->urlGenerator = $this->createMock(UrlGeneratorInterface::class);
        $this->urlGenerator
            ->method('generate')
            ->willReturn('https://example.test/font-file');
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
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator);
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

    public function testGenerateWritesFileWithVersionInName(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator);
        $config = ['vars' => ['--color-white' => '#fff'], 'body' => []];
        $path = $gen->generate($config, 'storage/themes/test', null);
        $this->assertStringContainsString('theme.', $path);
        $this->assertStringContainsString('.css', $path);
        $full = $this->projectDir . '/' . $path;
        $this->assertFileExists($full);
        $content = file_get_contents($full);
        $this->assertStringContainsString(':root', $content);
    }

    public function testGenerateDeletesOldCssWhenProvided(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator);
        $themeDir = 'storage/themes/test';
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
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator);
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
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale(), $this->urlGenerator);
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
}
