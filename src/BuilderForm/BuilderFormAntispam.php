<?php

declare(strict_types=1);

namespace App\BuilderForm;

/**
 * Constantes partagées côté soumission et catalogue (contrat avec le NodeForm).
 */
final class BuilderFormAntispam
{
    public const HONEYPOT_FIELD = '_builder_form_hp';

    /**
     * Clés de requête à exclure du corps d’e-mail et du webhook.
     *
     * @return list<string>
     */
    public static function reservedFieldNames(): array
    {
        return [self::HONEYPOT_FIELD];
    }
}
