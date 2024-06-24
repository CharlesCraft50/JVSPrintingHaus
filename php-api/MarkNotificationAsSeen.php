<?php
	require_once('connect.php');

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
	    if (isset($_POST['notifId']) && !empty($_POST['notifId'])) {
	        // Sanitize the input to prevent SQL injection
	        $notifId = filter_var($_POST['notifId'], FILTER_SANITIZE_NUMBER_INT);

	        $sql = "UPDATE Notifications SET Seen = 1 WHERE NotifId = :notifId";
	        $stmt = $conn->prepare($sql);
	        $stmt->bindParam(':notifId', $notifId, PDO::PARAM_INT);
	        
	        if ($stmt->execute()) {
	            echo json_encode(['status' => 'success', 'message' => 'Notification marked as seen successfully']);
	            exit;
	        } else {
	            echo json_encode(['status' => 'error', 'message' => 'Failed to mark notification as seen']);
	            exit;
	        }
	    } else {
	        echo json_encode(['status' => 'error', 'message' => 'Notification ID is missing']);
	        exit;
	    }
	} else {
	    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
	    exit;
	}
?>