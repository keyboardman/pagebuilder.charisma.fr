<?php

declare(strict_types=1);

namespace App\Tests\Service;

use League\Flysystem\Filesystem;
use League\Flysystem\Local\LocalFilesystemAdapter;
use App\Service\FontStorage;
use PHPUnit\Framework\TestCase;

class FontStorageTest extends TestCase
{
    private string $dir;
    private FontStorage $storage;

    protected function setUp(): void
    {
        $this->dir = sys_get_temp_dir() . '/font-storage-' . uniqid();
        mkdir($this->dir, 0755, true);
        $adapter = new LocalFilesystemAdapter($this->dir);
        $fs = new Filesystem($adapter);
        $this->storage = new FontStorage($fs);
    }

    protected function tearDown(): void
    {
        array_map(fn (string $f) => is_file($f) ? unlink($f) : null, glob($this->dir . '/*/*') ?: []);
        array_map(fn (string $d) => rmdir($d), glob($this->dir . '/*') ?: []);
        if (is_dir($this->dir)) {
            rmdir($this->dir);
        }
    }

    public function testWriteAndFileExists(): void
    {
        $this->storage->write('my-font/Regular.woff2', 'binary content');
        $this->assertTrue($this->storage->fileExists('my-font/Regular.woff2'));
    }

    public function testDeleteRemovesFile(): void
    {
        $path = 'my-font/Bold.woff2';
        $this->storage->write($path, 'x');
        $this->assertTrue($this->storage->fileExists($path));
        $this->storage->delete($path);
        $this->assertFalse($this->storage->fileExists($path));
    }
}
