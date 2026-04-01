<?php

namespace App\Models;

use App\Database;
use App\Models\Product\ProductFactory;
use App\Models\Attribute;

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

        
        $row['attributes'] = Attribute::getByProductId($pdo, $row['id']);

        return $row;
    }
}