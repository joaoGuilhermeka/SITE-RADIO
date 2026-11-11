<?php
require_once __DIR__ . '/../admin/auth.php';
require_admin_auth();
include '../config.php';

$dados = json_decode(file_get_contents('php://input'), true);

if (!$dados || !isset($dados['titulo']) || !isset($dados['video_id'])) {
    echo json_encode(['sucesso' => false, 'erro' => 'Dados insuficientes']);
    exit;
}

try {
    $stmt = $conexao->prepare("INSERT INTO top10 (posicao, titulo, artista, video_id, imagem) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $dados['posicao'] ?? 0,
        $dados['titulo'],
        $dados['artista'] ?? '',
        $dados['video_id'],
        $dados['imagem'] ?? ''
    ]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Música adicionada ao Top 10', 'id' => $conexao->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
