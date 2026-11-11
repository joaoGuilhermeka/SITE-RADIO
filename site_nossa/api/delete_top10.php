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
    $stmt = $conexao->prepare("DELETE FROM top10 WHERE id = ?");
    $stmt->execute([$dados['id']]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Música removida do Top 10']);
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
