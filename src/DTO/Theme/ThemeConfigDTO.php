<?php

declare(strict_types=1);

namespace App\DTO\Theme;

use App\Entity\Theme;

/**
 * DTO correspondant au formulaire de configuration du thème (ThemeFormComponent).
 * Structure envoyée : config[nom], config[fonts][], config[vars][--var], config[body][...], config[h1][...], …, config[p][...].
 */
class ThemeConfigDTO
{
    private string $name = '';

    /** @var list<int> IDs des polices à importer */
    private array $fonts = [];

    /** @var array<string, string> Variables CSS (ex. --color-primary => #570df8) */
    private array $vars = [];

    /** @var array<string, string> Overrides CSS par node builder (déclarations CSS sans sélecteur). */
    private array $node_overrides = [];


    /** CSS personnalisé ajouté à la fin du fichier généré (classes non prévues par le générateur). */
    private string $customCss = '';

    /** @var list<array{id:string, name:string, className:string, url:string}> */
    private array $icons = [];

    /** Chemin relatif SVG pour la pastille lecture vidéo (ex. /assets/icons/play2.svg). */
    private string $videoPlayerIconUrl = '/assets/icons/play2.svg';


    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /** @return list<int> */
    public function getFonts(): array
    {
        return $this->fonts;
    }

    /** @param list<int>|iterable $fonts */
    public function setFonts(iterable $fonts): void
    {
        $this->fonts = $fonts instanceof \Traversable ? iterator_to_array($fonts, false) : array_values((array) $fonts);
        $this->fonts = array_values(array_filter(array_map('intval', $this->fonts), fn (int $n): bool => $n > 0));
    }

    /** @return array<string, string> */
    public function getVars(): array
    {
        return $this->vars;
    }

    /** @param array<string, string> $vars */
    public function setVars(array $vars): void
    {
        $this->vars = $vars;
    }

    /** @return array<string, string> */
    public function getNodeOverrides(): array
    {
        return $this->node_overrides;
    }

    /** @param array<string, string> $nodeOverrides */
    public function setNodeOverrides(array $nodeOverrides): void
    {
        $this->node_overrides = $nodeOverrides;
    }

    public function getCustomCss(): string
    {
        return $this->customCss;
    }

    public function setCustomCss(string $customCss): void
    {
        $this->customCss = $customCss;
    }

    /** @return list<array{id:string, name:string, className:string, url:string}> */
    public function getIcons(): array
    {
        return $this->icons;
    }

    /** @param array<int, array{id?:int|string, name?:string, className?:string, url?:string}> $icons */
    public function setIcons(array $icons): void
    {
        $out = [];
        foreach ($icons as $icon) {
            if (!is_array($icon)) {
                continue;
            }

            $out[] = [
                'id' => self::normalizeIconId($icon['id'] ?? null),
                'name' => (string) ($icon['name'] ?? ''),
                'className' => (string) ($icon['className'] ?? ''),
                'url' => (string) ($icon['url'] ?? ''),
            ];
        }
        $this->icons = $out;
    }

    public function getVideoPlayerIconUrl(): string
    {
        return $this->videoPlayerIconUrl;
    }

    public function setVideoPlayerIconUrl(string $videoPlayerIconUrl): void
    {
        $this->videoPlayerIconUrl = $videoPlayerIconUrl;
    }

    private static function normalizeIconId(mixed $id): string
    {
        if ($id === null || $id === '') {
            return self::generateThemeIconId();
        }

        if (\is_int($id)) {
            return (string) $id;
        }

        if (\is_string($id)) {
            $s = trim($id);
            if ($s === '') {
                return self::generateThemeIconId();
            }
            if (preg_match('/^[a-zA-Z0-9][a-zA-Z0-9._\\-]{0,127}$/', $s) === 1) {
                return $s;
            }

            return self::generateThemeIconId();
        }

        return self::generateThemeIconId();
    }

    private static function generateThemeIconId(): string
    {
        $data = random_bytes(16);
        $data[6] = \chr(\ord($data[6]) & 0x0f | 0x40);
        $data[8] = \chr(\ord($data[8]) & 0x3f | 0x80);

        return vsprintf('%s%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }


    /**
     * Convertit le DTO en tableau config tel qu'attendu par theme.yaml / ThemeCssGenerator / writeYaml.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $out = [
            'name' => $this->name,
            'fonts' => $this->fonts,
            'vars' => $this->vars,
            'node_overrides' => $this->node_overrides,
            'custom_css' => $this->customCss,
            'icons' => $this->icons,
            'video_player_icon_url' => $this->videoPlayerIconUrl,
        ];

        return $out;
    }

    public static function fromEntity(Theme $theme): self
    {
        $dto = new self();
        $dto->setName($theme->getName());
        $dto->setFonts($theme->getConfig()['fonts'] ?? []);
        $dto->setVars($theme->getConfig()['vars'] ?? []);
        $dto->setNodeOverrides($theme->getConfig()['node_overrides'] ?? []);
        $dto->setCustomCss($theme->getConfig()['custom_css'] ?? '');
        $dto->setIcons($theme->getConfig()['icons'] ?? []);
        $dto->setVideoPlayerIconUrl((string) ($theme->getConfig()['video_player_icon_url'] ?? '/assets/icons/play2.svg'));
        return $dto;
    }

    public static function fromArray(array $array): self
    {
        $dto = new self();
        $dto->setName($array['name'] ?? '');
        $dto->setFonts($array['fonts'] ?? []);
        $dto->setVars($array['vars'] ?? []);
        $dto->setNodeOverrides($array['node_overrides'] ?? []);
        $dto->setCustomCss($array['custom_css'] ?? '');
        $dto->setIcons($array['icons'] ?? []);
        $dto->setVideoPlayerIconUrl((string) ($array['video_player_icon_url'] ?? '/assets/icons/play2.svg'));

        return $dto;
    }

    
}
