<?php

declare(strict_types=1);

namespace App\Tests\Service;

use App\Service\OklchScale;
use App\Service\ThemeCssGenerator;
use PHPUnit\Framework\TestCase;

class ThemeCssGeneratorTest extends TestCase
{
    private string $projectDir;

    protected function setUp(): void
    {
        $this->projectDir = sys_get_temp_dir() . '/theme-css-gen-' . uniqid();
        mkdir($this->projectDir, 0755, true);
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
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale());
        $config = [
            'nom' => 'Test',
            'vars' => ['--color-white' => '#ffffff', '--color-blue' => '#1858A0', '--font-size-base' => '16px'],
            'body' => ['font-family' => 'Arial', 'font-size' => '1rem'],
            'h1' => ['font-size' => '2rem'],
        ];
        $css = $gen->buildCss($config);
        $this->assertStringContainsString(':root', $css);
        $this->assertStringContainsString('--color-white', $css);
        $this->assertStringContainsString('.text-blue-100', $css);
        $this->assertStringContainsString('.bg-blue-900', $css);
        $this->assertStringContainsString('body {', $css);
        $this->assertStringContainsString('h1 {', $css);
        $this->assertStringContainsString('font-family', $css);
    }

    public function testGenerateWritesFileWithVersionInName(): void
    {
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale());
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
        $gen = new ThemeCssGenerator($this->projectDir, new OklchScale());
        $themeDir = 'storage/themes/test';
        $dir = $this->projectDir . '/' . $themeDir;
        mkdir($dir, 0755, true);
        $oldPath = $themeDir . '/theme.oldver.css';
        file_put_contents($this->projectDir . '/' . $oldPath, '/* old */');
        $config = ['vars' => ['--color-white' => '#fff']];
        $gen->generate($config, $themeDir, $oldPath);
        $this->assertFileDoesNotExist($this->projectDir . '/' . $oldPath);
    }
}
