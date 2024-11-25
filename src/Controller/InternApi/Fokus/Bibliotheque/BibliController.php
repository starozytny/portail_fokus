<?php

namespace App\Controller\InternApi\Fokus\Bibliotheque;

use App\Entity\Fokus\FkAspect;
use App\Entity\Fokus\FkCounterType;
use App\Entity\Fokus\FkElement;
use App\Entity\Fokus\FkKeyType;
use App\Entity\Fokus\FkNature;
use App\Entity\Fokus\FkRoom;
use App\Service\ApiResponse;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/intern/api/fokus/bibli/global', name: 'intern_api_fokus_bibli_global_')]
class BibliController extends AbstractController
{
    #[Route('/list/{numSociety}', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list($numSociety, FokusService $fokusService, ApiResponse $apiResponse, SerializerInterface $serializer): Response
    {
        $client = $fokusService->getAdClientByNumSociety($numSociety);

        $em = $fokusService->getEntityNameManager($client->getManager());
        $rooms = $em->getRepository(FkRoom::class)->findAll();
        $keysType = $em->getRepository(FkKeyType::class)->findAll();
        $countersType = $em->getRepository(FkCounterType::class)->findAll();
        $natures = $em->getRepository(FkNature::class)->findAll();
        $aspects = $em->getRepository(FkAspect::class)->findAll();
        $elements = $em->getRepository(FkElement::class)->findAll();

        $rooms = $serializer->serialize($rooms, 'json', ['groups' => FkRoom::LIST]);
        $keysType = $serializer->serialize($keysType, 'json', ['groups' => FkKeyType::LIST]);
        $countersType = $serializer->serialize($countersType, 'json', ['groups' => FkCounterType::LIST]);
        $natures = $serializer->serialize($natures, 'json', ['groups' => FkNature::LIST]);
        $aspects = $serializer->serialize($aspects, 'json', ['groups' => FkAspect::LIST]);
        $elements = $serializer->serialize($elements, 'json', ['groups' => FkElement::LIST]);


        return $apiResponse->apiJsonResponseCustom([
            'rooms' => $rooms,
            'keysType' => $keysType,
            'countersType' => $countersType,
            'natures' => $natures,
            'aspects' => $aspects,
            'elements' => $elements,
        ]);
    }
}
