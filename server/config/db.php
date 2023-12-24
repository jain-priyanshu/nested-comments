<?php
use Dotenv\Dotenv;

class Database {
    private static $instance;
    private $connection;

    private function __construct() {
        $this->loadEnvironmentVariables();
        $this->connect();
    }

    private function loadEnvironmentVariables() {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->load();
    }


    private function connect() {
        // freedb connection
        $dbHost = $_ENV['HOST'];
        $dbName = $_ENV['DATABASE'];
        $dbUser = $_ENV['USER'];
        $dbPass = $_ENV['PASS'];


        // localhost connection
        // private $dbHost = 'localhost';
        // private $dbName = 'slim_api';
        // private $dbUser = 'root';
        // private $dbPass = '';


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

// $db = Database::getInstance()->getConnection();

