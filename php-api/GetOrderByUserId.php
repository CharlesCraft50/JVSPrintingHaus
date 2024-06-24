<?php
    session_start();

    require_once('connect.php');

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        if (isset($_SESSION['userLoggedIn'])) {

            $userId = isset($_SESSION['userLoggedIn']) ? $_SESSION['user_id'] : '';
            $orders = array();
            $orderStatusWhere = ($_GET['orderStatus'] != "") ? " AND OrderStatus = '" . $_GET['orderStatus'] . "'": "";

            try {
                $sql = "SELECT * FROM Orders WHERE UserId = :userId AND NOT OrderStatus = 'Deleted'" . $orderStatusWhere;
                $stmt = $conn->prepare($sql);
                $stmt->bindValue(":userId", $userId);
                $stmt->execute();

                if ($stmt->rowCount() > 0) {
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $orders[] = $row;
                    }

                    echo json_encode(array("status" => "success", "data" => $orders, "first_name" => $_SESSION['first_name'], "last_name" => $_SESSION['last_name']));
                } else {
                    echo json_encode(array("status" => "no_orders", "message" => "No orders to display.", "first_name" => $_SESSION['first_name'], "last_name" => $_SESSION['last_name']));
                }

            } catch (Exception $e) {
                echo json_encode(array("status" => "error", "message" => "Error fetching orders: " . $e->getMessage(), "first_name" => $_SESSION['first_name'], "last_name" => $_SESSION['last_name']));
            }

        } else {
            echo json_encode(array("status" => "error", "message" => "Unauthorized access", "first_name" => $_SESSION['first_name'], "last_name" => $_SESSION['last_name']));
        }

    } else {
        echo json_encode(array("status" => "error", "message" => "Invalid request method", "first_name" => $_SESSION['first_name'], "last_name" => $_SESSION['last_name']));
    }
?>
