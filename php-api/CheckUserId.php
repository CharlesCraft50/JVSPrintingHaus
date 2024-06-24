<?php
    session_start();

    $response = array();

    if (isset($_SESSION['userLoggedIn']) && isset($_SESSION['user_id'])) {
        // User is logged in
        $response['status'] = "success";
        $response['userLoggedIn'] = true;
        $response['user_id'] = $_SESSION['user_id'];

        if ($_SESSION['user_id'] == 1) {
            echo json_encode($response);
            exit();
        } else {
            $response['status'] = "error";
            $response['message'] = "User is not authorized";
        }
    } else {
        $response['status'] = "error";
        $response['message'] = "User is not logged in";
    }

    echo json_encode($response);
?>
