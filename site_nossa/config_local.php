<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'php_user');
define('DB_PASS', 'php_pass');
define('DB_NAME', 'nossa_sertaneja_noticias');

try {
    $conexao = @new mysqli('localhost', DB_USER, DB_PASS, DB_NAME);
    
    if ($conexao->connect_error) {
        $conexao = @new mysqli('127.0.0.1', DB_USER, DB_PASS, DB_NAME);
    }
    
    if ($conexao->connect_error) {
        die(json_encode(['erro' => 'Erro na conexão: ' . $conexao->connect_error]));
    }
    
    $conexao->set_charset("utf8mb4");
    
} catch (Exception $e) {
    die(json_encode(['erro' => 'Erro ao conectar: ' . $e->getMessage()]));
}
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
