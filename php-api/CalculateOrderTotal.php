<?php
session_start();
require_once('connect.php');

if (isset($_SESSION['userLoggedIn']) && $_SESSION['user_id'] === 1) {
    $totalAmount = 0;
    $totalOrders = 0;

    $sql = "SELECT TotalAmount, AdjustmentPrice, AdjustmentType FROM Orders";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($orders as $order) {
        // Retrieve order details
        $totalAmount += floatval($order['TotalAmount']);
        $totalOrders++;

        if ($order['AdjustmentType'] === 'Added') {
            $totalAmount += floatval($order['AdjustmentPrice']);
        } elseif ($order['AdjustmentType'] === 'Subtracted') {
            $totalAmount -= floatval($order['AdjustmentPrice']);
        }
    }

    $conn = null;

    $response = array();
    $response['status'] = 'success';
    $response['message'] = $totalAmount;
    $response['totalOrders'] = $totalOrders;

    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    // Unauthorized access
    $response = array();
    $response['status'] = 'error';
    $response['message'] = 'Unauthorized access!';

    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
