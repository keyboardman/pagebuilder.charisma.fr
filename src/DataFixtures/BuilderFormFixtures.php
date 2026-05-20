<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\BuilderFormConfig;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

/**
 * symfony console doctrine:fixtures:load --append --group=builder-form
 */
final class BuilderFormFixtures extends Fixture implements FixtureGroupInterface
{
    public static function getGroups(): array
    {
        return ['builder-form'];
    }

    public function load(ObjectManager $manager): void
    {
        $f = new BuilderFormConfig();
        $f->setSlug('contact');
        $f->setLabel('Formulaire contact');
        $f->setRecipientEmails(['admin@example.com']);
        $f->setEmailSubjectTemplate('{{ form_label }} — nouveau message');
        $f->setEmailBodyTemplate(
            <<<'TWIG'
<p>Nouveau message via le site.</p>
<table border="1" cellpadding="8" cellspacing="0">
{% for row in rows %}
<tr><th>{{ row.label|e('html') }}</th><td>{{ row.value|e('html') }}</td></tr>
{% endfor %}
</table>
TWIG
        );
        $manager->persist($f);
        $manager->flush();
    }
}
