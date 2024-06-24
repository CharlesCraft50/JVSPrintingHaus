<?php
session_start();

require_once('connect.php');

// Check if the request is an AJAX request
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
    // Process the form data
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $tShirtImages = json_decode($_POST['tShirtImages']);
		$frontImage = $tShirtImages[0];
		$backImage = $tShirtImages[1];
		$rightImage = $tShirtImages[2];
		$leftImage = $tShirtImages[3];
        $totalDetails = $_POST['totalDetails']; // HTML content of the totalArea div
        $orderDate = date('Y-m-d'); // Current date
        $totalAmount = $_POST['totalAmount'];
        $username = isset($_SESSION['userLoggedIn']) ? $_SESSION['first_name'] . " " . $_SESSION['last_name'] : '';

        $stmt = $conn->prepare("INSERT INTO Orders (FrontImage, BackImage, RightImage, LeftImage, TotalDetails, OrderDate, TotalAmount, Username) 
                               VALUES (:frontImage, :backImage, :rightImage, :leftImage, :totalDetails, :orderDate, :totalAmount, :username)");
        $stmt->bindParam(':frontImage', $frontImage, PDO::PARAM_LOB);
        $stmt->bindParam(':backImage', $backImage, PDO::PARAM_LOB);
        $stmt->bindParam(':rightImage', $rightImage, PDO::PARAM_LOB);
        $stmt->bindParam(':leftImage', $leftImage, PDO::PARAM_LOB);
        $stmt->bindParam(':totalDetails', $totalDetails, PDO::PARAM_STR);
        $stmt->bindParam(':orderDate', $orderDate, PDO::PARAM_STR);
        $stmt->bindParam(':totalAmount', $totalAmount, PDO::PARAM_STR);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);

        if ($stmt->execute()) {
            // Success
            $response = array('status' => 'success', 'message' => 'Order placed successfully');
        } else {
            // Error
            $response = array('status' => 'error', 'message' => 'Failed to place order');
        }

        // Return the response as JSON
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
}
?>
