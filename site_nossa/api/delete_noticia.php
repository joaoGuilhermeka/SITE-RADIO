<?php
require_once __DIR__ . '/../admin/auth.php';
require_admin_auth();
require_once '../config.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        throw new Exception("Método não permitido");
    }
    
    $dados = json_decode(file_get_contents('php://input'), true);
    
    if (empty($dados['id'])) {
        throw new Exception("ID da notícia é obrigatório");
    }
    
    $id = (int)$dados['id'];
    
    $sql = "DELETE FROM noticias WHERE id = ?";
    $stmt = $conexao->prepare($sql);
    $stmt->execute([$id]);
    
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Notícia deletada com sucesso',
        'id' => $id
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'sucesso' => false,
        'erro' => $e->getMessage()
    ]);
}
?>
