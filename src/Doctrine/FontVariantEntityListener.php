<?php

declare(strict_types=1);

namespace App\Doctrine;

use App\Entity\FontVariant;
use App\Service\FontStorage;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postRemove, method: 'postRemove', entity: FontVariant::class)]
class FontVariantEntityListener
{
    public function __construct(
        private readonly FontStorage $fontStorage,
    ) {
    }

    public function postRemove(FontVariant $variant, PostRemoveEventArgs $event): void
    {
        $path = $variant->getPath();
        if ($path !== '' && $this->fontStorage->fileExists($path)) {
            $this->fontStorage->delete($path);
        }
    }
}
