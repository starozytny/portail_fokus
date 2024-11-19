<?php

namespace App\Service;

use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;

class FokusService
{
    public function __construct(private readonly ManagerRegistry $registry)
    {}

    public function getEntityNameManager($nameManager = "default"): ObjectManager
    {
        return $this->registry->getManager($nameManager);
    }

    public function getAdministrationEntityManager()
    {
        return $this->registry->getManager("administration");
    }
}
