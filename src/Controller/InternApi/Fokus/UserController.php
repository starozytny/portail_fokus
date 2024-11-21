<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Administration\AdClients;
use App\Entity\Fokus\FkUser;
use App\Entity\Main\User;
use App\Service\ApiResponse;
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
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    #[IsGranted('ROLE_ADMIN')]
    public function list(FokusService $fokusService, ApiResponse $apiResponse): Response
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

    public function submitForm($type, FkUser $obj, Request $request, ApiResponse $apiResponse, FokusApi $fokusApi): JsonResponse
    {
        $data = json_decode($request->getContent());
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        // TODO

        if($type == "create") {

        } else {
            $result = $fokusApi->userUpdate($obj, $data);
        }

        return $apiResponse->apiJsonResponse($obj, User::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, FokusApi $fokusApi): Response
    {
        return $this->submitForm("create", new FkUser(), $request, $apiResponse, $fokusApi);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, $id, FokusService $fokusService, ApiResponse $apiResponse, FokusApi $fokusApi): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkUser::class)->find($id);
        return $this->submitForm("update", $obj, $request, $apiResponse, $fokusApi);
    }
}
