<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\GraphQL\PriceType;
use App\GraphQL\AttributeSetType;

class ProductType extends ObjectType {
    public function __construct() {
        $config = [
            'name' => 'Product',
            'description' => 'Our online store product',
            'fields' => function() {
                return [
                    'id' => Type::nonNull(Type::string()),
                    'name' => Type::nonNull(Type::string()),
                    'inStock' => Type::nonNull(Type::boolean()),
                    'description' => Type::string(),
                    'category' => Type::string(),
                    'brand' => Type::string(),
                    'gallery' => [
                        'type' => Type::listOf(Type::string()), 
                        'resolve' => function($product) {
                            $galleryData = $product['gallery'] ?? [];
                            if (is_string($galleryData)) {
                                $decoded = json_decode($galleryData, true);
                                return is_array($decoded) ? $decoded : [];
                            }
                            return is_array($galleryData) ? $galleryData : [];
                        }
                    ],
                    'attributes' => [
                        'type' => Type::listOf(new AttributeSetType()),
                        'resolve' => function($product) {
                            return $product['attributes'] ?? [];
                        }
                    ],
                    'prices' => [
                        'type' => Type::listOf(new PriceType()),
                        'resolve' => function($product) {
                            return $product['prices'] ?? [];
                        }
                    ],
                    '__typename' => Type::string()
                ];
            }
        ];
        parent::__construct($config);
    }
}