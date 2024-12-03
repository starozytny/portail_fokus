<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Fokus\FkInventory;
use App\Entity\Fokus\FkModel;
use App\Entity\Fokus\FkProperty;
use App\Entity\Fokus\FkTenant;
use App\Entity\Fokus\FkUser;
use App\Service\ApiResponse;
use App\Service\Data\DataFokus;
use App\Service\Fokus\FokusApi;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
        $users = $em->getRepository(FkUser::class)->findBy([], ['lastName' => 'ASC']);
        $models = $em->getRepository(FkModel::class)->findBy([], ['name' => 'ASC']);

        $data = $serializer->serialize($data, 'json', ['groups' => FkInventory::LIST]);
        $properties = $serializer->serialize($properties, 'json', ['groups' => FkProperty::LIST]);
        $tenants = $serializer->serialize($tenants, 'json', ['groups' => FkTenant::LIST]);
        $users = $serializer->serialize($users, 'json', ['groups' => FkUser::LIST]);
        $models = $serializer->serialize($models, 'json', ['groups' => FkModel::INVENTORY]);

        return $apiResponse->apiJsonResponseCustom([
            'donnees' => $data,
            'properties' => $properties,
            'tenants' => $tenants,
            'users' => $users,
            'models' => $models,
        ]);
    }

    public function submitForm($type, FkInventory $obj, Request $request, ApiResponse $apiResponse,
                               FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): JsonResponse
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $dataToSend = $dataFokus->setDataInventory($obj, $data);

        if($type == "create") {
            $result = $fokusApi->inventoryCreate($dataToSend);
        } else {
            $result = $fokusApi->inventoryUpdate($dataToSend, $obj->getId());
        }

        if($result === false || $result == 409){
            if($result == 409){
                return $apiResponse->apiJsonResponseBadRequest('Un état des lieux existe déjà pour ce bien.');
            }
            return $apiResponse->apiJsonResponseBadRequest('[IF0001] Une erreur est survenue.');
        }

        $obj = $em->getRepository(FkInventory::class)->findOneBy(['id' => $result]);

        $this->addFlash('info', 'Données mises à jour.');
        return $apiResponse->apiJsonResponse($obj, FkInventory::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        return $this->submitForm("create", new FkInventory(), $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, $id, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkInventory::class)->find($id);
        return $this->submitForm("update", $obj, $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete($id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkInventory::class)->find($id);
        $result = $fokusApi->inventoryDelete($obj->getId());

        if($result === false){
            return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue.');
        }

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/document/{id}', name: 'document', options: ['expose' => true], methods: 'GET')]
    public function document($id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkInventory::class)->find($id);
        $result = $fokusApi->inventoryDocument($obj->getUid());

        if($result === false){
            return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue.');
        }

        $stream = fopen('php://memory', 'w+');
        fwrite($stream, $result);
        rewind($stream);

        $response = new Response(stream_get_contents($stream));
        fclose($stream);

        $response->headers->set('Content-Type', 'application/pdf');
        $response->headers->set('Content-Disposition', 'inline; filename="edl.pdf"');

        return $response;
    }

    #[Route('/move/{id}', name: 'move', options: ['expose' => true], methods: 'PUT')]
    public function move(Request $request, $id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse,
                         DataFokus $dataFokus): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());
        $data = json_decode($request->getContent());

        $obj = $em->getRepository(FkInventory::class)->find($id);

        $dataToSend = $dataFokus->setDataInventoryDate($obj, $data);

        $result = $fokusApi->inventoryUpdateDate($dataToSend, $obj->getId());

        if($result === false || $result == 409){
            if($result == 409){
                return $apiResponse->apiJsonResponseBadRequest('Un état des lieux existe déjà pour ce bien.');
            }
            return $apiResponse->apiJsonResponseBadRequest('[MF0001] Une erreur est survenue.');
        }

        $this->addFlash('info', 'Données mises à jour.');
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
