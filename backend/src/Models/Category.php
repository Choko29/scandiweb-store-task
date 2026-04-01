<?php

namespace App\Models;

use App\Database;
use PDO;

class Category {
    public static function getAll(): array {
        $database = new Database();
        $pdo = $database->connect();

        
        $stmt = $pdo->query("SELECT name FROM categories");

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}