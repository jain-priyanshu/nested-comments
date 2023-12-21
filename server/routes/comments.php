<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

$app->group('/comments', function($app){

    // get all comments for a given blog_id
    $app->get('/all/{blog_id}[/]', function(Request $req, Response $res){
        $blog_id = $req->getAttribute('blog_id');

        try{
            $db = Database::getInstance()->getConnection();
            $sql = "SELECT * FROM comments where blog_id = :blog_id";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':blog_id', $blog_id);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $res->getBody()->write(json_encode($data));

            return $res->withHeader('content-type', 'application/json');

        } catch(PDOException $e){
            return $res->withJson(['message' => $e->getMessage()], 500);
        }
    });

    // PRIVATE ROUTE: post a comment
    $app->post('/post[/]', function(Request $req, Response $res){
        try{
            $db = Database::getInstance()->getConnection();
            $req_data = $req->getParsedBody();
            $blog_id = $req_data['blog_id'];
            $body = $req_data['body'];
            $user_id = $req_data['user_id'];
            $parent_id = $req_data['parent_id'];

            // if body is empty or null give error
            if($body == "" || $body == NULL){
                return $res->withJson([
                    'message' => 'Cannot post empty comments.'
                ], 400);
            }

            // if any other data which the user doesnt provide is wrong, give error
            // *this will occur due to errors in React front end code*
            if( 
                $blog_id == "" || $blog_id == NULL || 
                $user_id == "" || $user_id == NULL){
                    return $res->withJson([
                        'message' => 'Getting Wrong Info From Client, cannot post comment :('
                    ], 400);
            }

            $sql = 'SELECT username from USERS WHERE user_id = :user_id';
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if($result){
                $username = $result['username'];

                // insert comment
                $sql = 
                "INSERT INTO comments 
                    (blog_id, parent_id, body, likes, user_id, username, created_at) 
                VALUES(:blog_id, :parent_id, :body, 0, :user_id, :username, NOW())";
    
                $stmt = $db->prepare($sql);
                $stmt->bindParam(':blog_id', $blog_id);
                $stmt->bindParam(':body', $body);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->bindParam(':username', $username);
    
                if($parent_id == ""){
                    $parent_id = NULL; // comment being posted is a parent comment
                }
    
                $stmt->bindParam('parent_id', $parent_id);
    
                $stmt->execute();
                $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
                $comment_id = $db->lastInsertId();

                $sql = "SELECT * FROM comments WHERE comment_id = :comment_id";
                $stmt = $db->prepare($sql);
                $stmt->bindParam(':comment_id', $comment_id);
                $stmt->execute();
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $res->getBody()->write(json_encode($data));

                return $res->withHeader('content-type', 'application/json');
            
            }
            else{
                return $res->withJson(['message' => 'Wrong Username'], 400);
            }


        } catch(PDOException $e){
            return $res->withJson(['message' => $e->getMessage()], 500);
        }
    })->add('authMiddleware');

});
