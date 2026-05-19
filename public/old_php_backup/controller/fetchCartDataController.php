<?php

    session_start();

        $userId = $_SESSION['id'];
        include_once '../repository/cartRepository.php';
    
        $cartRepository = new CartRepository();
        $cartData = $cartRepository->fetchCartDataFromDatabase($userId);

        header('Content-Type: application/json');

        echo json_encode($cartData);    
    
?>