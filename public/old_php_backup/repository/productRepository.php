<?php 
include_once '../database/databaseConnection.php';

class ProductRepository{
    private $connection;

    function __construct(){
        $conn = new DatabaseConenction;
        $this->connection = $conn->startConnection();
    }

function getProducts(){
        $conn = $this->connection;

        $sql = "SELECT * FROM products";

        $statement = $conn->query($sql);

        $products = $statement->fetchAll();

        return $products;
    }

}
?>