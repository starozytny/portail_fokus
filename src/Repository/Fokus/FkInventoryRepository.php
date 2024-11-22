<?php

namespace App\Repository\Fokus;

use App\Entity\Fokus\FkInventory;
use Doctrine\ORM\EntityRepository;

/**
 * @extends EntityRepository<FkInventory>
 */
class FkInventoryRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, FkInventory::class);
//    }

    //    /**
    //     * @return FkInventory[] Returns an array of FkInventory objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?FkInventory
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
