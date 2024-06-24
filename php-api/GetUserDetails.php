<?php
    session_start();

    require_once('connect.php');

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        $userId = (isset($_SESSION['user_id'])) ? $_SESSION['user_id'] : '';

        try {
            $stmt = $conn->prepare("SELECT FirstName, LastName, ContactNumber, Address FROM Users WHERE UserId = :userId");

            
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                $response = [
                    'FirstName' => $result['FirstName'],
                    'LastName' => $result['LastName'],
                    'ContactNumber' => $result['ContactNumber'],
                    'Address' => $result['Address']
                ];

                header('Content-Type: application/json');
                echo json_encode($response);
            } else {
                $response = ['error' => 'User not found'];
                header('Content-Type: application/json');
                echo json_encode($response);
            }
        } catch (PDOException $e) {
            echo $e->getMessage();

        }
    }
?>