<?php
	require_once('connect.php');

	$targetDir = "../uploads/shirts/";

	$frontImage = isset($_FILES["frontImage"]) ? "frontImage-" . basename($_FILES["frontImage"]["name"]) : "";
	$backImage = isset($_FILES["backImage"]) ? "backImage-" . basename($_FILES["backImage"]["name"]) : "";
	$rightImage = isset($_FILES["rightImage"]) ? "rightImage-" . basename($_FILES["rightImage"]["name"]) : "";
	$leftImage = isset($_FILES["leftImage"]) ? "leftImage-" . basename($_FILES["leftImage"]["name"]) : "";
	$shirtType = isset($_POST["shirtType"]) ? $_POST["shirtType"] : "";
	$shirtColor = isset($_POST["shirtColor"]) ? ucwords($_POST["shirtColor"]) : "";

	// Move uploaded files to the specified directory
	move_uploaded_file($_FILES["frontImage"]["tmp_name"], $targetDir . $frontImage);
	move_uploaded_file($_FILES["backImage"]["tmp_name"], $targetDir . $backImage);
	move_uploaded_file($_FILES["rightImage"]["tmp_name"], $targetDir . $rightImage);
	move_uploaded_file($_FILES["leftImage"]["tmp_name"], $targetDir . $leftImage);

	$sql = 'INSERT INTO Shirts (FrontImage, BackImage, LeftImage, RightImage, ShirtType, ShirtColor) VALUES (:FrontImage, :BackImage, :LeftImage, :RightImage, :ShirtType, :ShirtColor)';
	$stmt = $conn->prepare($sql);
	$stmt->bindValue(':FrontImage', $frontImage, PDO::PARAM_STR);
	$stmt->bindValue(':BackImage', $backImage, PDO::PARAM_STR);
	$stmt->bindValue(':LeftImage', $leftImage, PDO::PARAM_STR);
	$stmt->bindValue(':RightImage', $rightImage, PDO::PARAM_STR);
	$stmt->bindValue(':ShirtType', $shirtType, PDO::PARAM_STR);
	$stmt->bindValue(':ShirtColor', $shirtColor, PDO::PARAM_STR);

	if($stmt->execute()) {
		echo "successfully inserted to database!";
	} else {
		echo "Unkown error occured, please try again!";
	}
?>