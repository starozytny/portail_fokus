<?php

namespace App\Repository\Fokus;

use App\Entity\Fokus\FkTenant;
use Doctrine\ORM\EntityRepository;

/**
 * @extends EntityRepository<FkTenant>
 */
class FkTenantRepository extends EntityRepository
{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, FkTenant::class);
//    }

    //    /**
    //     * @return FkTenant[] Returns an array of FkTenant objects
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

    //    public function findOneBySomeField($value): ?FkTenant
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
