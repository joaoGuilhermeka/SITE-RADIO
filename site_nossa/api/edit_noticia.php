<?php
require_once __DIR__ . '/../admin/auth.php';
require_admin_auth();
require_once '../config.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
        throw new Exception("Método não permitido");
    }
    
    $dados = json_decode(file_get_contents('php://input'), true);
    
    if (empty($dados['id'])) {
        throw new Exception("ID da notícia é obrigatório");
    }
    
    $id = (int)$dados['id'];
    
    $updates = [];
    $params = [];
    
    if (!empty($dados['titulo'])) {
        $updates[] = "titulo = ?";
        $params[] = $dados['titulo'];
    }
    
    if (!empty($dados['resumo'])) {
        $updates[] = "resumo = ?";
        $params[] = $dados['resumo'];
    }
    
    if (!empty($dados['conteudo'])) {
        $updates[] = "conteudo = ?";
        $params[] = $dados['conteudo'];
    }
    
    if (!empty($dados['categoria'])) {
        $updates[] = "categoria = ?";
        $params[] = $dados['categoria'];
    }
    
    if (isset($dados['imagem'])) {
        $updates[] = "imagem = ?";
        $params[] = $dados['imagem'];
    }
    
    if (!empty($dados['data'])) {
        $updates[] = "data_criacao = ?";
        $params[] = $dados['data'];
    }
    
    if (empty($updates)) {
        throw new Exception("Nenhum campo para atualizar");
    }
    
    $sql = "UPDATE noticias SET " . implode(", ", $updates) . " WHERE id = ?";
    $params[] = $id;
    
    $stmt = $conexao->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Notícia atualizada com sucesso',
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
