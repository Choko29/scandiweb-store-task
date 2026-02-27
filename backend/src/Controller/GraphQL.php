<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Schema;
use App\GraphQL\QueryType;
use App\GraphQL\MutationType; 
use RuntimeException;
use Throwable;

class GraphQL {
    public static function handle() {
        try {
            
            $queryType = new QueryType();
            $mutationType = new MutationType(); 
            
            $schema = new Schema([
                'query' => $queryType,
                'mutation' => $mutationType 
            ]);

            
            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('ვერ მოხერხდა მონაცემების წაკითხვა');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'] ?? '';
            $variableValues = $input['variables'] ?? null;

            
            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();

        } catch (Throwable $e) {
            
            $output = [
                'errors' => [
                    [
                        'message' => $e->getMessage()
                    ]
                ]
            ];
        }

        
        header('Content-Type: application/json; charset=UTF-8');
        
        
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');

        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }

        
        echo json_encode($output);
    }
}