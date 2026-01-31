<?php

declare(strict_types=1);

namespace App\Doctrine;

use App\Entity\Font;
use App\Entity\FontType as FontTypeEnum;
use App\Entity\Theme;
use App\Service\ThemeCssGenerator;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Theme::class)]
#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: Theme::class)]
class ThemeCssGeneratorListener
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ThemeCssGenerator $themeCssGenerator,
    ) {
    }

    public function postPersist(Theme $theme, PostPersistEventArgs $event): void
    {
        $this->generateCssAndUpdateTheme($theme);
    }

    public function postUpdate(Theme $theme, PostUpdateEventArgs $event): void
    {
        $uow = $this->em->getUnitOfWork();
        $changeSet = $uow->getEntityChangeSet($theme);

        // Évite une boucle : si seul le chemin CSS a changé, c’est nous qui venons de le mettre à jour
        if (array_keys($changeSet) === ['generatedCssPath']) {
            return;
        }

        $this->generateCssAndUpdateTheme($theme);
    }

    private function generateCssAndUpdateTheme(Theme $theme): void
    {
        $configDto = $theme->getConfigDto();
        if ($configDto === null) {
            return;
        }

        $config = $configDto->toArray();
        $slug = $theme->getSlug();
        if ($slug === null || $slug === '') {
            return;
        }

        $themeDir = 'storage/themes/' . $slug;
        $fontsToImport = $this->resolveFontsToImport($config['fonts'] ?? []);
        $oldCssPath = $theme->getGeneratedCssPath();

        $newCssPath = $this->themeCssGenerator->generate($config, $themeDir, $oldCssPath !== '' ? $oldCssPath : null, $fontsToImport);

        $theme->setGeneratedCssPath($newCssPath);

        $this->em->flush();
    }

    /**
     * @param array<int|string> $ids
     * @return list<Font>
     */
    private function resolveFontsToImport(array $ids): array
    {
        if ($ids === []) {
            return [];
        }
        $fonts = $this->em->getRepository(Font::class)->findBy(['id' => array_map('intval', $ids)]);

        return array_values(array_filter(
            $fonts,
            fn (Font $f): bool => $f->getType() === FontTypeEnum::Google || $f->getType() === FontTypeEnum::Custom
        ));
    }
}
