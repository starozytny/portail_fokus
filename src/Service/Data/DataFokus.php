<?php

namespace App\Service\Data;

use App\Entity\Fokus\FkAspect;
use App\Entity\Fokus\FkCounterType;
use App\Entity\Fokus\FkElement;
use App\Entity\Fokus\FkKeyType;
use App\Entity\Fokus\FkModel;
use App\Entity\Fokus\FkNature;
use App\Entity\Fokus\FkRoom;
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
        foreach($data->variants as $variant){
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
}
