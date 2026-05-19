<?php
session_start();

include_once '../repository/userRepository.php';
include_once '../models/user.php';

$id = $_POST['id'];

    $userRepository = new UserRepository();

    $userRepository->deleteUser($id);

    $admin_id = $_SESSION['id'];

    header("location:/views/accountAdmin.php?id=$admin_id");

?>
