<?php

namespace App\Security;

use Symfony\Component\PasswordHasher\Exception\InvalidPasswordException;
use Symfony\Component\PasswordHasher\Hasher\CheckPasswordLengthTrait;
use Symfony\Component\PasswordHasher\PasswordHasherInterface;

class FokusPasswordHasher implements PasswordHasherInterface
{
    use CheckPasswordLengthTrait;

    public function __construct(private readonly string $salt)
    {}

    public function hash(#[\SensitiveParameter] string $plainPassword): string
    {
        if ($this->isPasswordTooLong($plainPassword)) {
            throw new InvalidPasswordException();
        }

        return hash("sha512", $this->salt . $plainPassword);
    }

    public function verify(string $hashedPassword, #[\SensitiveParameter] string $plainPassword): bool
    {
        if ('' === $plainPassword || $this->isPasswordTooLong($plainPassword)) {
            return false;
        }

        $hashed = hash("sha512", $this->salt . $plainPassword);
        if($hashed !== $hashedPassword) {
            return false;
        }

        return true;
    }

    public function needsRehash(string $hashedPassword): bool
    {
        return $hashedPassword;
    }
}
