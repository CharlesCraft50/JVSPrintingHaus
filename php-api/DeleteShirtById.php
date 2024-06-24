<?php
    require_once('connect.php');  // Ensure this file contains the connection code

    $response = array("status" => "Error", "message" => "Invalid request");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_POST["ShirtId"])) {
            $shirtId = $_POST["ShirtId"];

            // Prepare statement to fetch file paths before deleting the record
            $fetchStmt = $conn->prepare("SELECT FrontImage, BackImage, RightImage, LeftImage FROM Shirts WHERE ShirtId = :shirtId");
            $fetchStmt->bindParam(':shirtId', $shirtId);
            $fetchStmt->execute();
            $images = $fetchStmt->fetch(PDO::FETCH_ASSOC);

            if ($images) {
                // Base directory for image paths
                $baseDir = '../uploads/shirts/';

                // Delete images from the filesystem
                foreach ($images as $image) {
                    $filePath = $baseDir . $image;
                    if (file_exists($filePath)) {
                        unlink($filePath);  // Deletes the file
                    }
                }

                // Prepare statement to delete the record
                $stmt = $conn->prepare("DELETE FROM Shirts WHERE ShirtId = :shirtId");
                $stmt->bindParam(':shirtId', $shirtId);

                if ($stmt->execute()) {
                    $response = array("status" => "Success", "message" => "Deleted successfully!");
                } else {
                    $response = array("status" => "Error", "message" => "Failed to delete!");
                }
            } else {
                $response = array("status" => "Error", "message" => "Shirt not found!");
            }
        } else {
            $response = array("status" => "Error", "message" => "Please provide a Shirt ID!");
        }
    } else {
        $response = array("status" => "Error", "message" => "Invalid request method");
    }

    header('Content-Type: application/json');
    echo json_encode($response);
?>
