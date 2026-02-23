<?php

namespace App\Models\Product;

abstract class AbstractProduct {
    protected $id;
    protected $name;
    protected $inStock;
    protected $description;
    protected $category;
    protected $brand;

    public $gallery;
    public $prices;
    public $attributes;

    public function __construct(array $data) {
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->inStock = $data['inStock'];
        $this->description = $data['description'] ?? '';
        $this->category = $data['category_name'] ?? '';
        $this->brand = $data['brand'] ?? '';
        $this->gallery = $data['gallery'] ?? '[]';
        $this->prices = $data['prices'] ?? [];
        $this->attributes = $data['attributes'] ?? [];
    }

    abstract public function getProductDetails(): array;

    public function getBaseInfo(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'inStock' => (bool) $this->inStock,
            'description' => $this->description,
            'category' => $this->category,
            'brand' => $this->brand,
            'gallery' => $this->gallery,
            'prices' => $this->prices,
            'attributes' => $this->attributes
        ];
    }
}