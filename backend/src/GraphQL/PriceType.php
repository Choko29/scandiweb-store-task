<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class PriceType extends ObjectType {
    public function __construct() {
        $config = [
            'name' => 'Price',
            'fields' => [
                'amount' => Type::float(),
                'currency_label' => Type::string(),
                'currency_symbol' => Type::string(),
            ]
        ];
        parent::__construct($config);
    }
}