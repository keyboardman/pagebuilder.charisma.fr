<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ApiCollectionDefinitionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ApiCollectionDefinitionRepository::class)]
#[ORM\Table(name: 'api_collection_definition')]
#[ORM\UniqueConstraint(name: 'uniq_api_collection_definition_api_id', columns: ['api_id'])]
#[UniqueEntity(fields: ['apiId'], message: 'Cet identifiant est déjà utilisé.')]
class ApiCollectionDefinition
{
    public const TYPES = ['image', 'video', 'article'];
    public const MODES = ['fixed', 'dynamic'];
    public const PAGINATION_STYLES = ['hydra', 'none', 'offset'];

    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(name: 'api_id', type: 'string', length: 64)]
    #[Assert\NotBlank]
    #[Assert\Regex(pattern: '/^[a-z0-9][a-z0-9_-]*$/', message: 'Identifiant invalide (minuscules, chiffres, tirets, underscores).')]
    private string $apiId = '';

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    private string $label = '';

    #[ORM\Column(type: 'string', length: 16)]
    #[Assert\Choice(choices: self::TYPES)]
    private string $type = 'article';

    /**
     * @var list<string>
     */
    #[ORM\Column(type: 'json')]
    #[Assert\Count(min: 1, minMessage: 'Sélectionnez au moins un mode.')]
    private array $supportedModes = ['fixed'];

    #[ORM\Column(type: 'string', length: 2000)]
    #[Assert\NotBlank]
    #[Assert\Url]
    private string $endpointUrl = '';

    #[ORM\Column(type: 'string', length: 2000, nullable: true)]
    private ?string $itemUrlTemplate = null;

    /**
     * Préfixe ajouté aux URLs image relatives (ex. https://cdn.example.com).
     */
    #[ORM\Column(type: 'string', length: 2000, nullable: true)]
    private ?string $imagePrefix = null;

    /**
     * @var array<string, string>
     */
    #[ORM\Column(type: 'json')]
    private array $queryParams = [];

    #[ORM\Column(type: 'string', length: 16)]
    #[Assert\Choice(choices: self::PAGINATION_STYLES)]
    private string $paginationStyle = 'hydra';

    #[ORM\Column(type: 'string', length: 128)]
    private string $memberPath = 'member';

    /**
     * @var array<string, string>
     */
    #[ORM\Column(type: 'json')]
    private array $fieldMapping = [];

    /**
     * @var array<string, string>
     */
    #[ORM\Column(type: 'json')]
    private array $headers = [];

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private bool $enabled = true;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getApiId(): string
    {
        return $this->apiId;
    }

    public function setApiId(string $apiId): static
    {
        $this->apiId = $apiId;

        return $this;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return list<string>
     */
    public function getSupportedModes(): array
    {
        return $this->supportedModes;
    }

    /**
     * @param list<string> $supportedModes
     */
    public function setSupportedModes(array $supportedModes): static
    {
        $this->supportedModes = array_values($supportedModes);

        return $this;
    }

    public function getEndpointUrl(): string
    {
        return $this->endpointUrl;
    }

    public function setEndpointUrl(string $endpointUrl): static
    {
        $this->endpointUrl = $endpointUrl;

        return $this;
    }

    public function getItemUrlTemplate(): ?string
    {
        return $this->itemUrlTemplate;
    }

    public function setItemUrlTemplate(?string $itemUrlTemplate): static
    {
        $this->itemUrlTemplate = $itemUrlTemplate !== null && $itemUrlTemplate !== '' ? $itemUrlTemplate : null;

        return $this;
    }

    public function getImagePrefix(): ?string
    {
        return $this->imagePrefix;
    }

    public function setImagePrefix(?string $imagePrefix): static
    {
        $trimmed = $imagePrefix !== null ? trim($imagePrefix) : '';
        $this->imagePrefix = $trimmed !== '' ? $trimmed : null;

        return $this;
    }

    /**
     * @return array<string, string>
     */
    public function getQueryParams(): array
    {
        return $this->queryParams;
    }

    /**
     * @param array<string, string> $queryParams
     */
    public function setQueryParams(array $queryParams): static
    {
        $this->queryParams = $queryParams;

        return $this;
    }

    public function getPaginationStyle(): string
    {
        return $this->paginationStyle;
    }

    public function setPaginationStyle(string $paginationStyle): static
    {
        $this->paginationStyle = $paginationStyle;

        return $this;
    }

    public function getMemberPath(): string
    {
        return $this->memberPath;
    }

    public function setMemberPath(string $memberPath): static
    {
        $this->memberPath = $memberPath !== '' ? $memberPath : 'member';

        return $this;
    }

    /**
     * @return array<string, string>
     */
    public function getFieldMapping(): array
    {
        return $this->fieldMapping;
    }

    /**
     * @param array<string, string> $fieldMapping
     */
    public function setFieldMapping(array $fieldMapping): static
    {
        $this->fieldMapping = $fieldMapping;

        return $this;
    }

    /**
     * @return array<string, string>
     */
    public function getHeaders(): array
    {
        return $this->headers;
    }

    /**
     * @param array<string, string> $headers
     */
    public function setHeaders(array $headers): static
    {
        $this->headers = $headers;

        return $this;
    }

    public function isEnabled(): bool
    {
        return $this->enabled;
    }

    public function setEnabled(bool $enabled): static
    {
        $this->enabled = $enabled;

        return $this;
    }
}
