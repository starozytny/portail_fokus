<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Fokus\FkInventory;
use App\Entity\Fokus\FkProperty;
use App\Service\ApiResponse;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/intern/api/fokus/properties', name: 'intern_api_fokus_properties_')]
class PropertyController extends AbstractController
{
    #[Route('/list/{numSociety}', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list($numSociety, FokusService $fokusService, ApiResponse $apiResponse, SerializerInterface $serializer): Response
    {
        $client = $fokusService->getAdClientByNumSociety($numSociety);

        $em = $fokusService->getEntityNameManager($client->getManager());
        $data = $em->getRepository(FkProperty::class)->findAll();
        $inventories = $em->getRepository(FkInventory::class)->findBy([], ['date' => 'DESC']);

        $data = $serializer->serialize($data, 'json', ['groups' => FkProperty::LIST]);
        $inventories = $serializer->serialize($inventories, 'json', ['groups' => FkInventory::LIST]);

        return $apiResponse->apiJsonResponseCustom([
            'donnees' => $data,
            'inventories' => $inventories
        ]);
    }

    #[Route('/property/{numSociety}/assign-edl', name: 'assign', options: ['expose' => true], methods: 'PUT')]
    #[IsGranted('ROLE_ADMIN')]
    public function assign(Request $request, $numSociety, FokusService $fokusService, ApiResponse $apiResponse): Response
    {
        $client = $fokusService->getAdClientByNumSociety($numSociety);
        $data = json_decode($request->getContent());

        $em = $fokusService->getEntityNameManager($client->getManager());

        $element = $em->getRepository(FkProperty::class)->findOneBy(['id' => $data->elemId]);
        $selected = $em->getRepository(FkProperty::class)->findOneBy(['id' => $data->selectedId]);

        $element->setLastInventoryUid($selected->getLastInventoryUid());

        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
