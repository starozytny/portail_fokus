<?php

namespace App\Service;

use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use InvalidArgumentException;

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
}
