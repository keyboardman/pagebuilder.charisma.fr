<?php

declare(strict_types=1);

namespace App\Entity;

enum FontType: string
{
    case Native = 'native';
    case Google = 'google';
    case Custom = 'custom';
}
