<?php

namespace App\Controller\Admin\Fokus;

use App\Entity\Administration\AdClients;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/fokus/edls', name: 'admin_fokus_inventories_')]
class InventoryController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(FokusService $fokusService): Response
    {
        $em = $fokusService->getAdministrationEntityManager();

        $clients = $em->getRepository(AdClients::class)->findBy([], ['numSociety' => 'ASC']);
        $clients = $fokusService->getClientsWithPropertyActivateSet($clients);

        return $this->render('admin/pages/fokus/inventories/index.html.twig', ['clients' => $clients]);
    }

    #[Route('/{numSociety}', name: 'list', options: ['expose' => true])]
    public function list($numSociety, FokusService $fokusService): Response
    {
        $emA = $fokusService->getAdministrationEntityManager();

        $client = $emA->getRepository(AdClients::class)->findOneBy(['numSociety' => $numSociety]);

        $em = $fokusService->getEntityNameManager($client->getManager());
        if(!$em){
            $this->addFlash("error", "Société $numSociety non activée pour le portail.");
            return $this->redirectToRoute('admin_fokus_inventories_index');
        }

        return $this->render('admin/pages/fokus/inventories/list.html.twig', ['client' => $client]);
    }
}
