<?php

namespace App\Models;

use App\Database;
use Exception;

class Order {
    public static function create(array $items): bool {
        if (empty($items)) {
            return false;
        }

        $database = new Database();
        $pdo = $database->connect();

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
        } catch (Exception $e) {
            $pdo->rollBack();
            error_log($e->getMessage());
            return false;
        }
    }
}