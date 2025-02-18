<?php

namespace App\Service\Fokus;

use FTP\Connection;

class FokusFtp
{
    public function __construct(private readonly string $ftpHost, private readonly string $ftpUser, private readonly string $ftpPassword)
    {}

    public function login(): bool|Connection
    {
        $ftp = ftp_connect($this->ftpHost);

        if($ftp){
            ftp_login($ftp, $this->ftpUser, $this->ftpPassword);
            ftp_pasv($ftp, true);

            return $ftp;
        }

        return false;
    }
}
