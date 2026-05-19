<?php

    session_start();
    header('Content-Type: application/json');

    include_once '../repository/cartRepository.php'; 

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SESSION['id'])) {
        $userId = $_SESSION['id'];
        
        $postData = file_get_contents("php://input");
    
        $data = json_decode($postData);
    
        if (isset($data->totalAmount)) {
           
            $totalAmount = $data->totalAmount;

            $cartRepository = new CartRepository();
            $cartData = $cartRepository->addToOrders($userId,$totalAmount); 
            
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Order placed successfully']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing total amount']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
    }

?>