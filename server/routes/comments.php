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
            $user_id = $req->getAttribute('user_id');
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

    // PRIVATE ROUTE: Update Comment
    $app->put('/edit/{id}[/]', function(Request $req, Response $res){
        $curr = $req->getAttribute('user_id'); // logged in user
        $comment_id = $req->getAttribute('id'); // edit req for this comment
        $message = $req->getParsedBody()['message']; // new updated message

        try{
            $db = Database::getInstance()->getConnection();
            // return the user who created this comment.
            // comment cannot be edited if deleted=1
            $sql = "SELECT user_id from comments 
            WHERE comment_id = :comment_id AND deleted = 0"; 
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':comment_id', $comment_id);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if($result){
                $user_id = $result['user_id']; // user who created the comment

                if($user_id === $curr){

                    if($message == "" || $message == null){
                        return $res->withJson(['message' => 'Cannot Post Empty Comments'], 400);
                    }

                    // edit comment
                    $sql = "UPDATE comments SET body = :message 
                    WHERE comment_id = :comment_id";
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam(':message', $message);
                    $stmt->bindParam(':comment_id', $comment_id);
                    $stmt->execute();
    
                    return $res->withJson(['message' => 'Updated Successfully'], 200);
                }
                else{
                    return $res->withJson([
                        'message' => 'You can only edit your own comments.'
                    ], 400);
                }
            }
            else{
                return $res->withJson(['message' => 'This comment does not exist'], 400);
            }

        } catch(PDOException $e){
            return $res->withJson(['message' => $e->getMessage()], 500);
        }

        $res->getBody()->write("HELLO, $curr, $comment_id");
        return $res;
    })->add('authMiddleware');

    // PRIVATE ROUTE: Delete Commment
    $app->put('/remove/{id}[/]', function(Request $req, Response $res){
        $curr = $req->getAttribute('user_id'); // logged in user
        $comment_id = $req->getAttribute('id'); // delete req for this comment

        // echo "Logged In user: ", $curr;

        try{
            $db = Database::getInstance()->getConnection();
            // return the user who created this comment
            $sql = "SELECT user_id from comments
             WHERE comment_id = :comment_id AND deleted = 0"; 
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':comment_id', $comment_id);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if($result){
                $user_id = $result['user_id']; // user who created the comment

                if($user_id === $curr){
                    // delete comment
                    // body: "This comment was deleted."
                    // how to know if this has been deleted?
                    // we need a deleted boolean data type coloumn in Comments.

                    $message = "This comment was deleted.";

                    $sql = "UPDATE comments 
                    SET body = :message, deleted = 1 
                    WHERE comment_id = :comment_id";

                    $stmt = $db->prepare($sql);
                    $stmt->bindParam(':message', $message);
                    $stmt->bindParam(':comment_id', $comment_id);
                    $stmt->execute();

                    return $res->withJson(['message' => 'Deleted Successfully'], 200);
                }
                else{
                    return $res->withJson([
                        'message' => 'You can only delete your own comments.'
                    ], 400);
                }
            }
            else{
                return $res->withJson(['message' => 'This comment does not exist'], 400);
            }

        } catch(PDOException $e){
            return $res->withJson(['message' => $e->getMessage()], 500);
        }
    })->add('AuthMiddleware');

    // testing routes only for development
    $app->get('/{id}[/]', function(Request $req, Response $res){
        $comment_id = $req->getAttribute('id');
        try{
            $db = Database::getInstance()->getConnection();
            $stmt = $db->prepare("SELECT * FROM comments WHERE comment_id = :comment_id");
            $stmt->bindParam(':comment_id', $comment_id);
            $stmt->execute();

            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $res->getBody()->write(json_encode($results));

            return $res->withHeader('content-type', 'application/json');
        } catch(PDOException $e){
            return $res->withJson(['message' => $e->getMessage()], 500);
        }
    });

});

// [
//     {
//         "comment_id": 21,
//         "blog_id": 1,
//         "parent_id": null,
//         "body": "asdasd",
//         "likes": 0,
//         "user_id": 20,
//         "username": "postman",
//         "created_at": "2023-12-21 20:37:57",
//         "deleted": 0
//     }
// ]

// [
//     {
//         "comment_id": 21,
//         "blog_id": 1,
//         "parent_id": null,
//         "body": "This comment was deleted.",
//         "likes": 0,
//         "user_id": 20,
//         "username": "postman",
//         "created_at": "2023-12-21 20:37:57",
//         "deleted": 1
//     }
// ]