<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SentryTestController extends AbstractController
{
    #[Route('/_sentry-test', name: 'sentry_test')]
    public function testLog(LoggerInterface $logger): Response
    {
        // the following code will test if monolog integration logs to sentry
        $logger->error('My custom logged error.');

        // the following code will test if an uncaught exception logs to sentry
        throw new \RuntimeException('Example exception.');
    }
}
