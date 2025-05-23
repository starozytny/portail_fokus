<?php

namespace App\Controller\InternApi\Fokus;

use App\Entity\Fokus\FkInventory;
use App\Entity\Fokus\FkModel;
use App\Entity\Fokus\FkProperty;
use App\Entity\Fokus\FkTenant;
use App\Entity\Fokus\FkUser;
use App\Entity\Main\Fokus\FkOldInventory;
use App\Entity\Main\User;
use App\Service\ApiResponse;
use App\Service\Data\DataFokus;
use App\Service\Fokus\FokusApi;
use App\Service\Fokus\FokusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/intern/api/fokus/inventories', name: 'intern_api_fokus_inventories_')]
class InventoryController extends AbstractController
{
    #[Route('/list/{numSociety}', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(Request $request, $numSociety, FokusService $fokusService, ApiResponse $apiResponse,
                         SerializerInterface $serializer): Response
    {
        /** @var FkUser|User $user */
        $user = $this->getUser();
        $client = $fokusService->getAdClientByNumSociety($numSociety);

        $status = $request->query->get('st') ?: 0;

        $emDefault = $fokusService->getEntityNameManager();
        $em = $fokusService->getEntityNameManager($client->getManager());

        if(($user instanceof FkUser && $user->getRights() == 1) || ($user instanceof User && $user->getIsAdmin())){
            $data = $em->getRepository(FkInventory::class)->findBy(['state' => $status], ['id' => 'DESC']);
        }else{
            $data = $em->getRepository(FkInventory::class)->findBy(['state' => $status, 'userId' => $user->getId()], ['id' => 'DESC']);
        }

        $entryInventories = [];
        $v1entryInventories = [];
        if($status == 2){
            $entryInventories = $em->getRepository(FkInventory::class)->findBy(['state' => $status], ['id' => 'DESC']);
            $v1entryInventories = $emDefault->getRepository(FkOldInventory::class)->findBy(['codeSociety' => $numSociety], ['id' => 'DESC']);
        }

        $properties = $em->getRepository(FkProperty::class)->findAll();
        $tenants = $em->getRepository(FkTenant::class)->findAll();
        $users = $em->getRepository(FkUser::class)->findBy([], ['lastName' => 'ASC']);
        $models = $em->getRepository(FkModel::class)->findBy([], ['name' => 'ASC']);

        $data = $serializer->serialize($data, 'json', ['groups' => FkInventory::LIST]);
        $entryInventories = $serializer->serialize($entryInventories, 'json', ['groups' => FkInventory::ENTRY_IA]);
        $v1entryInventories = $serializer->serialize($v1entryInventories, 'json', ['groups' => FkOldInventory::ENTRY_IA]);
        $properties = $serializer->serialize($properties, 'json', ['groups' => FkProperty::LIST]);
        $tenants = $serializer->serialize($tenants, 'json', ['groups' => FkTenant::LIST]);
        $users = $serializer->serialize($users, 'json', ['groups' => FkUser::LIST]);
        $models = $serializer->serialize($models, 'json', ['groups' => FkModel::INVENTORY]);

        return $apiResponse->apiJsonResponseCustom([
            'donnees' => $data,
            'entryInventories' => $entryInventories,
            'v1entryInventories' => $v1entryInventories,
            'properties' => $properties,
            'tenants' => $tenants,
            'users' => $users,
            'models' => $models,
            'hasAi' => $client->getHasAi(),
        ]);
    }

    public function submitForm($type, FkInventory $obj, Request $request, ApiResponse $apiResponse,
                               FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): JsonResponse
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $dataToSend = $dataFokus->setDataInventory($data, $obj);

        if($type == "create") {
            $result = $fokusApi->inventoryCreate($dataToSend);
        } else {
            $result = $fokusApi->inventoryUpdate($dataToSend, $obj->getId());
        }

        if($result === false || $result == 409){
            if($result == 409){
                return $apiResponse->apiJsonResponseBadRequest('Un état des lieux existe déjà pour ce bien.');
            }
            return $apiResponse->apiJsonResponseBadRequest('[IF0001] Une erreur est survenue.');
        }

        $obj = $em->getRepository(FkInventory::class)->findOneBy(['id' => $type == "create" ? $result : $obj->getId()]);

        $this->addFlash('info', 'Données mises à jour.');
        return $apiResponse->apiJsonResponse($obj, FkInventory::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        return $this->submitForm("create", new FkInventory(), $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, $id, ApiResponse $apiResponse,
                           FokusApi $fokusApi, FokusService $fokusService, DataFokus $dataFokus): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkInventory::class)->find($id);
        return $this->submitForm("update", $obj, $request, $apiResponse, $fokusApi, $fokusService, $dataFokus);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete($id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkInventory::class)->find($id);

        if($obj || $obj->getState() == FkInventory::STATUS_END){
            return $apiResponse->apiJsonResponseBadRequest("Vous n'êtes pas autorisé à supprimer cet état des lieux.");
        }

        $result = $fokusApi->inventoryDelete($obj->getId());

        if($result === false){
            return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue.');
        }

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/document/{id}', name: 'document', options: ['expose' => true], methods: 'GET')]
    public function document($id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());

        $obj = $em->getRepository(FkInventory::class)->find($id);
        $result = $fokusApi->inventoryDocument($obj->getUid());

        if($result === false){
            return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue.');
        }

        $stream = fopen('php://memory', 'w+');
        fwrite($stream, $result);
        rewind($stream);

        $response = new Response(stream_get_contents($stream));
        fclose($stream);

        $response->headers->set('Content-Type', 'application/pdf');
        $response->headers->set('Content-Disposition', 'inline; filename="edl.pdf"');

        return $response;
    }

    #[Route('/move/{id}', name: 'move', options: ['expose' => true], methods: 'PUT')]
    public function move(Request $request, $id, FokusService $fokusService, FokusApi $fokusApi, ApiResponse $apiResponse,
                         DataFokus $dataFokus): Response
    {
        $em = $fokusService->getEntityNameManager($fokusApi->getManagerBySession());
        $data = json_decode($request->getContent());

        $obj = $em->getRepository(FkInventory::class)->find($id);

        $dataToSend = $dataFokus->setDataInventoryDate($data, $obj);

        $result = $fokusApi->inventoryUpdateDate($dataToSend, $obj->getId());

        if($result === false || $result == 409){
            if($result == 409){
                return $apiResponse->apiJsonResponseBadRequest('Un état des lieux existe déjà pour ce bien.');
            }
            return $apiResponse->apiJsonResponseBadRequest('[MF0001] Une erreur est survenue.');
        }

        $this->addFlash('info', 'Données mises à jour.');
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/ai-comparator-read-file/{uidOut}', name: 'ai_comparator_read_file', options: ['expose' => true], methods: 'POST')]
    public function aiComparatorReadFile($uidOut, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $result = $fokusApi->aiComparatorContent($uidOut);

        return $apiResponse->apiJsonResponseCustom([
            'answer' => $result ?: false
        ]);
    }

    #[Route('/ai-comparator-download-file/{uidOut}', name: 'ai_comparator_download_file', options: ['expose' => true], methods: 'GET')]
    public function aiComparatorDownloadFile($uidOut, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $result = $fokusApi->aiComparatorContent($uidOut);

        if(!$result){
            return $apiResponse->apiJsonResponseCustom([
                'answer' => false
            ]);
        }
        $nomFichier = $uidOut . '.txt';

        return new Response(
            $result,
            200,
            [
                'Content-Type' => 'text/plain',
                'Content-Disposition' => 'attachment; filename="' . $nomFichier . '"',
            ]
        );
    }

    #[Route('/ai-comparator-pictures/{uidOut}', name: 'ai_comparator_pictures', options: ['expose' => true], methods: 'GET')]
    public function aiComparatorPicture($uidOut, FokusApi $fokusApi): Response
    {
        $result = $fokusApi->aiComparatorPictures($uidOut);

        if(!$result){
            $this->addFlash('info', 'Aucune photos.');
            return $this->redirectToRoute('user_inventories_index', ['st' => 2]);
        }

        return new Response($result, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="photos_comparatif.pdf"',
        ]);
    }

    #[Route('/ai-comparator-run/{uidEntry}/{uidOut}', name: 'ai_comparator_run', options: ['expose' => true], methods: 'POST')]
    public function aiComparatorRun($uidEntry, $uidOut, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $result = $fokusApi->aiComparator($uidEntry, $uidOut);

        return $apiResponse->apiJsonResponseCustom([
            'answer' => $result ?: false
        ]);
    }

    #[Route('/ai-extractor-run/{uidOut}', name: 'ai_extractor_run', options: ['expose' => true], methods: 'POST')]
    public function aiExtractorRun($uidOut, FokusApi $fokusApi, ApiResponse $apiResponse): Response
    {
        $result = $fokusApi->aiExtractor($uidOut);

        return $apiResponse->apiJsonResponseCustom([
            'answer' => $result ?: false
        ]);
    }
}
