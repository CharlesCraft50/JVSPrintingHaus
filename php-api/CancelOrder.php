<?php
	session_start();
	require_once('connect.php');

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$response = array();

	    $orderId = $_POST['orderId'];

	    try {
	        $sql = "UPDATE Orders 
	        		SET OrderStatus = 'Cancelled'
	        		WHERE OrderId = :orderId";
	        $stmt = $conn->prepare($sql);

	        $stmt->bindValue(":orderId", $orderId);

	        $stmt->execute();

	        $response = json_encode(["status" => "success", "message" => "Order Cancelled!"]);

	    } catch (PDOException $e) {
	        $response = json_encode(["status" => "error", "message" => "Error Cancelling!"]);
	    }

	    header('Content-Type: application/json');
	    echo $response;

	    $conn = null;

	}
?>