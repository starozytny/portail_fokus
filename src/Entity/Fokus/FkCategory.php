<?php

namespace App\Entity\Fokus;

use App\Repository\Fokus\FkCategoryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FkCategoryRepository::class)]
#[ORM\Table(name: 'categories')]
class FkCategory
{
    const LIST = ['fk_category_list'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fk_category_list'])]
    private ?int $id = null;

    #[ORM\Column(length: 80)]
    #[Groups(['fk_category_list'])]
    private ?string $name = null;

    public function getId(): ?int
    {
        return $this->id;
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
}
