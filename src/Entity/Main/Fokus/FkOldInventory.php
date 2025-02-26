<?php

namespace App\Entity\Main\Fokus;

use App\Repository\Main\Fokus\FkOldInventoryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FkOldInventoryRepository::class)]
class FkOldInventory
{
    const ENTRY_IA = ['fkoldinv_entry'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $codeSociety = null;

    #[ORM\Column]
    #[Groups(['fkoldinv_entry'])]
    private ?float $uid = null;

    #[ORM\Column]
    #[Groups(['fkoldinv_entry'])]
    private ?float $propertyUid = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(['fkoldinv_entry'])]
    private ?int $type = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCodeSociety(): ?string
    {
        return $this->codeSociety;
    }

    public function setCodeSociety(string $codeSociety): static
    {
        $this->codeSociety = $codeSociety;

        return $this;
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

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): static
    {
        $this->type = $type;

        return $this;
    }
}
