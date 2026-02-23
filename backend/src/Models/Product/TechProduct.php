<?php

namespace App\Models\Product;

class TechProduct extends AbstractProduct {
    
    public function getProductDetails(): array {
        $data = $this->getBaseInfo();
        $data['__typename'] = 'TechProduct';
        
        
        
        return $data;
    }
}