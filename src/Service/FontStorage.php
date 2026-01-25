<?php

declare(strict_types=1);

namespace App\Service;

use League\Flysystem\FilesystemOperator;
use League\Flysystem\UnableToDeleteFile;
use League\Flysystem\UnableToWriteFile;

class FontStorage
{
    public function __construct(
        private readonly FilesystemOperator $filesystem,
    ) {
    }

    /**
     * Écrit un fichier dans le stockage fonts (racine = storage/fonts).
     *
     * @param string $path Chemin relatif, ex. "ma-police/Bold-Italic.woff2"
     */
    public function write(string $path, string $contents): void
    {
        try {
            $this->filesystem->write($path, $contents);
        } catch (UnableToWriteFile $e) {
            throw new \RuntimeException(sprintf('Impossible d\'écrire le fichier "%s": %s', $path, $e->getMessage()), 0, $e);
        }
    }

    /**
     * Supprime un fichier du stockage fonts.
     *
     * @param string $path Chemin relatif, ex. "ma-police/Bold-Italic.woff2"
     */
    public function delete(string $path): void
    {
        try {
            $this->filesystem->delete($path);
        } catch (UnableToDeleteFile $e) {
            throw new \RuntimeException(sprintf('Impossible de supprimer le fichier "%s": %s', $path, $e->getMessage()), 0, $e);
        }
    }

    public function fileExists(string $path): bool
    {
        return $this->filesystem->fileExists($path);
    }

    /**
     * Lit le contenu d'un fichier du stockage fonts.
     *
     * @param string $path Chemin relatif, ex. "ma-police/Bold-Italic.woff2"
     */
    public function read(string $path): string
    {
        return $this->filesystem->read($path);
    }
}
