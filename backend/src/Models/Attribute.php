<?php

namespace App\Models;

use PDO;

class Attribute {
    public static function getByProductId(PDO $pdo, string $productId): array {
        $attrSetStmt = $pdo->prepare(
            "SELECT id as db_id, name as id, name, type FROM attribute_sets WHERE product_id = ?"
        );
        $attrSetStmt->execute([$productId]);
        $attributeSets = $attrSetStmt->fetchAll();

        foreach ($attributeSets as &$attrSet) {
            $attrItemStmt = $pdo->prepare(
                "SELECT item_id as id, display_value as displayValue, value FROM attribute_items WHERE attribute_set_id = ?"
            );
            $attrItemStmt->execute([$attrSet['db_id']]);
            $attrSet['items'] = $attrItemStmt->fetchAll();
        }
        unset($attrSet);

        return $attributeSets;
    }
}