<?php

namespace App\Repository\Fokus;

use App\Entity\Fokus\FkAspect;
use Doctrine\ORM\EntityRepository;

/**
 * @extends EntityRepository<FkAspect>
 */
class FkAspectRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, FkAspect::class);
//    }

    //    /**
    //     * @return FkAspect[] Returns an array of FkAspect objects
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

    //    public function findOneBySomeField($value): ?FkAspect
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
