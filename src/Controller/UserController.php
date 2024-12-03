<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/espace-pro', name: 'user_')]
class UserController extends AbstractController
{
    #[Route('/', name: 'homepage')]
    public function index(): Response
    {
        return $this->render('user/pages/index.html.twig');
    }

    #[Route('/application/apk', name: 'application_apk')]
    public function apk(): Response
    {
        $fileVersion = $this->getParameter('root_directory') . '/../fokus-web-v2/updater/version.txt';
        if(!$fileVersion){
            throw new NotFoundHttpException("[0] Fichier introuvable.");
        }

        $handleVersion = fopen($fileVersion, 'r');
        $version = fread($handleVersion, filesize($fileVersion));
        fclose($handleVersion);

        $filename = "fokusV2_" . $version . '.apk';
        $file = $this->getParameter('root_directory') . '/../fokus-web-v2/updater/' . $filename;

        if(!$file){
            throw new NotFoundHttpException("[1] Fichier introuvable.");
        }

        $response = new Response($file);

        $response->headers->set('Content-Description', 'File Transfer');
        $response->headers->set('Content-Type', 'application/octet-stream');
        $response->headers->set('Content-Disposition', sprintf('attachment; filename="%s"', $filename));
        $response->headers->set('Content-Length', filesize($file));

        return $response;
    }

    #[Route('/application/patch', name: 'application_patch')]
    public function patch(): Response
    {
        $filename = 'patch.apk';
        $file = $this->getParameter('root_directory') . '/../fokus-web-v2/updater/' . $filename;

        if(!$file){
            throw new NotFoundHttpException("Fichier introuvable.");
        }

        $response = new Response($file);

        $response->headers->set('Content-Description', 'File Transfer');
        $response->headers->set('Content-Type', 'application/octet-stream');
        $response->headers->set('Content-Disposition', sprintf('attachment; filename="%s"', $filename));
        $response->headers->set('Content-Length', filesize($file));

        return $response;
    }
}
