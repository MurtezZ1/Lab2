<?php
session_start();

include_once '../repository/userRepository.php';
include_once '../models/user.php';

$id = $_SESSION['edit_id'];

if(isset($_POST['editBtn'])){
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $role = $_POST['role'];
    $active = 0;

    $userRepository = new UserRepository();

    $userRepository->updateUser($id,$email,$username,$password,$role,$active);

    $admin_id = $_SESSION['id'];

    header("location:/views/accountAdmin.php?id=$admin_id");
}

?>
