<?php
    session_start();
    require_once('connect.php');

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_SESSION['userLoggedIn'])) {
            $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : '';
            $response = array();

            $contactNumber = $_POST['contactNumber'];

            try {
                $sql = "UPDATE Users 
                        SET ContactNumber = :contactNumber
                        WHERE UserId = :userId";

                $stmt = $conn->prepare($sql);

                $stmt->bindParam(':contactNumber', $contactNumber, PDO::PARAM_STR);
                $stmt->bindValue(":userId", $userId);

                $stmt->execute();

                $response = json_encode(["status" => "success", "message" => "Contact number updated!"]);

            } catch (PDOException $e) {
                $response = json_encode(["status" => "error", "message" => "Error during updating contact number!"]);
            }

            header('Content-Type: application/json');
            echo $response;

            $conn = null;
        } else {
            $response = json_encode(["status" => "error", "message" => "User not logged in!"]);
            header('Content-Type: application/json');
            echo $response;
        }
    } else {
        $response = json_encode(["status" => "error", "message" => "Invalid request method!"]);
        header('Content-Type: application/json');
        echo $response;
    }
?>
