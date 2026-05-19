<?php 
include_once '../database/databaseConnection.php';

class ItemRepository{
    private $connection;

    function __construct(){
        $conn = new DatabaseConenction;
        $this->connection = $conn->startConnection();
    }


function getProductById($productId){
    $conn = $this->connection;

    $sql = "SELECT * FROM products WHERE id = $productId";

    $statement = $conn->query($sql);

    $item = $statement->fetch(); // Assuming there is only one product with the given ID

    return $item;
}
}
?>