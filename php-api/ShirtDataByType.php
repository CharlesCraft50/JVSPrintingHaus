<?php
    require_once('connect.php');

    $html2 = '';

    $shirtType = isset($_GET["shirtType"]) ? $_GET["shirtType"] : "color";
    $stmt = $conn->prepare("SELECT * FROM Shirts WHERE ShirtType = :shirtType");
    $stmt->bindParam(':shirtType', $shirtType);
    $stmt->execute();

    $response = array(); // Initialize an array to hold responses

    if ($stmt->rowCount() > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if($row['ShirtType'] == 'color') {
                // Construct the HTML for color type
                $html = '<input type="radio" class="colorRadio" name="color" id="color' . $row['ShirtId'] . '" data-front="' . $row['FrontImage'] . '" data-back="' . $row['BackImage'] . '" data-right="' . $row['RightImage'] . '" data-left="' . $row['LeftImage'] . '" data-shirtcolor="' . $row['ShirtColor'] . '" value="' . $row['ShirtId'] . '">' .
                        '<label for="color' . $row['ShirtId'] . '" class="colorCircle" style="background-image: url(\'uploads/shirts/' . $row['FrontImage'] . '\'); background-position: center;"></label>';
            } else if($row['ShirtType'] == 'design') {
                // Construct the HTML for design type
                $html = '<input type="radio" class="colorRadio" name="color" id="color' . $row['ShirtId'] . '" data-front="' . $row['FrontImage'] . '" data-back="' . $row['BackImage'] . '" data-right="' . $row['RightImage'] . '" data-left="' . $row['LeftImage'] . '" data-shirtcolor="' . $row['ShirtColor'] . '" value="' . $row['ShirtId'] . '">' .
                        '<label for="color' . $row['ShirtId'] . '" class="colorSquare" style="background-image: url(\'uploads/shirts/' . $row['FrontImage'] . '\'); background-position: center;"></label>';

                $html2 = '<div class="product" data-shirt="' . $row['ShirtId'] . '">
                    <img src="uploads/shirts/' . $row['FrontImage'] . '">
                </div>';
            }

            // Add shirt color name to the response array
            $response[] = array(
                'message' => $html,
                'message2' => $html2
            );
        }
    }

    // Output the JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
?>