<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Fokus\FkCategory;
use App\Entity\Fokus\FkElement;
use App\Entity\Fokus\FkModel;
use App\Entity\Fokus\FkRoom;
use App\Service\ApiResponse;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/intern/api/fokus/models', name: 'intern_api_fokus_models_')]
class ModelController extends AbstractController
{
    #[Route('/list/{numSociety}', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list($numSociety, FokusService $fokusService, ApiResponse $apiResponse, SerializerInterface $serializer): Response
    {
        $client = $fokusService->getAdClientByNumSociety($numSociety);

        $em = $fokusService->getEntityNameManager($client->getManager());
        $data = $em->getRepository(FkModel::class)->findAll();
        $rooms = $em->getRepository(FkRoom::class)->findAll();
        $categories = $em->getRepository(FkCategory::class)->findAll();
        $elements = $em->getRepository(FkElement::class)->findAll();

        $data = $serializer->serialize($data, 'json', ['groups' => FkModel::LIST]);
        $rooms = $serializer->serialize($rooms, 'json', ['groups' => FkRoom::LIST]);
        $categories = $serializer->serialize($categories, 'json', ['groups' => FkCategory::LIST]);
        $elements = $serializer->serialize($elements, 'json', ['groups' => FkElement::LIST]);

        return $apiResponse->apiJsonResponseCustom([
            'donnees' => $data,
            'rooms' => $rooms,
            'categories' => $categories,
            'elements' => $elements
        ]);
    }
}
