<?php
    require_once('connect.php');  // Ensure this file contains the connection code

    $response = array("status" => "Error", "message" => "Invalid request");

    if (isset($_GET['orderId'])) {
        $orderId = $_GET['orderId'];

        $fetchRemarksQuery = "SELECT r.RemarkId, r.RemarkText, r.RemarkDate, ri.ImagePath, rp.ReplyId, rp.UserId, rp.ReplyText, rp.ReplyDate 
                              FROM Remarks AS r 
                              LEFT JOIN RemarkImages AS ri ON r.RemarkId = ri.RemarkId
                              LEFT JOIN Replies AS rp ON r.RemarkId = rp.RemarkId
                              WHERE r.OrderId = :orderId
                              ORDER BY r.RemarkId ASC";

        $stmt = $conn->prepare($fetchRemarksQuery);
        $stmt->bindParam(':orderId', $orderId, PDO::PARAM_INT);

        if ($stmt->execute()) {
            $remarks = [];
            $remarkMap = []; // To track remarks by their text

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $remarkText = $row['RemarkText'];

                if (!isset($remarkMap[$remarkText])) {
                    // Create new remark entry
                    $remarkMap[$remarkText] = [
                        "RemarkId" => $row['RemarkId'],
                        "RemarkText" => $remarkText,
                        "RemarkDate" => $row['RemarkDate'],
                        "Images" => [],
                        "Replies" => []
                    ];

                    // Add image path if available
                    if (!empty($row['ImagePath'])) {
                        $remarkMap[$remarkText]['Images'][] = $row['ImagePath'];
                    }
                }

                // Always add reply if available
                if (!empty($row['ReplyId'])) {
                    $reply = [
                        "ReplyId" => $row['ReplyId'],
                        "UserId" => $row['UserId'],
                        "ReplyText" => $row['ReplyText'],
                        "ReplyDate" => $row['ReplyDate']
                    ];

                    $remarkMap[$remarkText]['Replies'][] = $reply;
                }
            }

            // Convert remark map to indexed array (removing the text keys)
            $remarks = array_values($remarkMap);

            $response = array("status" => "Success", "remarks" => $remarks);
        } else {
            $response = array("status" => "Error", "message" => "Failed to fetch remarks");
        }
    } else {
        $response = array("status" => "Error", "message" => "OrderId not provided");
    }

    header('Content-Type: application/json');
    echo json_encode($response);
?>
