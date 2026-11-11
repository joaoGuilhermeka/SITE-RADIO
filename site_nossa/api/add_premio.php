<?php
require_once __DIR__ . '/../admin/auth.php';
require_admin_auth();
include '../config.php';

$dados = json_decode(file_get_contents('php://input'), true);

if (!$dados || !isset($dados['titulo'])) {
    echo json_encode(['sucesso' => false, 'erro' => 'Dados inválidos']);
    exit;
}

try {
    $stmt = $conexao->prepare("INSERT INTO premios (titulo, regras, imagem, imagem_mobile, link, ordem) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $dados['titulo'],
        $dados['regras'] ?? '',
        $dados['imagem'] ?? '',
        $dados['imagem_mobile'] ?? '',
        $dados['link'] ?? '',
        $dados['ordem'] ?? 0
    ]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Prêmio adicionado com sucesso', 'id' => $conexao->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
