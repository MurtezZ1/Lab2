<?php

    session_start();


        include_once '../repository/productRepository.php';

        $productRepository = new ProductRepository();
        $productData = $productRepository->getProducts();

        header('Content-Type: application/json');

        echo json_encode($productData);    

?>