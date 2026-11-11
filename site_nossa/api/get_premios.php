<?php
include '../config.php';

try {
    $stmt = $conexao->query("SELECT * FROM premios WHERE ativo = 1 ORDER BY ordem ASC, id DESC");
    $premios = $stmt->fetchAll();

    echo json_encode([
        'sucesso' => true,
        'total' => count($premios),
        'premios' => $premios
    ]);
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
