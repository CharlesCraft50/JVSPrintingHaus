<?php
    session_start();

    $counterFile = 'pageviews.txt';

    if (!file_exists($counterFile)) {
        file_put_contents($counterFile, 0);
    }

    // Read the current count of page views
    $pageViews = (int) file_get_contents($counterFile);

    // Check if the user has visited the page in this session
    if (!isset($_SESSION['page_visited'])) {
        $_SESSION['page_visited'] = true;

        $pageViews++;

        file_put_contents($counterFile, $pageViews);
    }

    header('Content-Type: application/json');
    echo json_encode(["status" => "success", "message" => $pageViews]);;
?>
