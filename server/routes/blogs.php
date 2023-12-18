<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

$app->group('/blogs', function($app){
    $app->get('/all[/]', function(Request $req, Response $res){
        try{
            $db = Database::getInstance()->getConnection();
            $stmt = $db->query("SELECT * FROM BLOGS");
            $data = $stmt->fetchAll(PDO::FETCH_OBJ);

            $res->getBody()->write(json_encode($data));

            return $res->withHeader('content-type', 'application/json');

        } catch(PDOException $e){
            return $res->withJson(['message' => $e->message], 500);
        }
    });
});