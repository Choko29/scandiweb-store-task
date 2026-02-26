<?php

namespace App;

use PDO;
use PDOException;

class Database {
    public $conn;

    public function connect() {
        $this->conn = null;

        
        $host = getenv('MYSQLHOST') ?: '127.0.0.1';
        $db_name = getenv('MYSQLDATABASE') ?: 'scandiweb_db';
        $username = getenv('MYSQLUSER') ?: 'root';
        $password = getenv('MYSQLPASSWORD') ?: '';
        $port = getenv('MYSQLPORT') ?: '3306';

        try {
            $this->conn = new PDO(
                "mysql:host=" . $host . ";port=" . $port . ";dbname=" . $db_name,
                $username,
                $password
            );
            
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }

        return $this->conn;
    }
}