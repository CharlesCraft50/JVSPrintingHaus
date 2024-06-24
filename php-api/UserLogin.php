<?php
    session_start();

    require_once('connect.php');

    try {
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $email = $_POST['email'];
        $password = $_POST['password'];

        $sql = "SELECT * FROM Users WHERE Email = :email";
        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':email', $email, PDO::PARAM_STR);

        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            if (password_verify($password, $user['Password'])) {
                $_SESSION['userLoggedIn'] = true;
                $_SESSION['user_id'] = $user['UserId'];
                $_SESSION['first_name'] = $user['FirstName'];
                $_SESSION['last_name'] = $user['LastName'];

                echo json_encode(array("message" => "Login successful. Welcome, " . $user['FirstName'] . " " . $user['LastName'], "status" => "success"));
            } else {
                echo json_encode(array("message" => "Wrong email or password!", "status" => "error"));
            }
        } else {
            echo json_encode(array("message" => "Wrong email or password!", "status" => "error"));
        }
    } catch (PDOException $e) {
        echo json_encode(array("message" => "Error: " . $e->getMessage(), "status" => "error"));
    }

$pdo = null;
?>
