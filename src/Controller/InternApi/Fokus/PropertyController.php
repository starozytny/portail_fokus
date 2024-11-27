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
        $users = $em->getRepository(FkUser::class)->findAll();
        $models = $em->getRepository(FkModel::class)->findAll();
        $tenants = $em->getRepository(FkTenant::class)->findAll();

        $data = $serializer->serialize($data, 'json', ['groups' => FkProperty::LIST]);
        $inventories = $serializer->serialize($inventories, 'json', ['groups' => FkInventory::LIST]);
        $users = $serializer->serialize($users, 'json', ['groups' => FkUser::LIST]);
        $models = $serializer->serialize($models, 'json', ['groups' => FkModel::LIST]);
        $tenants = $serializer->serialize($tenants, 'json', ['groups' => FkTenant::LIST]);

        return $apiResponse->apiJsonResponseCustom([
            'donnees' => $data,
            'inventories' => $inventories,
            'users' => $users,
            'models' => $models,
            'tenants' => $tenants,
        ]);
    }

    public function submitForm($type, FkProperty $obj, Request $request, ApiResponse $apiResponse,
                               FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): JsonResponse
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $dataToSend = $dataFokus->setDataProperty($obj, $data);

        if($type == "create") {
            $existe = $em->getRepository(FkProperty::class)->findOneBy(['reference' => $dataToSend['reference']]);
            if($existe && $existe->getId() !== $dataToSend['id']) {
                return $apiResponse->apiJsonResponseValidationFailed([[
                    'name' => 'name',
                    'message' => "Ce bien existe déjà."
                ]]);
            }

            $result = $fokusApi->propertyCreate($dataToSend);
        } else {
            $result = $fokusApi->propertyUpdate($dataToSend, $obj->getId());
        }

        if($result === false || $result == 409){
            if($result == 409){
                return $apiResponse->apiJsonResponseBadRequest('Ce bien existe déjà.');
            }
            return $apiResponse->apiJsonResponseBadRequest('[PF0001] Une erreur est survenue.');
        }

        $obj = $em->getRepository(FkProperty::class)->findOneBy(['reference' => $dataToSend['reference']]);

        $this->addFlash('info', 'Données mises à jour.');
        return $apiResponse->apiJsonResponse($obj, FkProperty::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        return $this->submitForm("create", new FkProperty(), $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, $id, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkProperty::class)->find($id);
        return $this->submitForm("update", $obj, $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete($id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkProperty::class)->find($id);
        $result = $fokusApi->propertyDelete($obj->getId());

        if($result === false){
            return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue.');
        }

        return $apiResponse->apiJsonResponseSuccessful("ok");
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
