<?php

declare(strict_types=1);

namespace App\BuilderForm;

use App\Repository\BuilderFormConfigRepository;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final class BuilderFormCatalogService
{
    public function __construct(
        private readonly BuilderFormConfigRepository $repository,
        private readonly UrlGeneratorInterface $urlGenerator,
        #[Autowire('%app.builder_form.honeypot_field%')]
        private readonly string $honeypotField,
    ) {
    }

    /**
     * @return list<array{id: string, title: string, action: string, honeypotField: string}>
     */
    public function listItems(): array
    {
        $forms = $this->repository->findAllEnabledForCatalog();
        $out = [];
        foreach ($forms as $form) {
            $out[] = [
                'id' => $form->getSlug(),
                'title' => $form->getLabel(),
                'action' => $this->urlGenerator->generate('_api_/page-builder/forms/{slug}/submit_post', ['slug' => $form->getSlug()]),
                'honeypotField' => $this->honeypotField,
            ];
        }

        return $out;
    }
}
