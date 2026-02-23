<?php

namespace App\Models\Product;

class ClothesProduct extends AbstractProduct {
    
    public function getProductDetails(): array {
        $data = $this->getBaseInfo();
        $data['__typename'] = 'ClothesProduct';
        
        return $data;
    }
}