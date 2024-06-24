<?php
session_start();

require_once('connect.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $orderId = $_POST['orderId'];

    try {
        $sql = "SELECT ImageUrl, ImagePrice FROM CustomImages WHERE OrderId = :orderId";

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':orderId', $orderId, PDO::PARAM_INT);

        $stmt->execute();

        $customImages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        header('Content-Type: application/json');
        echo json_encode(["status" => "success", "length" => count($customImages), "data" => $customImages]);
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>
