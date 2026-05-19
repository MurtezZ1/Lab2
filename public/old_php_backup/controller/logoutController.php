<?php
include_once '../repository/userRepository.php';
include_once '../models/user.php';

if(isset($_POST['logout-profile-btn'])){
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $id = $_POST['id'];
    $role = $_POST['role'];
    $active = 0;

    $userRepository = new UserRepository();

    $userRepository->updateUser($id,$email,$username,$password,$role,$active);

    header("location:/views/index.php");
}

?>
