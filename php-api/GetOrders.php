<?php
    session_start();

    require_once('connect.php');

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        if (isset($_SESSION['userLoggedIn']) && $_SESSION['user_id'] === 1) {
            // Only allow access if the user is logged in and has user_id equal to 1
            // Handle the GET request to fetch orders
            $orders = array();
            $orderStatusWhere = ($_GET['orderStatus'] != "") ? " WHERE OrderStatus = '" . $_GET['orderStatus'] . "'": "";

            try {
                $sql = "SELECT * FROM Orders" . $orderStatusWhere;
                $result = $conn->query($sql);

                if ($result->rowCount() > 0) {
                    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                        $orders[] = $row;
                    }

                    echo json_encode(array("status" => "success", "data" => $orders));
                } else {
                    echo json_encode(array("status" => "no_orders", "message" => "No orders to display."));
                }

            } catch (Exception $e) {
                echo json_encode(array("status" => "error", "message" => "Error fetching orders: " . $e->getMessage()));
            }

        } else {
            echo json_encode(array("status" => "error", "message" => "Unauthorized access"));
        }
        
    } else {
        echo json_encode(array("status" => "error", "message" => "Invalid request method"));
    }
?>
