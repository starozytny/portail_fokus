<?php

namespace App\Controller\InternApi\Fokus\Bibliotheque;

use App\Entity\Fokus\FkKeyType;
use App\Service\ApiResponse;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/intern/api/fokus/bibli/keys', name: 'intern_api_fokus_bibli_keys_')]
class KeyTypeController extends AbstractController
{
    #[Route('/list/{numSociety}', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list($numSociety, FokusService $fokusService, ApiResponse $apiResponse): Response
    {
        $client = $fokusService->getAdClientByNumSociety($numSociety);

        $em = $fokusService->getEntityNameManager($client->getManager());
        $data = $em->getRepository(FkKeyType::class)->findAll();

        return $apiResponse->apiJsonResponse($data, FkKeyType::LIST);
    }
}
