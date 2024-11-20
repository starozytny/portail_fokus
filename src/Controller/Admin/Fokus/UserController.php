<?php

namespace App\Controller\Admin\Fokus;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/fokus/utilisateurs', name: 'admin_fokus_users_')]
class UserController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render('admin/pages/fokus/users/index.html.twig');
    }
}
