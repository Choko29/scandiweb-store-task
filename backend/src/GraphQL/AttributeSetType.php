<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AttributeSetType extends ObjectType {
    public function __construct() {
        $config = [
            'name' => 'AttributeSet',
            'fields' => [
                'id' => Type::string(),
                'name' => Type::string(),
                'type' => Type::string(),
                'items' => [
                    'type' => Type::listOf(new AttributeItemType()),
                    'resolve' => function($attributeSet) {
                        return $attributeSet['items'] ?? [];
                    }
                ]
            ]
        ];
        parent::__construct($config);
    }
}