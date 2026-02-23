<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Database;
use App\Models\Product\ProductFactory;

echo "Starting the test...\n\n";

try {
    
    $database = new Database();
    $pdo = $database->connect();

    if ($pdo) {
        echo "✅ Database connection successful!\n\n";
    }

    $query = "SELECT * FROM products LIMIT 3";
    $stmt = $pdo->query($query);
    $products = $stmt->fetchAll();

    foreach ($products as $row) {
        
        $productObject = ProductFactory::create($row);
        
        $details = $productObject->getProductDetails();

        echo "📦 Product: " . $details['name'] . "\n";
        echo "🏷️ Database Category: " . $row['category_name'] . "\n";
        
        echo "⚙️ Class Used: " . get_class($productObject) . "\n";
        echo "✨ Generated Type (__typename): " . $details['__typename'] . "\n";
        echo "--------------------------------------------------\n";
    }

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}