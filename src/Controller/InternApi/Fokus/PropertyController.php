<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Administration\AdClients;
use App\Entity\Fokus\FkProperty;
use App\Service\ApiResponse;
use App\Service\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/intern/api/fokus/properties', name: 'intern_api_fokus_properties_')]
#[IsGranted('ROLE_ADMIN')]
class PropertyController extends AbstractController
{
    #[Route('/list/{clientId}', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list($clientId, FokusService $fokusService, ApiResponse $apiResponse): Response
    {
        $emA = $fokusService->getAdministrationEntityManager();

        $client = $emA->getRepository(AdClients::class)->findOneBy(['id' => $clientId]);
        if(!$client){
            return $apiResponse->apiJsonResponseBadRequest('Client not found');
        }

        $em = $fokusService->getEntityNameManager($client->getManager());
        $properties = $em->getRepository(FkProperty::class)->findAll();

        return $apiResponse->apiJsonResponse($properties, FkProperty::LIST);
    }
}
