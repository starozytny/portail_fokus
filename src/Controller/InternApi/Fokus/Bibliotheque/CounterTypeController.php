<?php

namespace App\Controller\InternApi\Fokus\Bibliotheque;

use App\Entity\Fokus\FkCounterType;
use App\Service\ApiResponse;
use App\Service\Data\DataFokus;
use App\Service\Fokus\FokusApi;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/intern/api/fokus/bibli/counters', name: 'intern_api_fokus_bibli_counters_')]
class CounterTypeController extends AbstractController
{

    public function submitForm($type, FkCounterType $obj, Request $request, ApiResponse $apiResponse,
                               FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): JsonResponse
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $dataToSend = $dataFokus->setDataCounter($data);

        $existe = $em->getRepository(FkCounterType::class)->findOneBy(['name' => $dataToSend['name']]);
        if(($type == "create" && $existe) || ($type == "update" && $existe && $existe->getId() != $obj->getId())) {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'name',
                'message' => "Ce compteur existe déjà."
            ]]);
        }

        if($type == "create") {
            $result = $fokusApi->bibliCreate('counter', $dataToSend);
        } else {
            $result = $fokusApi->bibliUpdate('counter', $dataToSend, $obj->getId());
        }

        if($result === false || $result == 409){
            if($result == 409){
                return $apiResponse->apiJsonResponseBadRequest('Ce compteur existe déjà.');
            }
            return $apiResponse->apiJsonResponseBadRequest('[CF0001] Une erreur est survenue.');
        }

        $obj = $em->getRepository(FkCounterType::class)->findOneBy(['name' => $dataToSend['name']]);

        $this->addFlash('info', 'Données mises à jour.');
        return $apiResponse->apiJsonResponse($obj, FkCounterType::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        return $this->submitForm("create", new FkCounterType(), $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, $id, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkCounterType::class)->find($id);
        return $this->submitForm("update", $obj, $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete($id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkCounterType::class)->find($id);

        if ($obj->isNative() || $obj->isUsed()) {
            return $apiResponse->apiJsonResponseBadRequest('Vous ne pouvez pas supprimer cette pièce.');
        }

        $result = $fokusApi->bibliDelete('counter', $obj->getId());

        if($result === false){
            return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue.');
        }

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
