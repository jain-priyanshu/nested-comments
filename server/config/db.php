<?php

class Database {
    private static $instance;
    private $connection;

    private $dbHost = 'localhost';
    private $dbName = 'slim_api';
    private $dbUser = 'root';
    private $dbPass = '';

    private function __construct() {
        $this->connect();
    }

    private function connect() {
        $conn_str = "mysql:host={$this->dbHost};dbname={$this->dbName};charset=utf8mb4";

        try {
            $this->connection = new PDO($conn_str, $this->dbUser, $this->dbPass);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


            // echo "Database connected successfully!";

        } catch (PDOException $e) {
            die('Connection failed: ' . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }

}

// $db = Database::getInstance()->getConnection();

