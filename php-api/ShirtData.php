<?php
    require_once('connect.php');

    $data = $conn->query("SELECT * FROM Shirts")->fetchAll();

    foreach ($data as $row) {
        echo '<input type="radio" class="colorRadio" name="color" id="color' . $row['ShirtId'] . '" data-front="' . $row['FrontImage'] . '" data-back="' . $row['BackImage'] . '" data-right="' . $row['RightImage'] . '" data-left="' . $row['LeftImage'] . '">' .
             '<label for="color' . $row['ShirtId'] . '" class="colorCircle" style="background-image: url(\'uploads/shirts/' . $row['FrontImage'] . '\'); background-position: center;"></label>';
    }
?>