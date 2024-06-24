<?php
	session_start();
	require_once('connect.php');

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$response = array();

	    $orderId = $_POST['orderId'];
	    $status = $_POST['status'];
	    $downPayment = $_POST['downPayment'];
	    $adjustmentPrice = $_POST['adjustmentPrice'];
	    $adjustmentType = $_POST['adjustmentType'];
	    $userId = $_POST['userId'];
	    $referenceKey = $_POST['referenceKey'];

	    try {
	        $sql = "UPDATE Orders 
	        		SET OrderStatus = :status, DownPayment = :downPayment, AdjustmentPrice = :adjustmentPrice, AdjustmentType = :adjustmentType
	        		WHERE OrderId = :orderId";
	        $stmt = $conn->prepare($sql);

	        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
	        $stmt->bindParam(":downPayment", $downPayment, PDO::PARAM_STR);
            $stmt->bindParam(":adjustmentPrice", $adjustmentPrice, PDO::PARAM_STR);
            $stmt->bindParam(":adjustmentType", $adjustmentType, PDO::PARAM_STR);
	        $stmt->bindValue(":orderId", $orderId);

	        $stmt->execute();

	        $title = 'Status Update - ';
	        $notificationMessage = "Your order status has been updated to $status!";
	        $insertNotificationSql = "INSERT INTO Notifications (UserId, Title, Message, ReferenceKey) VALUES (:userId, :title, :message, :referenceKey)";
	        $insertStmt = $conn->prepare($insertNotificationSql);
	        $insertStmt->bindParam(':userId', $userId, PDO::PARAM_INT);
	        $insertStmt->bindParam(':title', $title, PDO::PARAM_STR);
	        $insertStmt->bindParam(':message', $notificationMessage, PDO::PARAM_STR);
	        $insertStmt->bindParam(':referenceKey', $referenceKey, PDO::PARAM_STR);
	        $insertStmt->execute();

	        $response = json_encode(["status" => "success", "message" => "Order updated!"]);

	    } catch (PDOException $e) {
	        $response = json_encode(["status" => "error", "message" => "Error during updating!"]);
	    }

	    header('Content-Type: application/json');
	    echo $response;

	    $conn = null;

	}
?>