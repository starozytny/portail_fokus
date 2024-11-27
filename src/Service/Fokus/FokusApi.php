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
            if($statusCode == 409){
                return $statusCode;
            }
            if($statusCode !== 200 && $statusCode !== 201){
                return false;
            }

            return $decodeResponseToJson ? json_decode($response->getContent()) : $response->getContent();
        } catch (TransportExceptionInterface|ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            return false;
        }
    }

    private function callApiWithoutAuth($method, $path, $data=[], $decodeResponseToJson=true)
    {
        try {
            $response = $this->client->request($method, $this->apiFokusUrl . $path , [
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

    // ------- User

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
        return $this->callApiWithoutAuth("PUT", "edit_user_password/" . $obj->getUsername() . "-" . $obj->getId(), $data);
    }

    public function userDelete(FkUser $obj)
    {
        return $this->callApi("GET", "delete_user/" . $obj->getId());
    }

    // ------- Bibli

    public function bibliCreate($entityName, $data)
    {
        return $this->callApi("POST", "library/add_" . $entityName . "/", $data);
    }

    public function bibliUpdate($entityName, $data, $id)
    {
        return $this->callApi("POST", "library/edit_" . $entityName . "/" . $id, $data);
    }

    public function bibliDelete($entityName, $id)
    {
        return $this->callApi("GET", "library/delete_" . $entityName . "/" . $id);
    }

    public function bibliUpdateElementNature($data, $id)
    {
        return $this->callApi("POST", "library/edit_natures/" . $id, $data);
    }

    // ------- Model

    public function modelCreate($data)
    {
        return $this->callApi("POST", "models/add_model/", $data);
    }

    public function modelUpdate($data, $id)
    {
        return $this->callApi("POST", "models/edit_model/" . $id, $data);
    }

    public function modelDelete($id)
    {
        return $this->callApi("GET", "models/delete_model/" . $id);
    }

    public function modelDuplicate($id)
    {
        return $this->callApi("GET", "models/" . $id);
    }

    // ------- Tenants

    public function tenantCreate($data)
    {
        return $this->callApi("POST", "add_tenant_portal/", $data);
    }

    public function tenantUpdate($data, $id)
    {
        return $this->callApi("PUT", "edit_tenant/" . $id, $data);
    }

    public function tenantDelete($id)
    {
        return $this->callApi("GET", "delete_tenant/" . $id);
    }

    // ------- Properties

    public function propertyCreate($data)
    {
        return $this->callApi("POST", "add_property/", $data);
    }

    public function propertyUpdate($data, $id)
    {
        return $this->callApi("PUT", "edit_property/" . $id, $data);
    }

    public function propertyDelete($id)
    {
        return $this->callApi("GET", "delete_property/" . $id);
    }

    // ------- Inventories

    public function inventoryCreate($data)
    {
        return $this->callApi("POST", "add_inventory/", $data);
    }

    public function inventoryUpdate($data, $id)
    {
        return $this->callApi("PUT", "edit_inventory/" . $id, $data);
    }

    public function inventoryDelete($id)
    {
        return $this->callApi("GET", "delete_inventory/" . $id);
    }

    public function inventoryDocument($uid)
    {
        return $this->callApi("GET", "inventories/pdf/" . $uid, [], false);
    }
}
