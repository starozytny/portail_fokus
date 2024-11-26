<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Fokus\FkTenant;
use App\Service\ApiResponse;
use App\Service\Data\DataFokus;
use App\Service\Fokus\FokusApi;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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

    public function submitForm($type, FkTenant $obj, Request $request, ApiResponse $apiResponse,
                               FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): JsonResponse
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $dataToSend = $dataFokus->setDataTenant($obj, $data);

        if($type == "create") {
            $existe = $em->getRepository(FkTenant::class)->findOneBy([
                'firstName' => $dataToSend['first_name'],
                'lastName' => $dataToSend['last_name'],
                'addr1' => $dataToSend['addr1'],
            ]);
            if($existe && $existe->getId() !== $dataToSend['id']) {
                return $apiResponse->apiJsonResponseValidationFailed([[
                    'name' => 'name',
                    'message' => "Ce locataire existe déjà."
                ]]);
            }

            $result = $fokusApi->tenantCreate($dataToSend);
        } else {
            $result = $fokusApi->tenantUpdate($dataToSend, $obj->getId());
        }

        if($result === false || $result == 409){
            if($result == 409){
                return $apiResponse->apiJsonResponseBadRequest('Ce locataire existe déjà.');
            }
            return $apiResponse->apiJsonResponseBadRequest('[TF0001] Une erreur est survenue.');
        }

        $obj = $em->getRepository(FkTenant::class)->findOneBy(['id' => $result]);

        $this->addFlash('info', 'Données mises à jour.');
        return $apiResponse->apiJsonResponse($obj, FkTenant::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        return $this->submitForm("create", new FkTenant(), $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, $id, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkTenant::class)->find($id);
        return $this->submitForm("update", $obj, $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }
}
