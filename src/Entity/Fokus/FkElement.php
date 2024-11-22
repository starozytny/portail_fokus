<?php

namespace App\Entity\Fokus;

use App\Repository\Fokus\FkElementRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FkElementRepository::class)]
#[ORM\Table(name: 'elements')]
class FkElement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?float $uid = null;

    #[ORM\Column(length: 40)]
    private ?string $name = null;

    #[ORM\Column(length: 2, nullable: true)]
    private ?string $gender = null;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    private ?int $category = 0;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    private ?int $family = 0;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $variants = null;

    #[ORM\Column(nullable: true)]
    private ?bool $isNative = true;

    #[ORM\Column(nullable: true)]
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

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(?string $gender): static
    {
        $this->gender = $gender;

        return $this;
    }

    public function getCategory(): ?int
    {
        return $this->category;
    }

    public function setCategory(?int $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getFamily(): ?int
    {
        return $this->family;
    }

    public function setFamily(?int $family): static
    {
        $this->family = $family;

        return $this;
    }

    public function getVariants(): ?string
    {
        return $this->variants;
    }

    public function setVariants(?string $variants): static
    {
        $this->variants = $variants;

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
