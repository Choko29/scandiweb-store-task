<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\Database;
use App\Models\Product\ProductFactory;

class QueryType extends ObjectType {
    public function __construct() {
        $productType = new ProductType();

        $config = [
            'name' => 'Query',
            'fields' => [
                'products' => [
                    'type' => Type::listOf($productType),
                    'resolve' => function () {
                        $database = new Database();
                        $pdo = $database->connect();
                        
                        $stmt = $pdo->query("SELECT * FROM products");
                        $productsData = $stmt->fetchAll();

                        $result = [];
                        foreach ($productsData as $row) {
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
                            $row['attributes'] = $attributeSets;

                            $productObj = ProductFactory::create($row);
                            $result[] = $productObj->getProductDetails();
                        }
                        return $result;
                    }
                ],
                'product' => [
                    'type' => $productType,
                    'args' => [
                        'id' => Type::nonNull(Type::string())
                    ],
                    'resolve' => function ($root, $args) {
                        $database = new Database();
                        $pdo = $database->connect();
                        
                        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
                        $stmt->execute([$args['id']]);
                        $row = $stmt->fetch();
                        
                        if (!$row) return null;

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
                        $row['attributes'] = $attributeSets;

                        $productObj = ProductFactory::create($row);
                        return $productObj->getProductDetails();
                    }
                ]
            ]
        ];
        parent::__construct($config);
    }
}