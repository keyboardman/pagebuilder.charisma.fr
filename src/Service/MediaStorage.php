<?php

declare(strict_types=1);

namespace App\Service;

use League\Flysystem\FileAttributes;
use League\Flysystem\FilesystemOperator;
use League\Flysystem\UnableToDeleteFile;
use League\Flysystem\UnableToWriteFile;

class MediaStorage
{
    public function __construct(
        private readonly FilesystemOperator $filesystem,
    ) {
    }

    /**
     * Liste le contenu d'un répertoire (stockage = storage/media).
     *
     * @return array<int, array{name: string, path: string, type: 'file'|'dir', size?: int}>
     */
    public function listContents(string $path = ''): array
    {
        $path = $this->normalizePath($path);
        $listing = $this->filesystem->listContents($path, false);
        $items = [];
        foreach ($listing as $attr) {
            $name = basename($attr->path());
            if ($name === '.' || $name === '..' || str_starts_with($name, '.')) {
                continue;
            }
            $item = [
                'name' => $name,
                'path' => $attr->path(),
                'type' => $attr->isDir() ? 'dir' : 'file',
            ];
            if ($attr instanceof FileAttributes && $attr->fileSize() !== null) {
                $item['size'] = $attr->fileSize();
            }
            $items[] = $item;
        }
        usort($items, function (array $a, array $b): int {
            if ($a['type'] !== $b['type']) {
                return $a['type'] === 'dir' ? -1 : 1;
            }
            return strcasecmp($a['name'], $b['name']);
        });
        return $items;
    }

    public function write(string $path, string $contents): void
    {
        $path = $this->normalizePath($path);
        try {
            $this->filesystem->write($path, $contents);
        } catch (UnableToWriteFile $e) {
            throw new \RuntimeException(sprintf('Impossible d\'écrire "%s": %s', $path, $e->getMessage()), 0, $e);
        }
    }

    /**
     * Écrit un fichier depuis un flux (évite de charger tout en mémoire, adapté aux gros fichiers type MP4).
     */
    public function writeStream(string $path, $stream): void
    {
        $path = $this->normalizePath($path);
        try {
            $this->filesystem->writeStream($path, $stream);
        } catch (UnableToWriteFile $e) {
            throw new \RuntimeException(sprintf('Impossible d\'écrire "%s": %s', $path, $e->getMessage()), 0, $e);
        }
    }

    public function delete(string $path): void
    {
        $path = $this->normalizePath($path);
        try {
            $this->filesystem->delete($path);
        } catch (UnableToDeleteFile $e) {
            throw new \RuntimeException(sprintf('Impossible de supprimer "%s": %s', $path, $e->getMessage()), 0, $e);
        }
    }

    public function deleteDirectory(string $path): void
    {
        $path = $this->normalizePath($path);
        $this->filesystem->deleteDirectory($path);
    }

    public function createDirectory(string $path): void
    {
        $path = $this->normalizePath($path);
        $this->filesystem->createDirectory($path);
    }

    public function fileExists(string $path): bool
    {
        return $this->filesystem->fileExists($this->normalizePath($path));
    }

    public function directoryExists(string $path): bool
    {
        return $this->filesystem->directoryExists($this->normalizePath($path));
    }

    public function read(string $path): string
    {
        return $this->filesystem->read($this->normalizePath($path));
    }

    public function readStream(string $path)
    {
        return $this->filesystem->readStream($this->normalizePath($path));
    }

    public function mimeType(string $path): string
    {
        return $this->filesystem->mimeType($this->normalizePath($path));
    }

    private function normalizePath(string $path): string
    {
        $path = trim($path, '/');
        return $path === '' ? '.' : $path;
    }
}
