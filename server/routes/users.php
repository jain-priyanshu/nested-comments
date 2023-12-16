<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Firebase\JWT\JWT;
use Dotenv\Dotenv;

// require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable('../');
$dotenv->load();

$app = AppFactory::create();

$app->group('/users', function($app){

    // Register
    $app->post('/register[/]', function(Request $req, Response $res){
        try{
            $db = Database::getInstance()->getConnection();
            $data = $req->getParsedBody();
            $username = $data['username'];
            $password = $data['password'];

            // check if username or password is empty
            if($username == '' || $password == ''){
                return $res->withJson([
                    'message' => 'Username and Password are required'
                ], 400);
            }

            // check if username already exists
            $stmt = $db->prepare('SELECT COUNT(*) FROM USERS WHERE USERNAME = :username');
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $count = $stmt->fetchColumn();

            if($count > 0){
                return $res->withJson([
                    'message' => 'Username already exists'
                ], 400);
            }

            // Insert new user in DB
            $sql = 'INSERT INTO USERS (username, password) VALUES(:username, :password)';
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);
            $stmt->execute();

            $result = ['message' => 'User registered successfully'];

            return $res->withJson($result, 200);

        } catch(PDOException $e){
            return $res->withJson(['message' => $e->getMessage()], 500);
        }
    });

    // Login
    $app->post('/login[/]', function(Request $req, Response $res){
        try{
            $db = Database::getInstance()->getConnection();
            $data = $req->getParsedBody();
            $username = $data['username'];
            $password = $data['password'];

            if($username == '' || $password == ''){
                return $res->withJson([
                    'message' => 'Username and Password Required'
                ], 400);
            }

            $stmt = $db->prepare('SELECT user_id FROM users where username = :username and password = :password');
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if($result){
                $user_id = $result['user_id'];
                $secretKey = $_ENV['SECRET_KEY'];
                $expirationTime = time() + 3600; // 1 hour

                $payload = [
                    'user_id' => $user_id,
                    'exp' => $expirationTime
                ];

                $token = JWT::encode($payload, $secretKey, 'HS256');

                return $res->withJson([
                    'token' => $token, 'user_id' => $user_id
                ], 200);
            }
            else{
                return $res->withJson([
                    'message' => 'Username or Password is incorrect'
                ], 400);
            }


            $res->getBody()->write(" This should not happen :) ");
            return $res;

        } catch(PDOException $e){
            return $res->withJson(['message' => $e->getMessage], 500);
        }
    });

    // get all users
    $app->get('/all[/]', function(Request $req, Response $res){
        try{
            $db = Database::getInstance()->getConnection();
            $stmt = $db->query('SELECT * FROM USERS');
            $data = $stmt->fetchAll(PDO::FETCH_OBJ);

            $res->getBody()->write(json_encode($data));
            return $res->withHeader('content-type', 'application/json');


        } catch(PDOException $e){
            return $res->withJson(['message' => $e->getMessage], 500);
        }
    });

});