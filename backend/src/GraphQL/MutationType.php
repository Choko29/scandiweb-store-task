<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\Models\Order;

class MutationType extends ObjectType {
    public function __construct() {
        $config = [
            'name' => 'Mutation',
            'fields' => [
                'createOrder' => [
                    'type' => Type::boolean(), 
                    'args' => [
                        'items' => Type::nonNull(Type::string()) 
                    ],
                    'resolve' => function ($root, $args) {
                        $items = json_decode($args['items'], true);

                        if (!is_array($items) || empty($items)) {
                            return false;
                        }

                        
                        return Order::create($items);
                    }
                ]
            ]
        ];
        parent::__construct($config);
    }
}