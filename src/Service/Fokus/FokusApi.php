<?php

namespace App\Service\Fokus;

use App\Entity\Fokus\FkUser;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class FokusApi
{
    public function __construct(private readonly string $ciphering,
                                private readonly string $cipheringIv,
                                private readonly string $cipheringPassphrase,
                                private readonly string $apiFokusUrl,
                                private readonly HttpClientInterface $client,
                                private readonly RequestStack $requestStack,
    ){}

    public function setSessionData ($username, $password): void
    {
        $session = $this->requestStack->getSession();

        $numSoc = str_split($username, 3);

        $session->set('numSociety', $numSoc[0]);
        $session->set('username', $username);

        if($password != ""){
            $passwordEncrypted = $this->encryption($password);
            $session->set('userpass', $passwordEncrypted);
        }
    }

    public function getSessionData(): array
    {
        $session = $this->requestStack->getSession();

        return [
            $session->get('numSociety'),
            $session->get('username'),
            $this->decryption($session->get('userpass'))
        ];
    }

    public function destroySessionData(): void
    {
        $session = $this->requestStack->getSession();

        $session->set('numSociety', null);
        $session->set('username', null);
        $session->set('userpass', null);
    }

    public function getManagerBySession(): string
    {
        $session = $this->requestStack->getSession();

        return "fokus" . $session->get('numSociety');
    }

    private function encryption($data): bool|string
    {
        $ciphering = $this->ciphering;
        $iv_length = openssl_cipher_iv_length($ciphering);
        return openssl_encrypt($data, $ciphering, $this->cipheringPassphrase, 0, $this->cipheringIv);
    }

    private function decryption($data): bool|string
    {
        $ciphering = $this->ciphering;
        $iv_length = openssl_cipher_iv_length($ciphering);
        return openssl_decrypt($data, $ciphering, $this->cipheringPassphrase, 0, $this->cipheringIv);
    }

    private function callApi($method, $path, $data=[], $decodeResponseToJson=true)
    {
        $sessionData = $this->getSessionData();
        try {
            $response = $this->client->request($method, $this->apiFokusUrl . $path , [
                'auth_basic' => [$sessionData[1], $sessionData[2]],
                'json' => $data
            ]);

            $statusCode = $response->getStatusCode();
            if($statusCode !== 200){
                return false;
            }

            return $decodeResponseToJson ? json_decode($response->getContent()) : $response->getContent();
        } catch (TransportExceptionInterface|ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            return false;
        }
    }

    public function userCreate($data)
    {
        return $this->callApi("POST", "add_user/", $data);
    }

    public function userUpdate($data, FkUser $obj)
    {
        return $this->callApi("POST", "edit_user/" . $obj->getId(), $data);
    }

    public function userUpdatePassword($data, FkUser $obj)
    {
        return $this->callApi("POST", "edit_user_password/" . $obj->getUsername() . "-" . $obj->getId(), $data);
    }
}
