<?php
require_once 'config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS noticias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo VARCHAR(255) NOT NULL,
        resumo TEXT NOT NULL,
        conteudo TEXT NOT NULL,
        categoria VARCHAR(100) NOT NULL,
        imagem VARCHAR(500),
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        ativo BOOLEAN DEFAULT 1,
        ordem INTEGER DEFAULT 0
    )";
    
    $conexao->exec($sql);

    $sql_premios = "CREATE TABLE IF NOT EXISTS premios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo VARCHAR(255) NOT NULL,
        regras TEXT,
        como_participar TEXT,
        imagem VARCHAR(500),
        link VARCHAR(500),
        ordem INTEGER DEFAULT 0,
        ativo BOOLEAN DEFAULT 1
    )";
    $conexao->exec($sql_premios);
    
    // Inserir uma notícia de exemplo se estiver vazio
    $check = $conexao->query("SELECT COUNT(*) FROM noticias")->fetchColumn();
    if ($check == 0) {
        $sql_insert = "INSERT INTO noticias (titulo, resumo, conteudo, categoria, imagem) VALUES
        ('Bem-vindo ao novo Dashboard!', 'Este é um exemplo de notícia para testar o seu novo painel.', 'Aqui você pode gerenciar todo o conteúdo do seu site de forma simples.', 'GERAL', 'https://via.placeholder.com/800x500?text=Nossa+Sertaneja')";
        $conexao->exec($sql_insert);
    }
    
    echo "Banco de dados inicializado com sucesso!";
} catch (Exception $e) {
    echo "Erro ao inicializar banco: " . $e->getMessage();
}
?>
