<?php

class Cart{
    private $item_id;
    private $user_id;
    private $product_id;
    private $image;
    private $name;
    private $price;

    function __construct($item_id,$user_id,$product_id,$image,$name,$price){
            $this->item_id = $item_id;
            $this->user_id = $user_id;
            $this->product_id = $product_id;
            $this->image = $image;
            $this->name = $name;
            $this->price = $price;
    }

    function getItemId(){
        return $this->item_id;
    }
    function getUserId(){
        return $this->user_id;
    }
    function getProductId(){
        return $this->product_id;
    }
    function getImage(){
        return $this->image;
    }
    function getName(){
        return $this->name;
    }
    function getPrice(){
        return $this->price;
    }
}

?>