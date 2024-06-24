<?php
    require_once('connect.php');
    $response = array("status" => "Error", "message" => "Invalid request");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_POST["ReplyId"])) {
            $replyId = $_POST["ReplyId"];

            $stmt = $conn->prepare("DELETE FROM Replies WHERE ReplyId = :replyId");
            $stmt->bindParam(':replyId', $replyId);

            if ($stmt->execute()) {
                $response = array("status" => "Success", "message" => "ReplyId deleted successfully");
            } else {
                $response = array("status" => "Error", "message" => "Failed to delete remark");
            }
        } else {
            $response = array("status" => "Error", "message" => "ReplyId is not provided");
        }
    } else {
        $response = array("status" => "Error", "message" => "Invalid request method");
    }

    header('Content-Type: application/json');

    echo json_encode($response);
?>
