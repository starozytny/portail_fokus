<?php

namespace App\Entity\Administration;

use App\Repository\Administration\AdClientsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AdClientsRepository::class)]
#[ORM\Table(name: 'clients')]
class AdClients
{
    const LIST = ['ad_client_list'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ad_client_list'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $society = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['ad_client_list'])]
    private ?int $credits = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['ad_client_list'])]
    private ?int $totalCredits = null;

    #[ORM\Column]
    #[Groups(['ad_client_list'])]
    private ?int $refill = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Groups(['ad_client_list'])]
    private ?string $name = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Groups(['ad_client_list'])]
    private ?string $addr1 = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Groups(['ad_client_list'])]
    private ?string $addr2 = null;

    #[ORM\Column(length: 10, nullable: true)]
    #[Groups(['ad_client_list'])]
    private ?string $zipcode = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Groups(['ad_client_list'])]
    private ?string $city = null;

    #[ORM\Column(length: 48)]
    #[Groups(['ad_client_list'])]
    private ?string $email = null;

    #[ORM\Column(length: 15)]
    #[Groups(['ad_client_list'])]
    private ?string $phone = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['ad_client_list'])]
    private ?string $logo = null;

    #[ORM\Column(length: 4)]
    #[Groups(['ad_client_list'])]
    private ?string $numSociety = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(['ad_client_list'])]
    private ?int $isLogilink = 0;

    // propriétés non persistés
    #[Groups(['ad_client_list'])]
    private ?bool $isActivated = true;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSociety(): ?string
    {
        return $this->society;
    }

    public function setSociety(?string $society): static
    {
        $this->society = $society;

        return $this;
    }

    public function getCredits(): ?int
    {
        return $this->credits;
    }

    public function setCredits(?int $credits): static
    {
        $this->credits = $credits;

        return $this;
    }

    public function getTotalCredits(): ?int
    {
        return $this->totalCredits;
    }

    public function setTotalCredits(?int $totalCredits): static
    {
        $this->totalCredits = $totalCredits;

        return $this;
    }

    public function getRefill(): ?int
    {
        return $this->refill;
    }

    public function setRefill(int $refill): static
    {
        $this->refill = $refill;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(?string $logo): static
    {
        $this->logo = $logo;

        return $this;
    }

    public function getNumSociety(): ?string
    {
        return $this->numSociety;
    }

    public function setNumSociety(string $numSociety): static
    {
        $this->numSociety = $numSociety;

        return $this;
    }

    public function getIsLogilink(): ?int
    {
        return $this->isLogilink;
    }

    public function setIsLogilink(int $isLogilink): static
    {
        $this->isLogilink = $isLogilink;

        return $this;
    }

    public function getIsActivated(): ?bool
    {
        return $this->isActivated;
    }

    public function setIsActivated(?bool $value): static
    {
        $this->isActivated = $value;

        return $this;
    }

    #[Groups(['ad_client_list'])]
    public function getManager(): string
    {
        return "fokus" . $this->numSociety;
    }
}
