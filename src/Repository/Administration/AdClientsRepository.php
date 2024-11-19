<?php

namespace App\Repository\Administration;

use App\Entity\Administration\AdClients;
use Doctrine\ORM\EntityRepository;

/**
 * @extends EntityRepository<AdClients>
 */
class AdClientsRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, AdClients::class);
//    }

    //    /**
    //     * @return AdClients[] Returns an array of AdClients objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('a.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?AdClients
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
