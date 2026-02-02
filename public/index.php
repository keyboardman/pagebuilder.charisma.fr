<?php

use App\Kernel;

// Gros uploads (ex. MP4) : le Web Profiler charge le corps de la requête en mémoire.
// Augmenter la limite évite un OOM lors de la collecte après l’upload.
if (\function_exists('ini_set')) {
    @ini_set('memory_limit', '512M');
}

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
