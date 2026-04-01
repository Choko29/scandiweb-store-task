<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\Models\ProductModel;
use App\Models\Category;

class QueryType extends ObjectType {
    public function __construct() {
        $productType = new ProductType();
        $categoryType = new CategoryType();

        $config = [
            'name' => 'Query',
            'fields' => [
                'products' => [
                    'type' => Type::listOf($productType),
                    'resolve' => function () {
                        return ProductModel::getAll();
                    }
                ],
                'product' => [
                    'type' => $productType,
                    'args' => [
                        'id' => Type::nonNull(Type::string())
                    ],
                    'resolve' => function ($root, $args) {
                        return ProductModel::getById($args['id']);
                    }
                ],
                'categories' => [
                    'type' => Type::listOf($categoryType),
                    'resolve' => function () {
                        try {
                            return Category::getAll();
                        } catch (\Throwable $e) {
                            
                            error_log("🚨 ნამდვილი ერორი: " . $e->getMessage());
                            throw $e;
                        }
                    }
                ]
            ]
        ];
        parent::__construct($config);
    }
}