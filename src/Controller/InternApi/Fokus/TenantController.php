<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Fokus\FkProperty;
use App\Entity\Fokus\FkTenant;
use App\Service\ApiResponse;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/intern/api/fokus/tenants', name: 'intern_api_fokus_tenants_')]
class TenantController extends AbstractController
{
    #[Route('/list/{numSociety}', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list($numSociety, FokusService $fokusService, ApiResponse $apiResponse): Response
    {
        $client = $fokusService->getAdClientByNumSociety($numSociety);

        $em = $fokusService->getEntityNameManager($client->getManager());
        $data = $em->getRepository(FkTenant::class)->findAll();

        return $apiResponse->apiJsonResponse($data, FkTenant::LIST);
    }
}
