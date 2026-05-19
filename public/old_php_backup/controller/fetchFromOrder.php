<?php

    session_start();

        $userId = $_SESSION['id'];
        include_once '../repository/cartRepository.php';
    
        $cartRepository = new CartRepository();
        $cartData = $cartRepository->fetchFromOrder($userId);

        header('Content-Type: application/json');

        echo json_encode($cartData);    
    
?>