<?php
    session_start();

    require_once('connect.php');

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $tShirtImages = json_decode($_POST["tShirtImages"]);
        $customImages = isset($_POST["customImages"]) ? json_decode($_POST["customImages"], true) : [];
        $totalDetails = $_POST["totalDetails"];
        $totalAmount = $_POST["totalAmount"];
        $clothType = $_POST["clothType"];
        $downPayment = $_POST["downPayment"];
        $customImageCount = $_POST["customImageCount"];

        $orderDate = date("Y-m-d H:i:s");
        $username = isset($_SESSION['userLoggedIn']) ? $_SESSION['first_name'] . " " . $_SESSION['last_name'] : '';
        $userId = $_SESSION['user_id'];
        $orderStatus = "Pending";
        $adjustmentPrice = 0.0;
        $adjustmentType = "Added";
        $referenceKey = uniqid('ORDER_', true);
        $address = $_POST['address'];
        $contactNumber = $_POST['contactNumber'];

        $shirtImageDirectory = "../uploads/shirtImages/";
        $customImageDirectory = "../uploads/customImages/";

        $uploadedTShirtImages = [];

        foreach ($tShirtImages as $index => $base64Data) {
            $imageData = base64_decode($base64Data);
            $fileName = $shirtImageDirectory . "tShirtImage" . $index . "_" . uniqid() . ".png";
            file_put_contents($fileName, $imageData);
            $uploadedTShirtImages[] = str_replace('../', '', $fileName);
        }

        $uploadedCustomImages = [];

        if ($customImageCount > 0) {
            foreach ($customImages as $index => $customImage) {
                $base64Data = $customImage['base64'];
                $imagePrice = $customImage['price'];

                $imageData = base64_decode($base64Data);
                $fileName = $customImageDirectory . "customImage" . $index . "_" . uniqid() . ".png";
                file_put_contents($fileName, $imageData);
                $uploadedCustomImages[] = ['url' => str_replace('../', '', $fileName), 'price' => $imagePrice];
            }
        }

        $insertOrderQuery = "INSERT INTO Orders (FrontImageUrl, BackImageUrl, RightImageUrl, LeftImageUrl, TotalDetails, OrderDate, TotalAmount, UserId, OrderStatus, DownPayment, AdjustmentPrice, AdjustmentType, CustomImageCount, ClothType, ReferenceKey, Address, ContactNumber)
                             VALUES (:frontImageUrl, :backImageUrl, :rightImageUrl, :leftImageUrl, :totalDetails, :orderDate, :totalAmount, :userId, :orderStatus, :downPayment, :adjustmentPrice, :adjustmentType, :customImageCount, :clothType, :referenceKey, :address, :contactNumber)";

        $selectUserDetails = "SELECT FirstName, LastName, ContactNumber FROM Users WHERE UserId = :userId";

        $insertNotificationSql = "INSERT INTO Notifications (UserId, Title, Message, ReferenceKey) VALUES (:userId, :title, :message, :referenceKey)";

        $inserRemarksSql = "INSERT INTO Remarks (OrderId, RemarkText) VALUES (:orderId, :remarksText)";

        $remarksText = "Thank you for your purchase!\nIf you have any concerns or problems, please reply to this comment or contact our customer service.\nBest regards, JVS Printing Haus\n\nGCash Payment: 09498831039\n\nPlease provide your reference number in the comments after making your payment.";

        try {
            $conn->beginTransaction();

            $stmt = $conn->prepare($insertOrderQuery);
            $stmt->bindValue(":frontImageUrl", $uploadedTShirtImages[0] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(":backImageUrl", $uploadedTShirtImages[1] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(":rightImageUrl", $uploadedTShirtImages[2] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(":leftImageUrl", $uploadedTShirtImages[3] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(":totalDetails", $totalDetails, PDO::PARAM_STR);
            $stmt->bindValue(":orderDate", $orderDate, PDO::PARAM_STR);
            $stmt->bindValue(":totalAmount", $totalAmount, PDO::PARAM_STR);
            $stmt->bindValue(":userId", $userId, PDO::PARAM_INT);
            $stmt->bindValue(":orderStatus", $orderStatus, PDO::PARAM_STR);
            $stmt->bindValue(":downPayment", $downPayment, PDO::PARAM_STR);
            $stmt->bindValue(":adjustmentPrice", $adjustmentPrice, PDO::PARAM_STR);
            $stmt->bindValue(":adjustmentType", $adjustmentType, PDO::PARAM_STR);
            $stmt->bindValue(":customImageCount", $customImageCount, PDO::PARAM_INT);
            $stmt->bindValue(":clothType", $clothType, PDO::PARAM_STR);
            $stmt->bindValue(':referenceKey', $referenceKey, PDO::PARAM_STR);
            $stmt->bindValue(':address', $address, PDO::PARAM_STR);
            $stmt->bindValue(':contactNumber', $contactNumber, PDO::PARAM_STR);
            $stmt->execute();

            $orderId = $conn->lastInsertId();

            if ($customImageCount > 0) {
                $insertCustomImagesQuery = "INSERT INTO CustomImages (OrderId, ImageUrl, ImagePrice) VALUES (:orderId, :imageUrl, :imagePrice)";
                $stmt = $conn->prepare($insertCustomImagesQuery);

                foreach ($uploadedCustomImages as $customImage) {
                    $stmt->bindValue(":orderId", $orderId);
                    $stmt->bindValue(":imageUrl", $customImage['url']);
                    $stmt->bindValue(":imagePrice", $customImage['price']);
                    $stmt->execute();
                }
            }

            $stmt = $conn->prepare($selectUserDetails);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $userIdAdmin = 1;
            
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                // Insert a notification
                $title = 'New Order - ';
                $notificationMessage = $result['FirstName'] . " - " . $referenceKey;
                
                $stmt = $conn->prepare($insertNotificationSql);
                $stmt->bindParam(':userId', $userIdAdmin, PDO::PARAM_INT);
                $stmt->bindParam(':title', $title, PDO::PARAM_STR);
                $stmt->bindParam(':message', $notificationMessage, PDO::PARAM_STR);
                $stmt->bindParam(':referenceKey', $referenceKey, PDO::PARAM_STR);
                $stmt->execute();

                $stmt = $conn->prepare($inserRemarksSql);
                $stmt->bindParam(':orderId', $orderId);
                $stmt->bindParam(':remarksText', $remarksText);

                $stmt->execute();
            }

            $conn->commit();

            header('Content-Type: application/json');
            echo json_encode(["status" => "success", "message" => "Order successfully inserted!"]);
        } catch (Exception $e) {
            $conn->rollBack();
            header('Content-Type: application/json');
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }

        $conn = null;
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid request method!"]);
    }
?>
