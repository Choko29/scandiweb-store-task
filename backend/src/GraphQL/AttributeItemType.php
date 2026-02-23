<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AttributeItemType extends ObjectType {
    public function __construct() {
        $config = [
            'name' => 'AttributeItem',
            'fields' => [
                'id' => Type::string(),
                'displayValue' => Type::string(),
                'value' => Type::string(),
            ]
        ];
        parent::__construct($config);
    }
}