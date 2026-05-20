<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\BuilderFormConfig;
use App\Form\BuilderFormConfigType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/builder-form', name: 'app_builder_form_config_')]
final class BuilderFormConfigController extends AbstractController
{
    private const DEFAULT_SUBJECT = '{{ form_label }} — nouveau message';

    private const DEFAULT_BODY = <<<'TWIG'
<p>Nouveau message via le site.</p>
<table border="1" cellpadding="8" cellspacing="0">
{% for row in rows %}
<tr><th>{{ row.label|e('html') }}</th><td>{{ row.value|e('html') }}</td></tr>
{% endfor %}
</table>
TWIG;

    public function __construct(
        private readonly EntityManagerInterface $em,
    ) {
    }

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): Response
    {
        $items = $this->em->getRepository(BuilderFormConfig::class)->findBy([], ['label' => 'ASC']);

        return $this->render('builder_form_config/index.html.twig', [
            'forms' => $items,
        ]);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request): Response
    {
        $entity = new BuilderFormConfig();
        $entity->setEmailSubjectTemplate(self::DEFAULT_SUBJECT);
        $entity->setEmailBodyTemplate(self::DEFAULT_BODY);
        $entity->setEnabled(true);

        $form = $this->createForm(BuilderFormConfigType::class, $entity);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $this->em->persist($entity);
            $this->em->flush();
            $this->addFlash('success', sprintf('Formulaire « %s » créé.', $entity->getLabel()));

            return $this->redirectToRoute('app_builder_form_config_edit', ['id' => $entity->getId()]);
        }

        return $this->render('builder_form_config/new.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, BuilderFormConfig $builderFormConfig): Response
    {
        $form = $this->createForm(BuilderFormConfigType::class, $builderFormConfig);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();
            $this->addFlash('success', sprintf('Formulaire « %s » mis à jour.', $builderFormConfig->getLabel()));

            return $this->redirectToRoute('app_builder_form_config_edit', ['id' => $builderFormConfig->getId()]);
        }

        return $this->render('builder_form_config/edit.html.twig', [
            'builderForm' => $builderFormConfig,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}/delete', name: 'delete', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function delete(Request $request, BuilderFormConfig $builderFormConfig): Response
    {
        $token = $request->request->getString('_token');
        if ($this->isCsrfTokenValid('delete_builder_form' . $builderFormConfig->getId(), $token)) {
            $label = $builderFormConfig->getLabel();
            $this->em->remove($builderFormConfig);
            $this->em->flush();
            $this->addFlash('success', sprintf('Formulaire « %s » supprimé.', $label));
        }

        return $this->redirectToRoute('app_builder_form_config_index');
    }
}
