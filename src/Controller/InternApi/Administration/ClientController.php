<?php

namespace App\Controller\InternApi\Administration;

use App\Entity\Administration\AdClients;
use App\Service\ApiResponse;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/intern/api/administration/clients', name: 'intern_api_administration_clients_')]
class ClientController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    #[IsGranted('ROLE_ADMIN')]
    public function list(FokusService $fokusService, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getAdministrationEntityManager();

        $clients = $em->getRepository(AdClients::class)->findAll();
        return $apiResponse->apiJsonResponse($clients, AdClients::LIST);
    }

    #[Route('/client/{numSociety}/credits', name: 'credits', options: ['expose' => true], methods: 'GET')]
    public function credits($numSociety, FokusService $fokusService, ApiResponse $apiResponse): Response
    {
        $client = $fokusService->getAdClientByNumSociety($numSociety);

        return $apiResponse->apiJsonResponseCustom(['credits' => $client->getCredits()]);
    }
}
