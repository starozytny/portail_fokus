<?php

namespace App\Entity\Fokus;

use App\Repository\Fokus\FkElementNatureRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FkElementNatureRepository::class)]
#[ORM\Table(name: 'element_natures')]
class FkElementNature
{
    const LIST = ['fk_elem_nat_list'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fk_elem_nat_list'])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['fk_elem_nat_list'])]
    private ?int $elementId = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['fk_elem_nat_list'])]
    private ?int $natureId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getElementId(): ?int
    {
        return $this->elementId;
    }

    public function setElementId(?int $elementId): static
    {
        $this->elementId = $elementId;

        return $this;
    }

    public function getNatureId(): ?int
    {
        return $this->natureId;
    }

    public function setNatureId(?int $natureId): static
    {
        $this->natureId = $natureId;

        return $this;
    }
}
