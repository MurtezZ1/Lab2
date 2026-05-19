<?php
include_once '../repository/userRepository.php';
include_once '../models/user.php';

if (isset($_POST['save-profile-btn'])) {
    if (empty($_POST['email']) || empty($_POST['username']) || empty($_POST['password'])) {
        $_SESSION['login_error'] = "Invalid data";

    } else {
        $email = $_POST['email'];
        $username = $_POST['username'];
        $password = $_POST['password'];
        $user_id = $_POST['id'];
        $role = $_POST['role'];

        $userRepository = new UserRepository();

        $originalUserData = $userRepository->getUserById($user_id); // Assuming it returns an array

        $originalUser = new User(
            $originalUserData['id'],
            $originalUserData['email'],
            $originalUserData['username'],
            $originalUserData['password'],
            $originalUserData['active']
        );

        if ($email !== $originalUser->getEmail() && $userRepository->isEmailTaken($email)) {
            $_SESSION['login_error'] = "Email is taken!";
        } elseif ($username !== $originalUser->getUsername() && $userRepository->isUsernameTaken($username)) {
            // Check if username is taken
            $_SESSION['login_error'] = "Username is taken!";
        } else {
            // Proceed with the update
            if ($role === 'admin') {
                $userRepository->updateUser($user_id, $email, $username, $password, $role, $originalUser->getActive());
                header("location:/views/accountAdmin.php?id=$user_id");
            } elseif ($role === 'user') {
                $userRepository->updateUser($user_id, $email, $username, $password, $role, $originalUser->getActive());
                header("location:/views/account.php?id=$user_id");
            }
            $_SESSION['Update_success'] = "User Updated";
        }
    }
}
?>
