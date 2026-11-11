<?php
require_once '../config.php';

try {
    // Ordenar por data_criacao DESC (mais recentes primeiro)
    $sql = "SELECT id, titulo, resumo, conteudo, categoria, imagem, data_criacao as data 
            FROM noticias 
            WHERE ativo = 1 
            ORDER BY data_criacao DESC, id DESC";
    
    $stmt = $conexao->query($sql);
    $noticias = [];
    
    while ($linha = $stmt->fetch()) {
        $linha['id'] = (int)$linha['id'];
        // Formatar data para exibição no site (Ex: 06/04/2026 19:30)
        $linha['data'] = date('d/m/Y H:i', strtotime($linha['data']));
        $noticias[] = $linha;
    }
    
    echo json_encode([
        'sucesso' => true,
        'total' => count($noticias),
        'noticias' => $noticias
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'erro' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
