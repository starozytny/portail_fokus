<?php

namespace App\Entity\Fokus;

use App\Repository\Fokus\FkModelRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FkModelRepository::class)]
#[ORM\Table(name: 'models')]
class FkModel
{
    const LIST = ['fk_model_list'];
    const INVENTORY = ['fk_model_inv'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fk_model_list', 'fk_model_inv'])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['fk_model_list'])]
    private ?int $userId = null;

    #[ORM\Column(length: 40)]
    #[Groups(['fk_model_list', 'fk_model_inv'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['fk_model_list'])]
    private ?string $content = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): static
    {
        $this->userId = $userId;

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

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): static
    {
        $this->content = $content;

        return $this;
    }
}
