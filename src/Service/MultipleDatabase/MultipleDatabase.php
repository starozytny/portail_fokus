<?php

namespace App\Service\MultipleDatabase;

use App\Entity\Main\Settings;
use App\Entity\Main\Society;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Yaml\Yaml;

class MultipleDatabase
{
    private string $configDirectory;
    private string $envFile;
    private EntityManagerInterface $em;

    public function __construct($configDirectory, $envFile, EntityManagerInterface $entityManager)
    {
        $this->configDirectory = $configDirectory;
        $this->envFile = $envFile;
        $this->em = $entityManager;
    }

    public function createManager(Settings $settings, string $code, bool $force, bool $isFokus, $suffixe = null): bool
    {
        if (!$force) {
            $society = $this->em->getRepository(Society::class)->findOneBy(['code' => $code]);
            if($society){
                return false;
            }
        }

        //vars
        $nameManager = ($isFokus ? $settings->getPrefixFokus() : $settings->getPrefixDatabase()).$code;
        $nameEnvData = "%env(resolve:DATABASE_URL_CLIENT_".$code.")%";
        $databConfig = file_get_contents($this->configDirectory . 'databaseConfig.json');
        $db = json_decode($databConfig, true);

        //write services for fokus
        if($isFokus){
            $serviceFile = $this->configDirectory . "services_db_fokus.yaml";
            $yamlData = Yaml::parseFile($serviceFile);

            if (!isset($yamlData['services']['App\Security\FokusUserProvider']['calls'])) {
                $yamlData['services']['App\Security\FokusUserProvider']['calls'] = [];
            }

            // Déterminer si une méthode "setEntityManagers" existe déjà
            $setEntityManagersIndex = null;
            foreach ($yamlData['services']['App\Security\FokusUserProvider']['calls'] as $index => $call) {
                if (isset($call['method']) && $call['method'] === 'setEntityManagers') {
                    $setEntityManagersIndex = $index;
                    break;
                }
            }

            $newEntityManager = "@doctrine.orm.".$nameManager."_entity_manager";

            if ($setEntityManagersIndex !== null) {
                $currentManagers = &$yamlData['services']['App\Security\FokusUserProvider']['calls'][$setEntityManagersIndex]['arguments']['$entityManagers'];
                if (!in_array($newEntityManager, $currentManagers, true)) {
                    $currentManagers[] = $newEntityManager;
                }
            } else {
                $yamlData['services']['App\Security\FokusUserProvider']['calls'][] = [
                    'method' => 'setEntityManagers',
                    'arguments' => [
                        '$entityManagers' => [
                            $newEntityManager,
                        ],
                    ],
                ];
            }

            $yaml = Yaml::dump($yamlData, 7);
            file_put_contents($serviceFile, $yaml);
        }

        //write env file
        $env = file_get_contents($this->envFile);
        $env .= 'DATABASE_URL_CLIENT_'.$code.'="mysql://'.$db['db_username'].':'.$db['db_password'].'@'.$db['db_host'].'/'.$db['db_prefix'] . ($isFokus ? $code . $suffixe : $nameManager).'?serverVersion='.$db['db_version'].'"';
        $env .= "\n";
        file_put_contents($this->envFile, $env);

        //write yaml file doctrine
        $doctrineFile = $this->configDirectory . "packages/doctrine.yaml";
        $data = Yaml::parseFile($doctrineFile);

        $data['doctrine']['dbal']['connections'][$nameManager] = [
            'url' => $nameEnvData
        ];
        $data['doctrine']['orm']['entity_managers'][$nameManager] = [
            "naming_strategy" => "doctrine.orm.naming_strategy.underscore_number_aware",
            "connection" => $nameManager,
            "report_fields_where_declared" => true,
            "mappings" => [
                ucfirst($nameManager) => [
                    "is_bundle" => false,
                    "dir" => "%kernel.project_dir%/src/Entity/" . $db['db_folder'],
                    "prefix" => "App\Entity\\" . $db['db_folder'],
                    "alias" => ucfirst($nameManager),
                ]
            ]
        ];

        $yaml = Yaml::dump($data, 9);
        file_put_contents($doctrineFile, $yaml);

        return true;
    }

    public function updateManager(Settings $settings, string $oldCode, string $newCode): bool
    {
        $society0 = $this->em->getRepository(Society::class)->findOneBy(['code' => $oldCode]);
        $society1 = $this->em->getRepository(Society::class)->findOneBy(['code' => $newCode]);
        if(!$society0 || $society1){
            return false;
        }

        //vars
        $nameManager = $settings->getPrefixDatabase().$oldCode;
        $nameEnvData = "DATABASE_URL_CLIENT_".$oldCode;
        $nameManagerMaj = ucfirst($settings->getPrefixDatabase()).$oldCode;

        $nNameManager = $settings->getPrefixDatabase().$newCode;
        $nNameEnvData = "DATABASE_URL_CLIENT_".$newCode;
        $nNameManagerMaj = ucfirst($settings->getPrefixDatabase()).$newCode;

        //write env file
        $env = file_get_contents($this->envFile);
        $env = str_replace($nameManager, $nNameManager, $env);
        $env = str_replace($nameEnvData, $nNameEnvData, $env);
        file_put_contents($this->envFile, $env);

        //write yaml file doctrine
        $doctrineFile = $this->configDirectory . "packages/doctrine.yaml";
        $doctrine = file_get_contents($doctrineFile);
        $doctrine = str_replace($nameManager, $nNameManager, $doctrine);
        $doctrine = str_replace($nameEnvData, $nNameEnvData, $doctrine);
        $doctrine = str_replace($nameManagerMaj, $nNameManagerMaj, $doctrine);
        file_put_contents($doctrineFile, $doctrine);

        return true;
    }
}
