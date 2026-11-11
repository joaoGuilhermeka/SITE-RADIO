<?php
include '../config.php';

try {
    $stmt = $conexao->query("SELECT * FROM top10 WHERE ativo = 1 ORDER BY posicao ASC");
    $top10 = $stmt->fetchAll();

    echo json_encode([
        'sucesso' => true,
        'total' => count($top10),
        'top10' => $top10
    ]);
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
