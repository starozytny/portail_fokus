<?php

namespace App\Service\Fokus;

use App\Entity\Administration\AdClients;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use InvalidArgumentException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class FokusService
{
    public function __construct(private readonly ManagerRegistry $registry)
    {}

    public function getEntityNameManager($nameManager = "default"): ObjectManager|bool
    {
        try {
            return $this->registry->getManager($nameManager);
        } catch (InvalidArgumentException $exception) {
            return false;
        }
    }

    public function getAdministrationEntityManager(): ObjectManager
    {
        return $this->registry->getManager("administration");
    }

    public function getAdClientByNumSociety($numSociety)
    {
        $em = $this->getAdministrationEntityManager();

        $client = $em->getRepository(AdClients::class)->findOneBy(['numSociety' => $numSociety]);
        if(!$client){
            throw new NotFoundHttpException("Client $numSociety not found");
        }

        return $client;
    }

    /**
     * @param AdClients[] $clients
     * @return AdClients[]
     */
    public function getClientsWithPropertyActivateSet(array $clients): array
    {
        foreach($clients as $client) {
            $em = $this->getEntityNameManager($client->getManager());

            if(!$em){
                $client->setIsActivated(false);
            }
        }

        return $clients;
    }
}
