<?php
require_once __DIR__ . '/../admin/auth.php';
require_admin_auth();
require_once '../config.php';

// Definir fuso horário para o Brasil
date_default_timezone_set('America/Sao_Paulo');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método não permitido");
    }
    
    $dados = json_decode(file_get_contents('php://input'), true);
    
    if (empty($dados['titulo']) || empty($dados['resumo']) || empty($dados['categoria'])) {
        throw new Exception("Campos obrigatórios faltando: titulo, resumo, categoria");
    }
    
    $titulo = $dados['titulo'];
    $resumo = $dados['resumo'];
    $conteudo = $dados['conteudo'] ?? $dados['resumo'];
    $categoria = $dados['categoria'];
    $imagem = $dados['imagem'] ?? '';
    
    // Se o usuário escolheu uma data, usa ela. Se não, usa a data e hora ATUAL.
    if (isset($dados['data']) && !empty($dados['data'])) {
        // Se for apenas YYYY-MM-DD, adiciona a hora atual
        if (strlen($dados['data']) == 10) {
            $data_manual = $dados['data'] . ' ' . date('H:i:s');
        } else {
            $data_manual = $dados['data'];
        }
    } else {
        $data_manual = date('Y-m-d H:i:s');
    }
    
    $sql = "INSERT INTO noticias (titulo, resumo, conteudo, categoria, imagem, data_criacao) 
            VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = $conexao->prepare($sql);
    $stmt->execute([$titulo, $resumo, $conteudo, $categoria, $imagem, $data_manual]);
    
    $id_novo = $conexao->lastInsertId();
    
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Notícia adicionada com sucesso',
        'id' => $id_novo
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'sucesso' => false,
        'erro' => $e->getMessage()
    ]);
}
?>
