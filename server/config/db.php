<?php
use Dotenv\Dotenv;

class Database {
    private static $instance;
    private $connection;

    private function __construct() {
        $this->connect();
    }


    private function connect() {
        // freedb connection
        $dbHost = getenv('HOST');
        $dbName = getenv('DATABASE');
        $dbUser = getenv('USERNAME');
        $dbPass = getenv('PASS');

        $conn_str = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";

        try {
            $this->connection = new PDO($conn_str, $dbUser, $dbPass);
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