<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Fokus\FkInventory;
use App\Entity\Fokus\FkProperty;
use App\Entity\Fokus\FkTenant;
use App\Entity\Fokus\FkUser;
use App\Service\ApiResponse;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/intern/api/fokus/inventories', name: 'intern_api_fokus_inventories_')]
class InventoryController extends AbstractController
{
    #[Route('/list/{numSociety}', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(Request $request, $numSociety, FokusService $fokusService, ApiResponse $apiResponse,
                         SerializerInterface $serializer): Response
    {
        /** @var FkUser $user */
        $user = $this->getUser();
        $client = $fokusService->getAdClientByNumSociety($numSociety);

        $status = $request->query->get('st') ?: 0;

        $em = $fokusService->getEntityNameManager($client->getManager());
        if($user->getRights() == 1){
            $data = $em->getRepository(FkInventory::class)->findBy(['state' => $status], ['date' => 'DESC']);
        }else{
            $data = $em->getRepository(FkInventory::class)->findBy(['state' => $status, 'userId' => $user->getId()], ['date' => 'DESC']);
        }
        $properties = $em->getRepository(FkProperty::class)->findAll();
        $tenants = $em->getRepository(FkTenant::class)->findAll();

        $data = $serializer->serialize($data, 'json', ['groups' => FkInventory::LIST]);
        $properties = $serializer->serialize($properties, 'json', ['groups' => FkProperty::LIST]);
        $tenants = $serializer->serialize($tenants, 'json', ['groups' => FkTenant::LIST]);

        return $apiResponse->apiJsonResponseCustom([
            'donnees' => $data,
            'properties' => $properties,
            'tenants' => $tenants,
        ]);
    }
}
