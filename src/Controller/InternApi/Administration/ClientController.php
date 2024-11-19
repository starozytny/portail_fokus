<?php

namespace App\Controller\InternApi\Administration;

use App\Entity\Administration\AdClients;
use App\Service\ApiResponse;
use App\Service\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/intern/api/administration/clients', name: 'intern_api_administration_clients_')]
#[IsGranted('ROLE_ADMIN')]
class ClientController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(FokusService $fokusService, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getAdministrationEntityManager();

        $clients = $em->getRepository(AdClients::class)->findAll();
        return $apiResponse->apiJsonResponse($clients, AdClients::LIST);
    }
}
