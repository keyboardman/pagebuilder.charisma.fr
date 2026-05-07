<?php 

declare(strict_types=1);

namespace App\Helper;

use App\DTO\Theme\ThemeConfigDTO;

class ThemeDTOSanitizer
{
    private const CSS_VALUE_ALLOWED_CHARS_REGEX = '/[^\\p{L}\\p{N}\\s\\(\\)\'"«»_\\-:\\/\\.,#%]/u';

    public static function sanitize(ThemeConfigDTO $dto): ThemeConfigDTO
    {

        $dto->setVars(self::sanitizeVars($dto->getVars()));
       
        $dto->setNodeOverrides(self::sanitizeNodeOverride(
            $dto->getNodeOverrides()
        ));

        return $dto;
    }

    private static function sanitizeVars(array $vars): array
    {
        $newVars = [];
        $compteur = 0;
        foreach ($vars as $var) {

            if(empty($var)) {
                continue;
            }


            $newVars[$compteur]= [
                'id' => $compteur,
                'name' => $var['name'],
                'value' => self::sanitizeValue($var['value'])
            ];
            $compteur++;
        }

        return $newVars;
    }

    private static function sanitizeNodeOverride(array $nodeOverrides): array
    {
        $newNodeOverrides = [];

        foreach ($nodeOverrides as $selector => $properties) {
            if($selector[0] !== '.' && $selector !== 'body') {
                continue;
            }
            if(!is_array($properties)) {
                continue;
            }
            foreach ($properties as $property => $value) {
                if(empty($value)) {
                    continue;
                }
                    $newNodeOverrides[$selector][$property] = self::sanitizeValue($value);
                }
        }

        return $newNodeOverrides;
    }

    private static function sanitizeValue(string $value): string
    {
       
        $sanitized = preg_replace(self::CSS_VALUE_ALLOWED_CHARS_REGEX, '', $value);
        
        if ($sanitized === null) {
            return '';
        }

        // Réduit les espaces successifs sans casser la lisibilité.
        return preg_replace('/\s+/u', ' ', $sanitized) ?? '';
    }

    
}