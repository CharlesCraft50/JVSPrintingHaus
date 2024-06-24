<?php
require_once('connect.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = array();

    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    try {
        // Check if email already exists
        $checkEmailSql = "SELECT COUNT(*) FROM Users WHERE Email = :email";
        $checkEmailStmt = $conn->prepare($checkEmailSql);
        $checkEmailStmt->bindParam(':email', $email, PDO::PARAM_STR);
        $checkEmailStmt->execute();
        $emailExists = $checkEmailStmt->fetchColumn();

        if ($emailExists) {
            $response['message'] = "Email already taken";
            $response['status'] = "error";
        } else {
            // Insert the new user
            $sql = "INSERT INTO Users (FirstName, LastName, Email, Password) VALUES (:firstName, :lastName, :email, :password)";
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':firstName', $firstName, PDO::PARAM_STR);
            $stmt->bindParam(':lastName', $lastName, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);

            $stmt->execute();

            $response['message'] = "Registration successful!";
            $response['status'] = "success";
        }
    } catch (PDOException $e) {
        $response['message'] = "Error during registration: " . $e->getMessage();
        $response['status'] = "error";
    }

    echo json_encode($response);

} else {
    echo "Invalid request method";
}
?>
