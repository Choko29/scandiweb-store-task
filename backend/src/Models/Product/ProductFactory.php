<?php

namespace App\Models\Product;

use Exception;

class ProductFactory {
    
    protected static array $typeMap = [
        'tech' => TechProduct::class,
        'clothes' => ClothesProduct::class,
    ];

    public static function create(array $data): AbstractProduct {
        $category = $data['category_name'] ?? '';
        
        if (!isset(self::$typeMap[$category])) {
            throw new Exception("Unsupported category: '{$category}'");
        }

        $className = self::$typeMap[$category];
        
        return new $className($data);
    }
}