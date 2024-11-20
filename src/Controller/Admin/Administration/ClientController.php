<?php

namespace App\Controller\Admin\Administration;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/administration/clients', name: 'admin_administration_clients_')]
class ClientController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render('admin/pages/administration/clients/index.html.twig');
    }
}
