<?php
	session_start();
	require_once('connect.php');

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		if (isset($_SESSION['userLoggedIn'])) {

            $userId = isset($_SESSION['userLoggedIn']) ? $_SESSION['user_id'] : '';
            $response = array();

		    $firstName = $_POST['firstName'];
		    $lastName = $_POST['lastName'];
		    $contactNumber = $_POST['contactNumber'];
		    $sql = "";

		    try {
		    	if(isset($contactNumber)) {
		    		$sql = "UPDATE Users 
		        		SET FirstName = :firstName, LastName = :lastName, ContactNumber = :contactNumber
		        		WHERE UserId = :userId";

	        		$stmt = $conn->prepare($sql);

			        $stmt->bindParam(':firstName', $firstName, PDO::PARAM_STR);
			        $stmt->bindParam(":lastName", $lastName, PDO::PARAM_STR);
		            $stmt->bindParam(":contactNumber", $contactNumber, PDO::PARAM_STR);
			        $stmt->bindValue(":userId", $userId);
		    	} else {
		    		$sql = "UPDATE Users 
		        		SET FirstName = :firstName, LastName = :lastName
		        		WHERE UserId = :userId";

	        		$stmt = $conn->prepare($sql);

			        $stmt->bindParam(':firstName', $firstName, PDO::PARAM_STR);
			        $stmt->bindParam(":lastName", $lastName, PDO::PARAM_STR);
			        $stmt->bindValue(":userId", $userId);
		    	}

		        $stmt->execute();

		        $_SESSION['first_name'] = $firstName;
		        $_SESSION['last_name'] = $lastName;

		        $response = json_encode(["status" => "success", "message" => "User updated!"]);

		    } catch (PDOException $e) {

		        $response = json_encode(["status" => "error", "message" => "Error during updating!"]);
		    }

		    header('Content-Type: application/json');
		    echo $response;

		    $conn = null;
        }
		

	}
?>