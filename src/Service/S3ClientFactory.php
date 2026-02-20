<?php

declare(strict_types=1);

namespace App\Service;

use Aws\S3\S3Client;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

final class S3ClientFactory
{
    public function __invoke(
        string $endpoint,
        string $region,
        string $accessKey,
        string $secretKey,
        string $bucket,
    ): S3Client {
        if (empty($endpoint)) {
            throw new RuntimeException(
                'MINIO_ENDPOINT n\'est pas défini. ' .
                'Pour utiliser le filesystem S3, définissez MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY et MINIO_BUCKET dans demo/.env'
            );
        }

        $client = new S3Client([
            'version' => 'latest',
            'endpoint' => $endpoint,
            'region' => $region,
            'use_path_style_endpoint' => true,
            'credentials' => [
                'key' => $accessKey,
                'secret' => $secretKey,
            ],
            'http' => [
                'verify' => false,
                'connect_timeout' => 30,
                'timeout' => 300, // 5 min pour téléchargements volumineux
            ],
        ]);

        if (!empty($bucket)) {
            $this->ensureBucketExists($client, $bucket);
        }

        return $client;
    }

    private function ensureBucketExists(S3Client $client, string $bucket): void
    {
        try {
            $client->headBucket(['Bucket' => $bucket]);
        } catch (\Aws\S3\Exception\S3Exception $e) {
            $code = $e->getAwsErrorCode() ?? '';
            if ($code === 'NotFound' || $code === 'NoSuchBucket' || $e->getStatusCode() === 404) {
                $client->createBucket(['Bucket' => $bucket]);
            } else {
                throw $e;
            }
        }
    }
}
