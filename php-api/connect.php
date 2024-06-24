<?php
	$servername = "localhost";
	$username = "root";
	$password = "";

	try {
	  $conn = new PDO("mysql:host=$servername;dbname=jvsdb", $username, $password);
	  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch(PDOException $e) {
	  echo "Connection failed: " . $e->getMessage();
	}

	/*
	$servername = "sql206.infinityfree.com";
	$username = "if0_35787118";
	$password = "Q2IS45QYWf3NG";

	try {
	  $conn = new PDO("mysql:host=$servername;dbname=if0_35787118_jvsdb", $username, $password);
	  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch(PDOException $e) {
	  echo "Connection failed: " . $e->getMessage();
	}
	*/
?>