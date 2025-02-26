<?php

namespace App\Entity\Main\Fokus;

use App\Repository\Main\Fokus\FkOldInventoriesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FkOldInventoriesRepository::class)]
class FkOldInventories
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $codeSociety = null;

    #[ORM\Column]
    private ?float $uid = null;

    #[ORM\Column(type: Types::SMALLINT)]
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
