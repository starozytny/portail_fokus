<?php

namespace App\Entity\Fokus;

use App\Repository\Fokus\FkTenantRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FkTenantRepository::class)]
#[ORM\Table(name: 'tenants')]
class FkTenant
{
    const LIST = ['fk_tenant_list'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fk_tenant_list'])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?float $uid = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?string $lastName = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?string $firstName = null;

    #[ORM\Column(length: 15, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?string $phone = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?string $email = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?string $addr1 = null;

    #[ORM\Column(length: 40, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?string $addr2 = null;

    #[ORM\Column(length: 40, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?string $addr3 = null;

    #[ORM\Column(length: 5, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?string $zipcode = null;

    #[ORM\Column(length: 40, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?string $city = null;

    #[ORM\Column(length: 5, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?string $reference = null;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Groups(['fk_tenant_list'])]
    private ?int $isImported = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUid(): ?float
    {
        return $this->uid;
    }

    public function setUid(?float $uid): static
    {
        $this->uid = $uid;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

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

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(?string $reference): static
    {
        $this->reference = $reference;

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
}
