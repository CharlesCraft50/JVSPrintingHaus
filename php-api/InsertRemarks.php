<?php
    require_once('connect.php');

    $response = array("status" => "Error", "message" => "Invalid request");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_POST["orderId"])) {
            $orderId = $_POST["orderId"];

            $remarksText = isset($_POST["remarksText"]) ? $_POST["remarksText"] : "";
            $userId = $_POST['userId'];
            $referenceKey = $_POST['referenceKey'];

            $stmt = $conn->prepare("INSERT INTO Remarks (OrderId, RemarkText) VALUES (:orderId, :remarksText)");
            $stmt->bindParam(':orderId', $orderId);
            $stmt->bindParam(':remarksText', $remarksText);

            if ($stmt->execute()) {
                $remarkId = $conn->lastInsertId();
                $response = array("status" => "Success", "message" => "Remark inserted successfully", "RemarkId" => $remarkId, "ImageFileNames" => []);

                // Proceed with inserting images
                $customRemarksImages = isset($_POST["customRemarksImages"]) ? json_decode($_POST["customRemarksImages"], true) : [];
                if (!empty($customRemarksImages)) {
                    $imageFileNames = [];
                    foreach ($customRemarksImages as $index => $customImage) {
                        $base64Data = isset($customImage['base64']) ? $customImage['base64'] : '';
                        $imagePrice = isset($customImage['price']) ? $customImage['price'] : '';

                        if (!empty($base64Data)) {
                            $imageData = base64_decode($base64Data);
                            if ($imageData !== false) {
                                $fileName = '../uploads/remarksImages/customImage_' . $index . '_' . uniqid() . '.png';
                                $filenameReplaced = str_replace('../', '', $fileName);

                                if (file_put_contents($fileName, $imageData) !== false) {
                                    $stmt = $conn->prepare("INSERT INTO RemarkImages (RemarkId, ImagePath) VALUES (:remarkId, :imagePath)");
                                    $stmt->bindParam(':remarkId', $remarkId);
                                    $stmt->bindParam(':imagePath', $filenameReplaced);

                                    if ($stmt->execute()) {
                                        $imageFileNames[] = str_replace('../', '', $fileName);
                                        $response = array("status" => "Success", "message" => "Image inserted successfully", "RemarkId" => $remarkId, "ImageFileNames" => $imageFileNames);
                                    } else {
                                        $response = array("status" => "Error", "message" => "Failed to insert image into database");
                                    }
                                } else {
                                    $response = array("status" => "Error", "message" => "Failed to save image to disk");
                                }
                            } else {
                                $response = array("status" => "Error", "message" => "Failed to decode image data");
                            }
                        }
                    }
                }

                // Insert a notification
                $title = 'New Remarks - ';
                $notificationMessage = "$remarksText";
                $insertNotificationSql = "INSERT INTO Notifications (UserId, Title, Message, ReferenceKey) VALUES (:userId, :title, :message, :referenceKey)";
                $insertStmt = $conn->prepare($insertNotificationSql);
                $insertStmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                $insertStmt->bindParam(':title', $title, PDO::PARAM_STR);
                $insertStmt->bindParam(':message', $notificationMessage, PDO::PARAM_STR);
                $insertStmt->bindParam(':referenceKey', $referenceKey, PDO::PARAM_STR);
                $insertStmt->execute();

                } else {
                    $response = array("status" => "Error", "message" => "Failed to insert remark");
                }

                if ($response["status"] === "Success") {
                    $response["message"] = "Remark and/or images inserted successfully";
                }
        } else {
            $response = array("status" => "Error", "message" => "orderId is not provided");
        }
    } else {
        $response = array("status" => "Error", "message" => "Invalid request method");
    }

    header('Content-Type: application/json');
    echo json_encode($response);
?>