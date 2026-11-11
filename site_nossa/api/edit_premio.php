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
    $stmt = $conexao->prepare("UPDATE premios SET titulo = ?, regras = ?, imagem = ?, imagem_mobile = ?, link = ?, ordem = ? WHERE id = ?");
    $stmt->execute([
        $dados['titulo'],
        $dados['regras'] ?? '',
        $dados['imagem'],
        $dados['imagem_mobile'] ?? '',
        $dados['link'],
        $dados['ordem'],
        $dados['id']
    ]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Prêmio atualizado com sucesso']);
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
