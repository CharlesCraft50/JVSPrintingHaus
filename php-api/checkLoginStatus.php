<?php
	session_start();

	$response = array();

	if (isset($_SESSION['userLoggedIn']) && $_SESSION['userLoggedIn'] === true) {
	    $response['status'] = "loggedIn";
	    $response['user_id'] = $_SESSION['user_id'];

	    // Check if the user is an admin (user_id 1)
	    if ($_SESSION['user_id'] == 1) {
	        $response['isAdmin'] = true;
	    } else {
	        $response['isAdmin'] = false;
	    }
	} else {
	    $response['status'] = "notLoggedIn";
	}

	echo json_encode($response);
?>
