<?php
    session_start();

    require_once('connect.php');

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        if (isset($_SESSION['userLoggedIn']) && $_SESSION['user_id'] === 1) {
            try {
                $sql = "SELECT * FROM Notifications ORDER BY CreatedAt DESC";
                $stmt = $conn->prepare($sql);
                $stmt->execute();

                $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode(['status' => 'success', 'data' => $notifications]);
                exit;
            } catch (PDOException $e) {
                echo json_encode(['status' => 'error', 'message' => 'Failed to fetch notifications: ' . $e->getMessage()]);
                exit;
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        exit;
    }
?>
