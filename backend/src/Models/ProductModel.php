<?php

namespace App\Models;

use App\Database;
use App\Models\Product\ProductFactory;

class ProductModel {
    public static function getAll(): array {
        $database = new Database();
        $pdo = $database->connect();

        $stmt = $pdo->query("SELECT * FROM products");
        $productsData = $stmt->fetchAll();

        $result = [];
        foreach ($productsData as $row) {
            $hydratedRow = self::hydrateProductData($pdo, $row);
            $productObj = ProductFactory::create($hydratedRow);
            $result[] = $productObj->getProductDetails();
        }

        return $result;
    }

    public static function getById(string $id): ?array {
        $database = new Database();
        $pdo = $database->connect();

        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        $hydratedRow = self::hydrateProductData($pdo, $row);
        $productObj = ProductFactory::create($hydratedRow);

        return $productObj->getProductDetails();
    }

    private static function hydrateProductData($pdo, array $row): array {
        $galleryStmt = $pdo->prepare("SELECT image_url FROM gallery WHERE product_id = ?");
        $galleryStmt->execute([$row['id']]);
        $row['gallery'] = $galleryStmt->fetchAll(\PDO::FETCH_COLUMN);

        $priceStmt = $pdo->prepare("SELECT amount, currency_label, currency_symbol FROM prices WHERE product_id = ?");
        $priceStmt->execute([$row['id']]);
        $row['prices'] = $priceStmt->fetchAll();

        $attrSetStmt = $pdo->prepare("SELECT id as db_id, name as id, name, type FROM attribute_sets WHERE product_id = ?");
        $attrSetStmt->execute([$row['id']]);
        $attributeSets = $attrSetStmt->fetchAll();

        foreach ($attributeSets as &$attrSet) {
            $attrItemStmt = $pdo->prepare("SELECT item_id as id, display_value as displayValue, value FROM attribute_items WHERE attribute_set_id = ?");
            $attrItemStmt->execute([$attrSet['db_id']]);
            $attrSet['items'] = $attrItemStmt->fetchAll();
        }
        unset($attrSet);

        $row['attributes'] = $attributeSets;

        return $row;
    }
}
