<?php

namespace App\Security;

use App\Entity\Fokus\FkUser;
use App\Entity\Main\User;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class FokusUserProvider implements UserProviderInterface
{
    private array $entityManagers;

    public function __construct(array $entityManagers)
    {
        $this->entityManagers = $entityManagers;
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        /** @var ObjectManager $entityManager */
        foreach ($this->entityManagers as $entityManager) {
            if(!$entityManager->getMetadataFactory()->isTransient(FkUser::class)){
                $user = $entityManager->getRepository(FkUser::class)->findOneBy(['username' => $identifier]);
            }else{
                $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $identifier]);
            }

            if ($user) {
                return $user;
            }
        }

        throw new UserNotFoundException(sprintf('User "%s" not found in any database.', $identifier));
    }

    public function refreshUser(UserInterface $user): UserInterface
    {
        if ($user instanceof User || $user instanceof FkUser) {
            return $user;
        }

        throw new UnsupportedUserException('User not managed by any configured database.');
    }

    public function supportsClass($class): bool
    {
        return $class === FkUser::class || $class === User::class || is_subclass_of($class, FkUser::class) || is_subclass_of($class, User::class);
    }
}
