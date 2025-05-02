<?php
header("Access-Control-Allow-Origin: *"); // Allow access from any origin
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Database connection
$pdo = new PDO("mysql:host=localhost;dbname=game_store", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Logging function
function logActivity($message) {
    $logFile = 'auth_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "$timestamp: $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// Get request data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['action'])) {
    $response = ["success" => false, "message" => "Invalid action"];
    logActivity("Invalid action received");
    echo json_encode($response);
    exit;
}

$action = $data['action'];
logActivity("Request received");
logActivity("Request data: " . json_encode($data));

if ($action === "register") {
    $fullName = $data['fullName'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $confirmPassword = $data['confirmPassword'] ?? '';

    // Validate inputs
    if (!$fullName || !$email || !$password || !$confirmPassword) {
        $response = ["success" => false, "message" => "Please fill all fields"];
        logActivity("Registration failed: Please fill all fields");
        echo json_encode($response);
        exit;
    }

    if ($password !== $confirmPassword) {
        $response = ["success" => false, "message" => "Passwords do not match"];
        logActivity("Registration failed: Passwords do not match");
        echo json_encode($response);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        $response = ["success" => false, "message" => "Email already exists"];
        logActivity("Registration failed: Email already exists - $email");
        echo json_encode($response);
        exit;
    }

    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO users (fullName, email, username, password) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$fullName, $email, $email, $hashedPassword])) {
        $response = ["success" => true, "message" => "Registration successful"];
        logActivity("Registration successful for: $email");
        echo json_encode($response);
    } else {
        $response = ["success" => false, "message" => "Registration failed"];
        logActivity("Registration failed for: $email");
        echo json_encode($response);
    }
}

if ($action === "login") {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    // Validate inputs
    if (!$email || !$password) {
        $response = ["success" => false, "message" => "Please fill all fields"];
        logActivity("Login failed: Please fill all fields");
        echo json_encode($response);
        exit;
    }

    // Fetch user from database
    $stmt = $pdo->prepare("SELECT id, fullName, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify password
    if (!$user || !password_verify($password, $user['password'])) {
        $response = ["success" => false, "message" => "Invalid credentials"];
        logActivity("Login failed: Invalid credentials for $email");
        echo json_encode($response);
        exit;
    }

    // Generate a simple token (for demonstration purposes)
    $token = hash('sha256', uniqid() . $user['id']);

    // Return success response with user data
    $response = [
        "success" => true,
        "message" => "Login successful",
        "data" => [
            "id" => $user['id'],
            "fullName" => $user['fullName'],
            "email" => $user['email'],
            "username" => $user['email'], // Use email as username
            "token" => $token
        ]
    ];
    logActivity("Login successful for: $email");
    echo json_encode($response);
}
?>