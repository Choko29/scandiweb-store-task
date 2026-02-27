<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\Database;

class MutationType extends ObjectType {
    public function __construct() {
        $config = [
            'name' => 'Mutation',
            'fields' => [
                'createOrder' => [
                    'type' => Type::boolean(), 
                    'args' => [
                        'items' => Type::nonNull(Type::string()) 
                    ],
                    'resolve' => function ($root, $args) {
                        $database = new Database();
                        $pdo = $database->connect();
                        
                        
                        $items = json_decode($args['items'], true);

                        if (empty($items)) {
                            return false;
                        }

                        try {
                            $pdo->beginTransaction();
                            
                            $stmt = $pdo->prepare("INSERT INTO orders () VALUES ()");
                            $stmt->execute();
                            $orderId = $pdo->lastInsertId(); 
                            
                            $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, selected_attributes) VALUES (?, ?, ?, ?)");
                            
                            foreach ($items as $item) {
                                $itemStmt->execute([
                                    $orderId,
                                    $item['product_id'],
                                    $item['quantity'],
                                    json_encode($item['selected_attributes'])
                                ]);
                            }

                            $pdo->commit();
                            return true;
                        } catch (\Exception $e) {
                            $pdo->rollBack();
                            error_log($e->getMessage());
                            return false;
                        }
                    }
                ]
            ]
        ];
        parent::__construct($config);
    }
}