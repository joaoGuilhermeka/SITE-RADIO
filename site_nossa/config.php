<?php
// ============================================
// CONFIGURAÇÃO PARA AMBIENTE DE TESTE (SQLITE)
// ============================================

$db_path = __DIR__ . '/nossa_sertaneja.db';

try {
    $conexao = new PDO("sqlite:$db_path");
    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexao->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die(json_encode(['erro' => 'Erro ao conectar SQLite: ' . $e->getMessage()]));
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
