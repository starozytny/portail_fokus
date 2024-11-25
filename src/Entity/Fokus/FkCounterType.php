<?php

namespace App\Entity\Fokus;

use App\Repository\Fokus\FkCounterTypeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FkCounterTypeRepository::class)]
#[ORM\Table(name: 'counter_types')]
class FkCounterType
{
    const LIST = ['fk_counter_list'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fk_counter_list'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['fk_counter_list'])]
    private ?float $uid = null;

    #[ORM\Column(length: 40)]
    #[Groups(['fk_counter_list'])]
    private ?string $name = null;

    #[ORM\Column(length: 10, nullable: true)]
    #[Groups(['fk_counter_list'])]
    private ?string $unit = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['fk_counter_list'])]
    private ?bool $isNative = true;

    #[ORM\Column(nullable: true)]
    #[Groups(['fk_counter_list'])]
    private ?bool $isUsed = false;

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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(?string $unit): static
    {
        $this->unit = $unit;

        return $this;
    }

    public function isNative(): ?bool
    {
        return $this->isNative;
    }

    public function setNative(?bool $isNative): static
    {
        $this->isNative = $isNative;

        return $this;
    }

    public function isUsed(): ?bool
    {
        return $this->isUsed;
    }

    public function setUsed(?bool $isUsed): static
    {
        $this->isUsed = $isUsed;

        return $this;
    }
}
