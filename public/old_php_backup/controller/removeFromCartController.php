<?php

    session_start();

        $userId = $_SESSION['id'];
        $itemId = $_GET['productId'];
        include_once '../repository/cartRepository.php';
    
        $cartRepository = new CartRepository();
        $cartData = $cartRepository->removeCartDataFromDatabase($itemId,$userId);

        header('Content-Type: application/json');
    
?>