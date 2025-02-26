<?php

namespace App\Command\Fix;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'fix:tmp:data',
    description: 'Fix tmp data',
)]
class FixTmpDataCommand extends Command
{
    public function __construct(private readonly string $privateDirectory)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $filename = 'edldir_999_logilink.sql';
        $file = $this->privateDirectory . "database_v1/" . $filename;

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

        foreach($data as $item){
//            dump($item['uid'], $item['type']);
        }

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
