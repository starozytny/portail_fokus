<?php

namespace App\Controller;

use App\Service\Fokus\FokusFtp;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
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
    public function apk(FokusFtp $fokusFtp): Response
    {
        $ftp = $fokusFtp->login();
        if(!$ftp){
            throw $this->createNotFoundException("Connexion interrompu.");
        }

        $localDir = $this->getParameter('private_directory') . 'ftp';
        if(!is_dir($localDir)){
            mkdir($localDir, 0777, true);
        }

        $fileVersion = $localDir . '/version.txt';
        $serverFile = '/updater/version.txt';

        if (!ftp_get($ftp, $fileVersion, $serverFile)) {
            throw $this->createNotFoundException("Fichier version introuvable.");
        }

        $handleVersion = fopen($fileVersion, 'r');
        $version = fread($handleVersion, filesize($fileVersion));
        fclose($handleVersion);

        $filename = "fokusV2_" . $version . '.apk';

        $fileApk = $localDir . '/' . $filename;
        $serverFile = '/updater/' . $filename;

        if (!ftp_get($ftp, $fileApk, $serverFile)) {
            throw $this->createNotFoundException("Fichier APK introuvable.");
        }

        ftp_close($ftp);

        return $this->extracted($fileApk, $filename);
    }

    #[Route('/application/patch', name: 'application_patch')]
    public function patch(FokusFtp $fokusFtp): Response
    {
        $ftp = $fokusFtp->login();
        if(!$ftp){
            throw $this->createNotFoundException("Connexion interrompu.");
        }

        $localDir = $this->getParameter('private_directory') . 'ftp';
        if(!is_dir($localDir)){
            mkdir($localDir, 0777, true);
        }

        $filename = 'patch.apk';

        $filePatch = $localDir . '/' . $filename;
        $serverFile = '/updater/' . $filename;

        if (!ftp_get($ftp, $filePatch, $serverFile)) {
            throw $this->createNotFoundException("Fichier version introuvable.");
        }

        return $this->extracted($filePatch, $filename);
    }

    /**
     * @param string $filePatch
     * @param string $filename
     * @return Response
     */
    public function extracted(string $filePatch, string $filename): Response
    {
        if (!file_exists($filePatch)) {
            throw $this->createNotFoundException("Fichier introuvable.");
        }

        return $this->file($filePatch, $filename);
    }
}
