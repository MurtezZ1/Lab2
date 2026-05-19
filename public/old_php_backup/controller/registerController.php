<?php
include_once '../repository/userRepository.php';
include_once '../models/user.php';

if(isset($_POST['registerBtn'])){
    if(empty($_POST['email']) || empty($_POST['username']) || empty($_POST['password'])){
        echo "Fill all fields!";
    }else{
        $email = $_POST['email'];
        $username = $_POST['username'];
        $password = $_POST['password'];
        $id = $username.rand(100,999);
        $active = 0;

        $user  = new User($id,$email,$username,$password,$active);
        
        $userRepository = new UserRepository();

        if ($userRepository->isEmailTaken($email)) {
            $_SESSION['login_error'] = "Email is taken!";

        } elseif ($userRepository->isUsernameTaken($username)) {
            // Check if username is taken
            $_SESSION['login_error'] = "Username is taken!";

        } else {
            // If email and username are not taken, insert the user
            $userRepository->insertUser($user);
            $_SESSION['SignUp_success'] = "User Created";
        }
    }
}
?>