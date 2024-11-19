<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Administration\AdClients;
use App\Entity\Fokus\FkUser;
use App\Service\ApiResponse;
use App\Service\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/intern/api/fokus/users', name: 'intern_api_fokus_users_')]
#[IsGranted('ROLE_ADMIN')]
class UserController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
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
}
