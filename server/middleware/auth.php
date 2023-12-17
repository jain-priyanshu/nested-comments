<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Factory\ResponseFactory;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

function verify($token, $secret){
    return JWT::decode($token, new Key($secret, 'HS256'));
}

function get_secret($key){
    return $_ENV[$key];
}

function authMiddleware(Request $req, RequestHandler $handler): Response {
    // echo "INSIDE MIDDLEWARE ";

    $token = $req->getHeaderLine('x-auth-token');

    if(empty($token)){
        $responseFactory = new ResponseFactory();
        $res = $responseFactory->createResponse(400);
        $res->getBody()->write(json_encode([
            'message' => 'No Token, Auth Denied'
        ]));
        return $res;
    }

    try{
        $decoded = verify($token, get_secret('SECRET_KEY'));
        $req = $req->withAttribute('user_id', $decoded->user_id);
        $res = $handler->handle($req); // next

        return $res;

    } catch(\Exception $e){
        $responseFactory = new ResponseFactory();
        $res = $responseFactory->createResponse(401);
        $res->getBody()->write(json_encode([
            'message' => 'Token is not valid'
        ]));

        return $res;
    }

};
