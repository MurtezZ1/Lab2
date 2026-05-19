<?php
session_start();

// Retrieve item ID from the request body
$requestBody = file_get_contents('php://input');
$requestData = json_decode($requestBody, true);

$productId = isset($requestData['product_id']) ? $requestData['product_id'] : null;

if (!$productId) {
    echo json_encode(['error' => 'Product ID not provided']);
    exit; // Stop further execution if product ID is not provided
}

include_once '../repository/itemRepository.php';

$itemRepository = new ItemRepository();
$itemData = $itemRepository->getProductById($productId); // Pass the product ID to the function

header('Content-Type: application/json');

if ($itemData) {
    echo json_encode($itemData);
} else {
    echo json_encode(['error' => 'Product not found']);
}
?>