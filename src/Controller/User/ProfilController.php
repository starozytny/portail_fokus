<?php

namespace App\Controller\User;

use App\Entity\Fokus\FkUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/espace-pro/mon-compte', name: 'user_profil_')]
class ProfilController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(SerializerInterface $serializer): Response
    {
        $user = $serializer->serialize($this->getUser(), 'json', ['groups' => FkUser::FORM]);

        return $this->render('user/pages/profil/index.html.twig', [
            'element' => $user
        ]);
    }
}
