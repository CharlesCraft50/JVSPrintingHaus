<?php
    session_start();

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Unauthorized
        exit();
    }

    require_once('connect.php');

    $response = array("status" => "Error", "message" => "Invalid request");

    $userId = $_SESSION['user_id'];

    $sql = "SELECT * FROM Notifications WHERE UserId = :userId ORDER BY CreatedAt DESC";

    try {
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

        $stmt->execute();

        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response = array("status" => "Success", "notifications" => array_values($notifications), "userId" => $userId);

        $conn = null;

        header('Content-Type: application/json');
        echo json_encode($response);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
?>
