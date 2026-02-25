<?php

// Railway-ს გარემოს ცვლადები ბაზასთან დასაკავშირებლად
$host = getenv('MYSQLHOST') ?: '127.0.0.1';
$db   = getenv('MYSQLDATABASE') ?: 'scandiweb_db';
$user = getenv('MYSQLUSER') ?: 'root';
$pass = getenv('MYSQLPASSWORD') ?: '';
$port = getenv('MYSQLPORT') ?: '3306';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "Successfully connected to the database!\n";
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}


$sql = "
    CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        inStock BOOLEAN NOT NULL,
        description TEXT,
        category_name VARCHAR(255),
        brand VARCHAR(255),
        FOREIGN KEY (category_name) REFERENCES categories(name) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(255),
        image_url TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        currency_label VARCHAR(10) NOT NULL,
        currency_symbol VARCHAR(10) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attribute_sets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attribute_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        attribute_set_id INT,
        display_value VARCHAR(255) NOT NULL,
        value VARCHAR(255) NOT NULL,
        item_id VARCHAR(255) NOT NULL,
        FOREIGN KEY (attribute_set_id) REFERENCES attribute_sets(id) ON DELETE CASCADE
    );
";

$pdo->exec($sql);
echo "Tables successfully created!\n";


$jsonFile = __DIR__ . '/../data.json';
if (!file_exists($jsonFile)) {
    die("Error: data.json file not found. Make sure it is in the root directory.\n");
}

$jsonData = file_get_contents($jsonFile);
$data = json_decode($jsonData, true);

if (!$data) {
    die("Error: Failed to parse JSON file.\n");
}


$stmtCategory = $pdo->prepare("INSERT IGNORE INTO categories (name) VALUES (?)");
foreach ($data['data']['categories'] as $category) {
    $stmtCategory->execute([$category['name']]);
}


$stmtProduct = $pdo->prepare("INSERT INTO products (id, name, inStock, description, category_name, brand) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)");
$stmtGallery = $pdo->prepare("INSERT INTO gallery (product_id, image_url) VALUES (?, ?)");
$stmtPrice = $pdo->prepare("INSERT INTO prices (product_id, amount, currency_label, currency_symbol) VALUES (?, ?, ?, ?)");
$stmtAttrSet = $pdo->prepare("INSERT INTO attribute_sets (product_id, name, type) VALUES (?, ?, ?)");
$stmtAttrItem = $pdo->prepare("INSERT INTO attribute_items (attribute_set_id, display_value, value, item_id) VALUES (?, ?, ?, ?)");

foreach ($data['data']['products'] as $product) {
    
    $inStock = $product['inStock'] ? 1 : 0;
    $stmtProduct->execute([
        $product['id'], 
        $product['name'], 
        $inStock, 
        $product['description'], 
        $product['category'], 
        $product['brand']
    ]);

    
    if (isset($product['gallery'])) {
        foreach ($product['gallery'] as $image) {
            $stmtGallery->execute([$product['id'], $image]);
        }
    }

    
    if (isset($product['prices'])) {
        foreach ($product['prices'] as $price) {
            $stmtPrice->execute([
                $product['id'], 
                $price['amount'], 
                $price['currency']['label'], 
                $price['currency']['symbol']
            ]);
        }
    }

    
    if (isset($product['attributes'])) {
        foreach ($product['attributes'] as $attribute) {
            $stmtAttrSet->execute([$product['id'], $attribute['name'], $attribute['type']]);
            $attributeSetId = $pdo->lastInsertId(); 

            foreach ($attribute['items'] as $item) {
                $stmtAttrItem->execute([
                    $attributeSetId, 
                    $item['displayValue'], 
                    $item['value'], 
                    $item['id']
                ]);
            }
        }
    }
}

echo "Success! Data has been successfully loaded into the database!\n";
?>