<?php 
include_once '../database/databaseConnection.php';

class UserRepository{
    private $connection;

    function __construct(){
        $conn = new DatabaseConenction;
        $this->connection = $conn->startConnection();
    }


    function insertUser($user){

        $conn = $this->connection;

        $id = $user->getId();
        $email = $user->getEmail();
        $username = $user->getUsername();
        $password = $user->getPassword();

        $sql = "INSERT INTO users (id,email,username,password) VALUES (?,?,?,?)";
        $statement = $conn->prepare($sql);
        $statement->execute([$id,$email,$username,$password]);

        $userId = $conn->lastInsertId();
     
        $sqlInsertShoppingCart = "INSERT INTO shopping_cart (user_id) VALUES (?)";
        $statementInsertShoppingCart = $conn->prepare($sqlInsertShoppingCart);
        $statementInsertShoppingCart->execute([$userId]);
    }

    function getAllUsers(){
        $conn = $this->connection;

        $sql = "SELECT * FROM users";

        $statement = $conn->query($sql);
        $users = $statement->fetchAll();

        return $users;
    }

    function getUserById($id){
        $conn = $this->connection;

        $sql = "SELECT * FROM users WHERE id='$id'";

        $statement = $conn->query($sql);
        $user = $statement->fetch(PDO::FETCH_ASSOC);

        return $user;
    }

    function getUserByEmailAndPassword($email,$password){
        $conn = $this->connection;

        $sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";

        $statement = $conn->query($sql);
        
        if ($statement->execute()) {
            $user = $statement->fetch(PDO::FETCH_ASSOC);
    
            if ($user==null) {
                return null;
            } else {
                return $user;
            }
        } else {
            return null;
        }
    }

    function updateUser($id,$email,$username,$password,$role,$active){
         $conn = $this->connection;

         $sql = "UPDATE users SET email=?, username=?, password=?, role=?, active=? WHERE id=?";

         $statement = $conn->prepare($sql);

         $statement->execute([$email,$username,$password,$role,$active,$id]);
    } 

    function deleteUser($id){
        $conn = $this->connection;

        $sql1 = "DELETE FROM orders WHERE cart_id = (SELECT cart_id FROM shopping_cart WHERE user_id=?)";
        $statement1 = $conn->prepare($sql1);
        $statement1->execute([$id]);

        $sql2 = "DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM shopping_cart WHERE user_id=?)";
        $statement2 = $conn->prepare($sql2);
        $statement2->execute([$id]);

        $sql3 = "DELETE FROM shopping_cart WHERE user_id = ?";
        $statement3 = $conn->prepare($sql3);
        $statement3->execute([$id]);

        $sql4 = "DELETE FROM users WHERE id=?";
        $statement4 = $conn->prepare($sql4);
        $statement4->execute([$id]);
    } 

    public function isEmailTaken($email) {
        $query = "SELECT COUNT(*) as count FROM users WHERE email = :email";
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result['count'] > 0;
    }
    public function isUsernameTaken($username) {
        $query = "SELECT COUNT(*) as count FROM users WHERE username = :username";
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result['count'] > 0;
    }
}
?>