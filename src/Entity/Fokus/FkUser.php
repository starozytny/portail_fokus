<?php

namespace App\Entity\Fokus;

use App\Repository\Fokus\FkUserRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FkUserRepository::class)]
#[ORM\Table(name: 'users')]
class FkUser
{
    const LIST = ['fk_user_list'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fk_user_list'])]
    private ?int $id = null;

    #[ORM\Column(length: 80)]
    #[Groups(['fk_user_list'])]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(['fk_user_list'])]
    private ?int $rights = null;

    #[ORM\Column(length: 80)]
    #[Groups(['fk_user_list'])]
    private ?string $firstName = null;

    #[ORM\Column(length: 80)]
    #[Groups(['fk_user_list'])]
    private ?string $lastName = null;

    #[ORM\Column(length: 64, nullable: true)]
    #[Groups(['fk_user_list'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['fk_user_list'])]
    private ?bool $isBlocked = true;

    #[ORM\Column(length: 4, nullable: true)]
    #[Groups(['fk_user_list'])]
    private ?string $userTag = null;

    #[ORM\Column]
    #[Groups(['fk_user_list'])]
    private ?int $external = 1;

    #[ORM\Column(length: 4, nullable: true)]
    #[Groups(['fk_user_list'])]
    private ?string $externalTag = null;

    // propriétés non persistés
    #[Groups(['fk_user_list'])]
    private ?string $societyName = null;

    #[Groups(['fk_user_list'])]
    private ?string $societyCode = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getRights(): ?int
    {
        return $this->rights;
    }

    public function setRights(int $rights): static
    {
        $this->rights = $rights;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function isBlocked(): ?bool
    {
        return $this->isBlocked;
    }

    public function setBlocked(bool $isBlocked): static
    {
        $this->isBlocked = $isBlocked;

        return $this;
    }

    public function getUserTag(): ?string
    {
        return $this->userTag;
    }

    public function setUserTag(?string $userTag): static
    {
        $this->userTag = $userTag;

        return $this;
    }

    public function getExternal(): ?int
    {
        return $this->external;
    }

    public function setExternal(int $external): static
    {
        $this->external = $external;

        return $this;
    }

    public function getExternalTag(): ?string
    {
        return $this->externalTag;
    }

    public function setExternalTag(?string $externalTag): static
    {
        $this->externalTag = $externalTag;

        return $this;
    }

    public function getSocietyName(): ?string
    {
        return $this->societyName;
    }

    public function setSocietyName(?string $value): static
    {
        $this->societyName = $value;

        return $this;
    }

    public function getSocietyCode(): ?string
    {
        return $this->societyCode;
    }

    public function setSocietyCode(?string $value): static
    {
        $this->societyCode = $value;

        return $this;
    }
}
