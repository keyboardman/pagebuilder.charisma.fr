<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\BuilderFormConfigRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: BuilderFormConfigRepository::class)]
#[ORM\Table(name: 'builder_form_config')]
#[ORM\UniqueConstraint(name: 'uniq_builder_form_slug', columns: ['slug'])]
#[UniqueEntity(fields: ['slug'], message: 'Ce slug est déjà utilisé.')]
class BuilderFormConfig
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'IDENTITY')]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 64)]
    private string $slug = '';

    #[ORM\Column(type: 'string', length: 255)]
    private string $label = '';

    /**
     * @var list<string>
     */
    #[ORM\Column(type: 'json')]
    private array $recipientEmails = [];

    #[ORM\Column(type: 'text')]
    private string $emailSubjectTemplate = '';

    #[ORM\Column(type: 'text')]
    private string $emailBodyTemplate = '';

    #[ORM\Column(type: 'string', length: 2000, nullable: true)]
    private ?string $webhookUrl = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private bool $enabled = true;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

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

    /**
     * @return list<string>
     */
    public function getRecipientEmails(): array
    {
        return $this->recipientEmails;
    }

    /**
     * @param list<string> $recipientEmails
     */
    public function setRecipientEmails(array $recipientEmails): static
    {
        $this->recipientEmails = $recipientEmails;

        return $this;
    }

    public function getEmailSubjectTemplate(): string
    {
        return $this->emailSubjectTemplate;
    }

    public function setEmailSubjectTemplate(string $emailSubjectTemplate): static
    {
        $this->emailSubjectTemplate = $emailSubjectTemplate;

        return $this;
    }

    public function getEmailBodyTemplate(): string
    {
        return $this->emailBodyTemplate;
    }

    public function setEmailBodyTemplate(string $emailBodyTemplate): static
    {
        $this->emailBodyTemplate = $emailBodyTemplate;

        return $this;
    }

    public function getWebhookUrl(): ?string
    {
        return $this->webhookUrl;
    }

    public function setWebhookUrl(?string $webhookUrl): static
    {
        $this->webhookUrl = ($webhookUrl !== null && $webhookUrl !== '') ? $webhookUrl : null;

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
