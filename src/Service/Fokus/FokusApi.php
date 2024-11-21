<?php

namespace App\Service\Fokus;

use App\Entity\Fokus\FkUser;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class FokusApi
{
    private SessionInterface $session;

    public function __construct(private readonly string $ciphering,
                                private readonly string $cipheringIv,
                                private readonly string $cipheringPassphrase,
                                private readonly string $apiFokusUrl,
                                private readonly HttpClientInterface $client,
                                private readonly RequestStack $requestStack,
    ){
        $this->session = $this->requestStack->getSession();
    }

    public function setSessionData ($username, $password): void
    {
        $numSoc = str_split($username, 3);
        $passwordEncrypted = $this->encryption($password);

        $this->session->set('numSociety', $numSoc[0]);
        $this->session->set('username', $username);
        $this->session->set('userpass', $passwordEncrypted);
    }

    public function getSessionData(): array
    {
        return [
            $this->session->get('numSociety'),
            $this->session->get('username'),
            $this->decryption($this->session->get('userpass'))
        ];
    }

    public function destroySessionData(): void
    {
        $this->session->set('numSociety', null);
        $this->session->set('username', null);
        $this->session->set('userpass', null);
    }

    public function getManagerBySession(): string
    {
        return "fokus" . $this->session->get('numSociety');
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

    public function userUpdate(FkUser $obj, $data)
    {
        return $this->callApi("POST", "edit_user/" . $obj->getId(), $data);
    }
}
