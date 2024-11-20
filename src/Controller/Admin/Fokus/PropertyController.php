<?php

namespace App\Controller\Admin\Fokus;

use App\Entity\Administration\AdClients;
use App\Service\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/fokus/biens', name: 'admin_fokus_properties_')]
class PropertyController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(FokusService $fokusService): Response
    {
        $em = $fokusService->getAdministrationEntityManager();

        $clients = $em->getRepository(AdClients::class)->findAll();

        return $this->render('admin/pages/fokus/biens/index.html.twig', ['clients' => $clients]);
    }

    #[Route('/{numSociety}', name: 'list')]
    public function list($numSociety, FokusService $fokusService): Response
    {
        $emA = $fokusService->getAdministrationEntityManager();

        $client = $emA->getRepository(AdClients::class)->findOneBy(['numSociety' => $numSociety]);

        return $this->render('admin/pages/fokus/biens/list.html.twig', ['client' => $client]);
    }
}
