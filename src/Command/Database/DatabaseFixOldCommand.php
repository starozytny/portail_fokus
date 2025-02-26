<?php

namespace App\Command\Database;

use App\Entity\Main\Fokus\FkOldInventories;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'database:fix:old',
    description: 'insert codeSociety, uid and type of v1 fokus database',
)]
class DatabaseFixOldCommand extends Command
{
    public function __construct(private readonly string $privateDirectory, private readonly EntityManagerInterface $em)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $databases = [
            ['codeSociety' => '003', 'name' => '003_devictor'],
            ['codeSociety' => '008', 'name' => '008_laugier'],
            ['codeSociety' => '023', 'name' => '023_lacydon'],
            ['codeSociety' => '040', 'name' => '040_coudre'],
            ['codeSociety' => '048', 'name' => '048_mgf'],
            ['codeSociety' => '055', 'name' => '055_dastrevigne'],
            ['codeSociety' => '057', 'name' => '057_sada'],
            ['codeSociety' => '064', 'name' => '064_pinatel'],
            ['codeSociety' => '065', 'name' => '065_dallaporta'],
            ['codeSociety' => '073', 'name' => '073_sudvalue'],
            ['codeSociety' => '080', 'name' => '080_plaisant'],
            ['codeSociety' => '083', 'name' => '083_gpi'],
            ['codeSociety' => '086', 'name' => '086_adrim'],
            ['codeSociety' => '087', 'name' => '087_ceprogim'],
            ['codeSociety' => '092', 'name' => '092_tanneurs'],
            ['codeSociety' => '093', 'name' => '093_acig'],
            ['codeSociety' => '094', 'name' => '094_c2immo'],
            ['codeSociety' => '095', 'name' => '095_souchon'],
            ['codeSociety' => '096', 'name' => '096_pauquet'],
            ['codeSociety' => '098', 'name' => '098_lexgo'],
            ['codeSociety' => '101', 'name' => '101_van'],
            ['codeSociety' => '999', 'name' => '999_logilink'],
        ];

        foreach($databases as $database) {
            $io->title($database['name']);

            $filename = 'edldir_' . $database['name'] . '.sql';
            $file = $this->privateDirectory . "database_v1/" . $filename;

            if(!file_exists($file)) {
                $io->error('Fichier introuvable.');
            }

            $sqlContent = file_get_contents($file);

            preg_match_all('/INSERT INTO `([^`]*)` \(([^)]*)\) VALUES\s*(.*);/isU', $sqlContent, $matches, PREG_SET_ORDER);

            $data = [];

            foreach ($matches as $match) {
                $table = $match[1]; // Nom de la table

                if($table == "inventories"){
                    $columns = array_map('trim', explode(',', str_replace(['`', ' '], '', $match[2]))); // Colonnes
                    $values = trim($match[3]); // Valeurs insérées

                    // Extraire chaque ensemble de valeurs
                    preg_match_all('/\((.*?)\)/s', $values, $rows, PREG_SET_ORDER);

                    foreach ($rows as $row) {
                        // Séparer les valeurs en tenant compte des chaînes de caractères
                        $fields = str_getcsv($row[1], ',', "'");
                        $data[] = array_combine($columns, $fields);
                    }
                }
            }


            $progressBar = new ProgressBar($output, count($data));
            $progressBar->start();

            foreach($data as $item){
                $newObj = (new FkOldInventories())
                    ->setCodeSociety($database['codeSociety'])
                    ->setUid($item['uid'])
                    ->setType($item['type'])
                ;

                $this->em->persist($newObj);

                $progressBar->advance();
            }

            $progressBar->finish();

            $io->newLine();
            $io->newLine();
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
