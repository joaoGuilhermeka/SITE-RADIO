<?php
require_once __DIR__ . '/../admin/auth.php';
require_admin_auth();
require_once '../config.php';

try {
    // Ordenar por data_criacao DESC (mais recentes primeiro)
    $sql = "SELECT id, titulo, resumo, conteudo, categoria, imagem, data_criacao 
            FROM noticias 
            WHERE ativo = 1 
            ORDER BY data_criacao DESC, id DESC";
    
    $stmt = $conexao->query($sql);
    $noticias = [];
    
    while ($linha = $stmt->fetch()) {
        $noticias[] = [
            'id' => (int)$linha['id'],
            'titulo' => $linha['titulo'],
            'resumo' => $linha['resumo'],
            'conteudo' => $linha['conteudo'],
            'categoria' => $linha['categoria'],
            'imagem' => $linha['imagem'],
            'data_criacao' => $linha['data_criacao'],
            'data' => date('d/m/Y H:i', strtotime($linha['data_criacao']))
        ];
    }
    
    echo json_encode([
        'sucesso' => true,
        'total' => count($noticias),
        'noticias' => $noticias
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'erro' => $e->getMessage()
    ]);
}
?>
