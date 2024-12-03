<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Administration\AdClients;
use App\Entity\Fokus\FkInventory;
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

#[Route('/intern/api/fokus/users', name: 'intern_api_fokus_users_')]
class UserController extends AbstractController
{
    #[Route('/list-all', name: 'list_all', options: ['expose' => true], methods: 'GET')]
    #[IsGranted('ROLE_ADMIN')]
    public function listAll(FokusService $fokusService, ApiResponse $apiResponse): Response
    {
        $emA = $fokusService->getAdministrationEntityManager();

        $clients = $emA->getRepository(AdClients::class)->findAll();

        $data = [];
        foreach($clients as $client) {
            $em = $fokusService->getEntityNameManager($client->getManager());

            if($em){
                $users = $em->getRepository(FkUser::class)->findAll();
                foreach($users as $user) {
                    $user->setSocietyCode($client->getNumSociety());
                    $user->setSocietyName($client->getName());
                }
                $data = array_merge($data, $users);
            }
        }

        return $apiResponse->apiJsonResponse($data, FkUser::LIST);
    }

    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(FokusService $fokusService, ApiResponse $apiResponse, FokusApi $fokusApi): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $data = $em->getRepository(FkUser::class)->findAll();

        return $apiResponse->apiJsonResponse($data, FkUser::LIST);
    }

    public function submitForm($type, FkUser $obj, Request $request, ApiResponse $apiResponse,
                               FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): JsonResponse
    {
        /** @var FkUser $user */
        $user = $this->getUser();
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $dataToSend = $dataFokus->setDataUser($data);

        if($type == "create") {
            $result = $fokusApi->userCreate($dataToSend);
        } else {
            $result = $fokusApi->userUpdate($dataToSend, $obj);
        }

        $existe = $em->getRepository(FkUser::class)->findOneBy(['username' => $dataToSend['username']]);
        if(($type == "create" && $existe) || ($type == "update" && $existe->getId() != $obj->getId())) {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'username',
                'message' => "Cet utilisateur existe déjà."
            ]]);
        }

        if($result === false){
            return $apiResponse->apiJsonResponseBadRequest('[UF0001] Une erreur est survenue.');
        }

        if($type == "update" && $dataToSend['password'] != ""){
            $result = $fokusApi->userUpdatePassword(['password' => $dataToSend['password']], $obj);
            if($result === false){
                return $apiResponse->apiJsonResponseBadRequest('[UF0002] Une erreur est survenue. Le mot de passe n\'a pas pu être mis à jour.');
            }
        }

        if($user->getId() == $obj->getId()) {
            $sessionData = $fokusApi->getSessionData();
            $fokusApi->setSessionData($dataToSend['username'], $dataToSend['password'] ?: $sessionData[2]);
        }

        $obj = $em->getRepository(FkUser::class)->findOneBy(['username' => $dataToSend['username']]);

        $this->addFlash('info', 'Données mises à jour.');
        return $apiResponse->apiJsonResponse($obj, FkUser::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        return $this->submitForm("create", new FkUser(), $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, $id, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkUser::class)->find($id);
        return $this->submitForm("update", $obj, $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete($id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkUser::class)->find($id);

        if ($obj->getRights() === FkUser::RIGHTS_ADMIN) {
            return $apiResponse->apiJsonResponseForbidden();
        }

        if ($obj === $this->getUser()) {
            return $apiResponse->apiJsonResponseBadRequest('Vous ne pouvez pas vous supprimer.');
        }

        $inventory = $em->getRepository(FkInventory::class)->findBy(['userId' => $obj->getId()]);
        if($inventory){
            return $apiResponse->apiJsonResponseBadRequest('Des états des lieux sont associés à cet utilisateur. Vous ne pouvez pas le supprimer.');
        }

        $result = $fokusApi->userDelete($obj);

        if($result === false){
            return $apiResponse->apiJsonResponseBadRequest('[UD0003] Une erreur est survenue.');
        }

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
