<?php

namespace App\Entity\Fokus;

use App\Repository\Fokus\FkInventoryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FkInventoryRepository::class)]
#[ORM\Table(name: 'inventories')]
class FkInventory
{
    const LIST = ['fk_inventory_list'];

    const STATUS_PROCESSING = 0;
    const STATUS_END = 2;

    const TYPE_SORTANT = 0;
    const TYPE_ENTRANT = 1;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fk_inventory_list'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['fk_inventory_list'])]
    private ?float $uid = null;

    #[ORM\Column]
    #[Groups(['fk_inventory_list'])]
    private ?float $propertyUid = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['fk_inventory_list'])]
    private ?float $date = 0;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(['fk_inventory_list'])]
    private ?int $type = 0;

    #[ORM\Column(length: 126, nullable: true)]
    #[Groups(['fk_inventory_list'])]
    private ?string $tenants = "";

    #[ORM\Column]
    #[Groups(['fk_inventory_list'])]
    private ?int $userId = 0;

    #[ORM\Column]
    #[Groups(['fk_inventory_list'])]
    private ?int $state = 0;

    #[ORM\Column(nullable: true)]
    #[Groups(['fk_inventory_list'])]
    private ?float $comparative = 0;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Groups(['fk_inventory_list'])]
    private ?int $isImported = 0;

    #[ORM\Column(nullable: true)]
    #[Groups(['fk_inventory_list'])]
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
