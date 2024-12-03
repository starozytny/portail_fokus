<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Fokus\FkCategory;
use App\Entity\Fokus\FkElement;
use App\Entity\Fokus\FkElementNature;
use App\Entity\Fokus\FkModel;
use App\Entity\Fokus\FkNature;
use App\Entity\Fokus\FkRoom;
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
        $elementsNatures = $em->getRepository(FkElementNature::class)->findAll();
        $natures = $em->getRepository(FkNature::class)->findAll();

        $data = $serializer->serialize($data, 'json', ['groups' => FkModel::LIST]);
        $rooms = $serializer->serialize($rooms, 'json', ['groups' => FkRoom::LIST]);
        $categories = $serializer->serialize($categories, 'json', ['groups' => FkCategory::LIST]);
        $elements = $serializer->serialize($elements, 'json', ['groups' => FkElement::LIST]);
        $elementsNatures = $serializer->serialize($elementsNatures, 'json', ['groups' => FkElementNature::LIST]);
        $natures = $serializer->serialize($natures, 'json', ['groups' => FkNature::LIST]);

        return $apiResponse->apiJsonResponseCustom([
            'donnees' => $data,
            'rooms' => $rooms,
            'categories' => $categories,
            'elements' => $elements,
            'elementsNatures' => $elementsNatures,
            'natures' => $natures,
        ]);
    }

    public function submitForm($type, FkModel $obj, Request $request, ApiResponse $apiResponse,
                               FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): JsonResponse
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $dataToSend = $dataFokus->setDataModel($data);

        $existe = $em->getRepository(FkModel::class)->findOneBy(['name' => $dataToSend['name']]);
        if(($type == "create" && $existe) || ($type == "update" && $existe && $existe->getId() != $obj->getId())) {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'name',
                'message' => "Ce modèle existe déjà."
            ]]);
        }

        if($type == "create") {
            $result = $fokusApi->modelCreate($dataToSend);
        } else {
            $result = $fokusApi->modelUpdate($dataToSend, $obj->getId());
        }

        if($result === false || $result == 409){
            if($result == 409){
                return $apiResponse->apiJsonResponseBadRequest('Ce modèle existe déjà.');
            }
            return $apiResponse->apiJsonResponseBadRequest('[MF0001] Une erreur est survenue.');
        }

        $obj = $em->getRepository(FkModel::class)->findOneBy(['name' => $dataToSend['name']]);

        $this->addFlash('info', 'Données mises à jour.');
        return $apiResponse->apiJsonResponse($obj, FkModel::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        return $this->submitForm("create", new FkModel(), $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, $id, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkModel::class)->find($id);
        return $this->submitForm("update", $obj, $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete($id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkModel::class)->find($id);
        $result = $fokusApi->modelDelete($obj->getId());

        if($result === false){
            return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue.');
        }

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/duplicate/{id}', name: 'duplicate', options: ['expose' => true], methods: 'POST')]
    public function duplicate($id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkModel::class)->find($id);


        $dataToSend = [
            'name' => $obj->getName() . " (copie)",
            'content' => $obj->getContent(),
        ];

        $existe = $em->getRepository(FkModel::class)->findOneBy(['name' => $dataToSend['name']]);
        if($existe && $existe->getId() !== $dataToSend['id']) {
            return $apiResponse->apiJsonResponseBadRequest("Un modèle porte déjà l'intitulé : " . $dataToSend['name']);
        }

        $result = $fokusApi->modelCreate($dataToSend);

        if($result === false){
            return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue.');
        }

        $obj = $em->getRepository(FkModel::class)->findOneBy(['name' => $dataToSend['name']]);

        $this->addFlash('info', 'Données mises à jour.');
        return $apiResponse->apiJsonResponse($obj, FkModel::LIST);
    }
}
