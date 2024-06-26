<?php
    session_start();

    require_once('connect.php');

    $response = array("status" => "Error", "message" => "Invalid request");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_POST["remarkId"])) {
            $remarkId = $_POST["remarkId"];
            $replyText = isset($_POST["replyText"]) ? $_POST["replyText"] : "";
            $userId = $_SESSION['user_id'];

            $userIdNotif = $_POST['userId'];
            
            
            $referenceKey = $_POST['referenceKey'];

            $stmt = $conn->prepare("INSERT INTO Replies (RemarkId, UserId, ReplyText) VALUES (:remarkId, :userId, :replyText)");
            $stmt->bindParam(':remarkId', $remarkId);
            $stmt->bindParam(':userId', $userId);
            $stmt->bindParam(':replyText', $replyText);

            if ($stmt->execute()) {
                $replyId = $conn->lastInsertId();
                $response = array("status" => "Success", "message" => "Reply inserted successfully", "UserId" => $userId, "LastInsertedId" => $replyId);

                // Insert a notification
                $title = 'New Reply - ';
                $notificationMessage = "$replyText";
                $insertNotificationSql = "INSERT INTO Notifications (UserId, Title, Message, ReferenceKey) VALUES (:userIdNotif, :title, :message, :referenceKey)";
                $insertStmt = $conn->prepare($insertNotificationSql);
                $insertStmt->bindParam(':userIdNotif', $userIdNotif, PDO::PARAM_INT);
                $insertStmt->bindParam(':title', $title, PDO::PARAM_STR);
                $insertStmt->bindParam(':message', $notificationMessage, PDO::PARAM_STR);
                $insertStmt->bindParam(':referenceKey', $referenceKey, PDO::PARAM_STR);
                $insertStmt->execute();

            } else {
                $response = array("status" => "Error", "message" => "Failed to insert remark");
            }

        } else {
            $response = array("status" => "Error", "message" => "remarkId is not provided");
        }
    } else {
        $response = array("status" => "Error", "message" => "Invalid request method");
    }

    header('Content-Type: application/json');
    echo json_encode($response);
?>