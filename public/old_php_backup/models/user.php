<?php

class User{
    private $id;
    private $email;
    private $username;
    private $password;
    private $role;
    private $active;


    function __construct($id,$email,$username,$password,$active){
            $this->id = $id;
            $this->email = $email;
            $this->username = $username;
            $this->password = $password;
            $this->active = $active;
    }

    function getId(){
        return $this->id;
    }
    function getEmail(){
        return $this->email;
    }
    function getUsername(){
        return $this->username;
    }
    function getPassword(){
        return $this->password;
    }
    function getRole(){
        return $this->role;
    }
    function getActive(){
        return $this->active;
    }
}

?>