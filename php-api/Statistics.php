<?php
    session_start();
    if(!(isset($_SESSION['userLoggedIn']) && $_SESSION['user_id'] === 1)) {
        header('Location: login.html');
        die();
    }
    
    require_once('connect.php');

    $counterFile = 'pageviews.txt';
    $userCounterFile = 'unique_users.txt';

    // Initialize page views counter if not exists
    if (!file_exists($counterFile)) {
        file_put_contents($counterFile, 0);
    }
    $pageViews = (int) file_get_contents($counterFile);

    // Initialize unique users counter if not exists
    if (!file_exists($userCounterFile)) {
        file_put_contents($userCounterFile, 0);
    }
    $uniqueUsers = (int) file_get_contents($userCounterFile);

    // Increment page views counter if this is the user's first visit this session
    if (!isset($_SESSION['page_visited'])) {
        $_SESSION['page_visited'] = true;
        $pageViews++;
        file_put_contents($counterFile, $pageViews);
    }

    // Check if the user is new
    $newUser = false;
    if (!isset($_SESSION['unique_user_id'])) {
        // Generate a unique user ID for the session
        $_SESSION['unique_user_id'] = uniqid();
        $newUser = true;
        $uniqueUsers++;
        file_put_contents($userCounterFile, $uniqueUsers);
    }

    // Get the count of registered users from the database
    $registeredUsersQuery = $conn->query("SELECT COUNT(*) as count FROM Users");
    $registeredUsers = $registeredUsersQuery->fetch(PDO::FETCH_ASSOC)['count'];

    header('Content-Type: application/json');
    echo json_encode([
        "status" => "success",
        "pageViews" => $pageViews,
        "uniqueUsers" => $uniqueUsers,
        "newUser" => $newUser,
        "registeredUsers" => $registeredUsers
    ]);
?>
