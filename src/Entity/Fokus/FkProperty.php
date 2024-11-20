<?php

namespace App\Entity\Fokus;

use App\Repository\Fokus\FkPropertyRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FkPropertyRepository::class)]
#[ORM\Table(name: 'properties')]
class FkProperty
{
    const LIST = ['fk_property_list'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fk_property_list'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['fk_property_list'])]
    private ?float $uid = null;

    #[ORM\Column(length: 10)]
    #[Groups(['fk_property_list'])]
    private ?string $reference = null;

    #[ORM\Column(length: 64)]
    private ?string $label = null;

    #[ORM\Column(length: 64, nullable: true)]
    #[Groups(['fk_property_list'])]
    private ?string $addr1 = null;

    #[ORM\Column(length: 64, nullable: true)]
    #[Groups(['fk_property_list'])]
    private ?string $addr2 = null;

    #[ORM\Column(length: 64, nullable: true)]
    #[Groups(['fk_property_list'])]
    private ?string $addr3 = null;

    #[ORM\Column(length: 10, nullable: true)]
    #[Groups(['fk_property_list'])]
    private ?string $zipcode = null;

    #[ORM\Column(length: 64, nullable: true)]
    #[Groups(['fk_property_list'])]
    private ?string $city = null;

    #[ORM\Column(nullable: true)]
    private ?int $rooms = 0;

    #[ORM\Column(length: 24, nullable: true)]
    private ?string $type = null;

    #[ORM\Column(length: 24, nullable: true)]
    private ?string $floor = null;

    #[ORM\Column]
    private ?float $surface = 0;

    #[ORM\Column(length: 20)]
    private ?string $door = "";

    #[ORM\Column(length: 40)]
    private ?string $building = "";

    #[ORM\Column(length: 32, nullable: true)]
    #[Groups(['fk_property_list'])]
    private ?string $owner = null;

    #[ORM\Column]
    private ?bool $isFurnished = true;

    #[ORM\Column]
    #[Groups(['fk_property_list'])]
    private ?float $lastInventoryUid = 0;

    #[ORM\Column]
    private ?int $isImported = 1;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['fk_property_list'])]
    private ?string $currentTenant = null;

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

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): static
    {
        $this->reference = $reference;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getAddr1(): ?string
    {
        return $this->addr1;
    }

    public function setAddr1(?string $addr1): static
    {
        $this->addr1 = $addr1;

        return $this;
    }

    public function getAddr2(): ?string
    {
        return $this->addr2;
    }

    public function setAddr2(?string $addr2): static
    {
        $this->addr2 = $addr2;

        return $this;
    }

    public function getAddr3(): ?string
    {
        return $this->addr3;
    }

    public function setAddr3(?string $addr3): static
    {
        $this->addr3 = $addr3;

        return $this;
    }

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(?string $zipcode): static
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getRooms(): ?int
    {
        return $this->rooms;
    }

    public function setRooms(?int $rooms): static
    {
        $this->rooms = $rooms;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getFloor(): ?string
    {
        return $this->floor;
    }

    public function setFloor(?string $floor): static
    {
        $this->floor = $floor;

        return $this;
    }

    public function getSurface(): ?float
    {
        return $this->surface;
    }

    public function setSurface(float $surface): static
    {
        $this->surface = $surface;

        return $this;
    }

    public function getDoor(): ?string
    {
        return $this->door;
    }

    public function setDoor(string $door): static
    {
        $this->door = $door;

        return $this;
    }

    public function getBuilding(): ?string
    {
        return $this->building;
    }

    public function setBuilding(string $building): static
    {
        $this->building = $building;

        return $this;
    }

    public function getOwner(): ?string
    {
        return $this->owner;
    }

    public function setOwner(?string $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function isFurnished(): ?bool
    {
        return $this->isFurnished;
    }

    public function setFurnished(bool $isFurnished): static
    {
        $this->isFurnished = $isFurnished;

        return $this;
    }

    public function getLastInventoryUid(): ?float
    {
        return $this->lastInventoryUid;
    }

    public function setLastInventoryUid(float $lastInventoryUid): static
    {
        $this->lastInventoryUid = $lastInventoryUid;

        return $this;
    }

    public function getIsImported(): ?int
    {
        return $this->isImported;
    }

    public function setIsImported(int $isImported): static
    {
        $this->isImported = $isImported;

        return $this;
    }

    public function getCurrentTenant(): ?string
    {
        return $this->currentTenant;
    }

    public function setCurrentTenant(string $currentTenant): static
    {
        $this->currentTenant = $currentTenant;

        return $this;
    }
}
