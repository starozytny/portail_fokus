<?php

namespace App\Service\Data;

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
}
