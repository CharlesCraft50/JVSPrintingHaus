<?php
	session_start();
	require_once('connect.php');

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		if (isset($_SESSION['userLoggedIn'])) {
            $userId = isset($_SESSION['userLoggedIn']) ? $_SESSION['user_id'] : '';
            $response = array();

		    $addressData = json_decode(file_get_contents("php://input"), true);

		    try {
				$sql = "UPDATE Users 
				        SET Address = :address
				        WHERE UserId = :userId";

				$stmt = $conn->prepare($sql);

				$encodedAddressData = json_encode($addressData);
				$stmt->bindParam(':address', $encodedAddressData, PDO::PARAM_STR);
				$stmt->bindValue(":userId", $userId);

				$stmt->execute();

		        $response = json_encode(["status" => "success", "message" => "Address updated!"]);

		    } catch (PDOException $e) {
		        $response = json_encode(["status" => "error", "message" => "Error during updating address!"]);
		    }

		    header('Content-Type: application/json');
		    echo $response;

		    $conn = null;
        }
	}
?>
