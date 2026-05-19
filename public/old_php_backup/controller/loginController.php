<?php
session_start();
include_once '../repository/userRepository.php';
include_once '../models/user.php';

if(isset($_POST['loginBtn'])){
    if(empty($_POST['email']) || empty($_POST['password'])){
        echo "Fill all fields!";
    }else{
        $email = $_POST['email'];
        $password = $_POST['password'];

        $_SESSION["email"] = $_POST['email'];
        $_SESSION["password"] = $_POST['password'];

        $userRepository = new UserRepository();

        $user  = $userRepository->getUserByEmailAndPassword($email,$password);

        if($user==null){
            $_SESSION['login_error'] = "Invalid Credentials!";
        }elseif($user['role'] === 'admin'){
            $_SESSION["id"] = $user['id'];
            $_SESSION["active"] = 1;
            $_SESSION["role"] = $user['role'];
            $userRepository->updateUser($user['id'],$email,$user['username'],$password,$user['role'],$_SESSION["active"]);
            header("location:/views/accountAdmin.php?id=$user[id]");
        }
        else{
            $_SESSION["id"] = $user['id'];
            $_SESSION["active"] = 1;
            $_SESSION["role"] = $user['role'];
            $userRepository->updateUser($user['id'],$email,$user['username'],$password,$user['role'],$_SESSION["active"]);
            header("location:/views/account.php?id=$user[id]");
        }
    }
}
?>
