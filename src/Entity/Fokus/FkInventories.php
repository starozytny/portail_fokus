<?php

namespace App\Entity\Fokus;

use App\Repository\Fokus\FkInventoriesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FkInventoriesRepository::class)]
#[ORM\Table(name: 'inventories')]
class FkInventories
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?float $uid = null;

    #[ORM\Column]
    private ?float $propertyUid = null;

    #[ORM\Column(nullable: true)]
    private ?float $date = 0;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $type = 0;

    #[ORM\Column(length: 126, nullable: true)]
    private ?string $tenants = "";

    #[ORM\Column]
    private ?int $userId = 0;

    #[ORM\Column]
    private ?int $state = 0;

    #[ORM\Column(nullable: true)]
    private ?float $comparative = 0;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    private ?int $isImported = 0;

    #[ORM\Column(nullable: true)]
    private ?float $input = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUid(): ?float
    {
        return $this->uid;
    }

    public function setUid(float $uid): static
    {
        $this->uid = $uid;

        return $this;
    }

    public function getPropertyUid(): ?float
    {
        return $this->propertyUid;
    }

    public function setPropertyUid(float $propertyUid): static
    {
        $this->propertyUid = $propertyUid;

        return $this;
    }

    public function getDate(): ?float
    {
        return $this->date;
    }

    public function setDate(?float $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getTenants(): ?string
    {
        return $this->tenants;
    }

    public function setTenants(?string $tenants): static
    {
        $this->tenants = $tenants;

        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getState(): ?int
    {
        return $this->state;
    }

    public function setState(int $state): static
    {
        $this->state = $state;

        return $this;
    }

    public function getComparative(): ?float
    {
        return $this->comparative;
    }

    public function setComparative(?float $comparative): static
    {
        $this->comparative = $comparative;

        return $this;
    }

    public function getIsImported(): ?int
    {
        return $this->isImported;
    }

    public function setIsImported(?int $isImported): static
    {
        $this->isImported = $isImported;

        return $this;
    }

    public function getInput(): ?float
    {
        return $this->input;
    }

    public function setInput(?float $input): static
    {
        $this->input = $input;

        return $this;
    }
}
