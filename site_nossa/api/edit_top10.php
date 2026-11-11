<?php
require_once __DIR__ . '/../admin/auth.php';
require_admin_auth();
include '../config.php';

$dados = json_decode(file_get_contents('php://input'), true);

if (!$dados || !isset($dados['id'])) {
    echo json_encode(['sucesso' => false, 'erro' => 'ID não informado']);
    exit;
}

try {
    $stmt = $conexao->prepare("UPDATE top10 SET posicao = ?, titulo = ?, artista = ?, video_id = ?, imagem = ? WHERE id = ?");
    $stmt->execute([
        $dados['posicao'],
        $dados['titulo'],
        $dados['artista'],
        $dados['video_id'],
        $dados['imagem'],
        $dados['id']
    ]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Top 10 atualizado com sucesso']);
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
