<?php 
include_once '../database/databaseConnection.php';

class CartRepository{
    private $connection;

    function __construct(){
        $conn = new DatabaseConenction;
        $this->connection = $conn->startConnection();
    }

    function addToCart($userId,$productId,$productPrice,$productName,$productImage) {
        $conn = $this->connection;   
       
        $insertQuery = $conn->prepare("INSERT INTO cart_items (cart_id, product_id, image, name, price) VALUES ((SELECT cart_id FROM shopping_cart WHERE user_id = :userId), :productId, :productImage, :productName, :productPrice)");

        $insertQuery->bindParam(':userId', $userId, PDO::PARAM_INT);
        $insertQuery->bindParam(':productId', $productId, PDO::PARAM_INT);
        $insertQuery->bindParam(':productImage', $productImage, PDO::PARAM_STR);
        $insertQuery->bindParam(':productName', $productName, PDO::PARAM_STR);
        $insertQuery->bindParam(':productPrice', $productPrice, PDO::PARAM_STR);

        $insertQuery->execute();
    }

    function addToOrders($userId,$totalAmount) {
        $conn = $this->connection;   
       
        $conn->beginTransaction();

        $cartIdQuery = $conn->prepare("SELECT cart_id FROM shopping_cart WHERE user_id = :userId");
        $cartIdQuery->bindParam(':userId', $userId, PDO::PARAM_INT);
        $cartIdQuery->execute();
        $cartId = $cartIdQuery->fetchColumn();

        $updateCartItemsQuery = $conn->prepare("UPDATE cart_items SET ordered = 1, order_date = NOW() WHERE cart_id = :cartId AND ordered = 0");
        $updateCartItemsQuery->bindParam(':cartId', $cartId, PDO::PARAM_INT);
        $updateCartItemsQuery->execute();

        $insertQuery = $conn->prepare("INSERT INTO orders (cart_id, total_amount) VALUES ((SELECT cart_id FROM shopping_cart WHERE user_id = :userId), :totalAmount)");
        $insertQuery->bindParam(':userId', $userId, PDO::PARAM_INT);
        $insertQuery->bindParam(':totalAmount', $totalAmount, PDO::PARAM_STR);
        $insertQuery->execute();

        $conn->commit();
    }

    function getAllProducts($id){
        $conn = $this->connection;

        $sql = "SELECT cart_items.*, products.* 
        FROM cart_items 
        JOIN products ON cart_items.product_id = products.id 
        WHERE cart_items.cart_id = (SELECT cart_id FROM shopping_cart WHERE user_id = $id);";

        $statement = $conn->query($sql);

        $cart = $statement->fetchAll();

        return $cart;
    }

    function removeCartDataFromDatabase($itemId,$userId) {
        $conn = $this->connection;
    
        try {
            $deleteQuery = $conn->prepare("DELETE FROM cart_items WHERE item_id = :itemId");
            $deleteQuery->bindParam(':itemId', $itemId, PDO::PARAM_INT);
            $deleteQuery->execute();
    
            $rowCount = $deleteQuery->rowCount();
    
            if ($rowCount > 0) {
                $updatedCartData = $this->fetchCartDataFromDatabase($userId);
                echo json_encode($updatedCartData);
            } else {
                echo json_encode([]);
            }
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    function fetchCartDataFromDatabase($userId) {
        $conn = $this->connection;

        $stmt = $conn->prepare("SELECT item_id, cart_id, product_id, image, name, price FROM cart_items WHERE cart_id = (SELECT cart_id FROM shopping_cart WHERE user_id = :userId) AND ordered=0");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();

        $cartData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $cartData;
    }

    function fetchFromOrder($userId) {
        $conn = $this->connection;

        $stmt = $conn->prepare("
            SELECT o.order_id, o.cart_id, o.order_date, o.total_amount, c.price, c.name, c.image, c.product_id
            FROM orders o
            JOIN cart_items c ON o.order_date = c.order_date
            WHERE o.cart_id = (SELECT cart_id FROM shopping_cart WHERE user_id = :userId)
        ");
    
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
    
        $cartData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        return $cartData;
    }
   
    
}
?>