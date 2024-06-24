<?php
    require_once('connect.php');
    $response = array("status" => "Error", "message" => "Invalid request");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_POST["RemarkId"])) {
            $remarkId = $_POST["RemarkId"];

            $stmt = $conn->prepare("DELETE FROM Remarks WHERE RemarkId = :remarkId");
            $stmt->bindParam(':remarkId', $remarkId);

            if ($stmt->execute()) {
                $response = array("status" => "Success", "message" => "Remark deleted successfully");
            } else {
                $response = array("status" => "Error", "message" => "Failed to delete remark");
            }
        } else {
            $response = array("status" => "Error", "message" => "RemarkId is not provided");
        }
    } else {
        $response = array("status" => "Error", "message" => "Invalid request method");
    }

    header('Content-Type: application/json');

    echo json_encode($response);
?>
