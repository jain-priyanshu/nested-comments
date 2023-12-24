<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../middleware/corsMiddleware.php';

$app = AppFactory::create();

$app->add(new CorsMiddleware());

require __DIR__ . '/../routes/users.php';
require __DIR__ . '/../routes/blogs.php';
require __DIR__ . '/../routes/comments.php';
require __DIR__ . '/../middleware/auth.php';

// home test
$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write("Hello World!");
    return $response;
});

$app->run();