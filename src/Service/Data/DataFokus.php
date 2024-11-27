<?php

namespace App\Service\Data;

use App\Entity\Fokus\FkAspect;
use App\Entity\Fokus\FkCounterType;
use App\Entity\Fokus\FkElement;
use App\Entity\Fokus\FkInventory;
use App\Entity\Fokus\FkKeyType;
use App\Entity\Fokus\FkModel;
use App\Entity\Fokus\FkNature;
use App\Entity\Fokus\FkProperty;
use App\Entity\Fokus\FkRoom;
use App\Entity\Fokus\FkTenant;
use App\Entity\Fokus\FkUser;
use App\Service\SanitizeData;

class DataFokus
{
    public function __construct(
        private readonly SanitizeData $sanitizeData,
    ) {}

    public function setDataUser(?FkUser $obj, $data): array
    {
        $username = $this->sanitizeData->trimData($data->username);
        $userTag = $this->sanitizeData->trimData($data->userTag);

        return [
            'id' => $obj->getId() ?: null,
            'username' => mb_strtoupper($username),
            'first_name' => $this->sanitizeData->cleanForFokus($data->firstname),
            'last_name' => $this->sanitizeData->cleanForFokus($data->lastname),
            'password' => $data->password,
            'email' => $this->sanitizeData->cleanFullFokus($data->email),
            'user_tag' => mb_strtoupper($userTag)
        ];
    }

    public function setDataRoom(?FkRoom $obj, $data): array
    {
        return [
            'id' => $obj->getId() ?: null,
            'name' => $this->sanitizeData->cleanForFokus($data->name),
        ];
    }

    public function setDataKey(?FkKeyType $obj, $data): array
    {
        return [
            'id' => $obj->getId() ?: null,
            'name' => $this->sanitizeData->cleanForFokus($data->name),
        ];
    }

    public function setDataCounter(?FkCounterType $obj, $data): array
    {
        return [
            'id' => $obj->getId() ?: null,
            'name' => $this->sanitizeData->cleanForFokus($data->name),
            'unit' => $this->sanitizeData->cleanFullFokus($data->unit),
        ];
    }

    public function setDataNature(?FkNature $obj, $data): array
    {
        return [
            'id' => $obj->getId() ?: null,
            'name' => $this->sanitizeData->cleanForFokus($data->name),
        ];
    }

    public function setDataAspect(?FkAspect $obj, $data): array
    {
        return [
            'id' => $obj->getId() ?: null,
            'name' => $this->sanitizeData->cleanForFokus($data->name),
        ];
    }

    public function setDataElement(?FkElement $obj, $data): array
    {
        $gender = $this->sanitizeData->cleanForFokus($data->gender);
        $ortho = $this->sanitizeData->cleanForFokus($data->ortho);

        $gender = $gender == 0 ? "m" : "f";
        $gender = $gender . (($ortho == 0) ? "" : "p");


        $variants = [];
        foreach ($data->variants as $variant) {
            $variants[] = $this->sanitizeData->cleanForFokus($variant);
        }

        return [
            'id' => $obj->getId() ?: null,
            'name' => $this->sanitizeData->cleanForFokus($data->name),
            'category' => $data->category,
            'family' => $data->family,
            'gender' => $gender,
            'variants' => $variants,
        ];
    }

    public function setDataModel(?FkModel $obj, $data): array
    {
        return [
            'id' => $obj->getId() ?: null,
            'name' => $this->sanitizeData->cleanForFokus($data->name),
            'content' => json_encode($data->content),
        ];
    }

    public function setDataTenant(?FkTenant $obj, $data): array
    {
        return [
            'id' => $obj->getId() ?: null,
            'last_name' => $this->sanitizeData->cleanFullFokus($data->lastName),
            'first_name' => $this->sanitizeData->cleanFullFokus($data->firstName),
            'phone' => $this->sanitizeData->toFormatPhone($data->phone),
            'email' => $this->sanitizeData->cleanFullFokus($data->email),
            'addr1' => $this->sanitizeData->cleanFullFokus($data->addr1),
            'addr2' => $this->sanitizeData->cleanFullFokus($data->addr2),
            'addr3' => $this->sanitizeData->cleanFullFokus($data->addr3),
            'city' => $this->sanitizeData->cleanFullFokus($data->city),
            'zipcode' => $this->sanitizeData->cleanFullFokus($data->zipcode)
        ];
    }

    public function setDataProperty(?FkProperty $obj, $data): array
    {
        return [
            'id' => $obj->getId() ?: null,
            'reference' => $this->sanitizeData->cleanFullFokus($data->reference),
            'addr1' => $this->sanitizeData->cleanFullFokus($data->addr1),
            'addr2' => $this->sanitizeData->cleanFullFokus($data->addr2),
            'addr3' => $this->sanitizeData->cleanFullFokus($data->addr3),
            'city' => $this->sanitizeData->cleanFullFokus($data->city),
            'zipcode' => $this->sanitizeData->cleanFullFokus($data->zipcode),
            'building' => $this->sanitizeData->cleanFullFokus($data->building),
            'type' => $this->sanitizeData->cleanFullFokus($data->type),
            'surface' => $this->sanitizeData->cleanFullFokus($data->surface, 0),
            'floor' => $this->sanitizeData->cleanFullFokus($data->floor),
            'door' => $this->sanitizeData->cleanFullFokus($data->door),
            'rooms' => $this->sanitizeData->cleanFullFokus($data->rooms, 0),
            'owner' => $this->sanitizeData->cleanFullFokus($data->owner),
            'is_furnished' => $data->isFurnished[0]
        ];
    }

    public function setDataInventory(?FkInventory $obj, $data): array
    {
        $input = $data->input;
        $comparativeValue = 0;
        if($data->input == 2){
            $input = $data->property->lastInventoryUid;

            switch ($data->comparative) {
                case [2]: $comparativeValue = 1; break;
                case [0]: $comparativeValue = 2; break;
                case [0,1]: $comparativeValue = 3; break;
                case [0,1,2]: $comparativeValue = 4; break;
                case [0,2]: $comparativeValue = 5; break;
                case [1,2]: $comparativeValue = 6; break;
                case [1]: $comparativeValue = 7; break;
                default:break;
            }
        }else if($data->input == 1){
            $input = $data->model;
        }

        $tenants = [];
        foreach($data->tenants as $tenant){
            $tenants[] = $tenant->reference;
        }

        $date = $this->sanitizeData->createDateTime($data->date);

        return [
            'uid' => $obj->getId() ?: null,
            'property_uid' => $data->property->uid,
            'date' => $date ? $date->getTimestamp() : "",
            'type' => $data->type,
            'comparative' => $comparativeValue,
            'tenants' => json_encode($tenants),
            'user_id' => $data->userId,
            'input' => $input,
        ];
    }
}
