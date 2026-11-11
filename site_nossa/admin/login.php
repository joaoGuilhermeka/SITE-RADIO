<?php
require_once __DIR__ . '/auth.php';

if (admin_is_authenticated()) {
    header('Location: index.php');
    exit;
}

$erro = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = trim((string)($_POST['usuario'] ?? ''));
    $senha = (string)($_POST['senha'] ?? '');

    if (hash_equals(ADMIN_USER, $usuario) && hash_equals(ADMIN_PASSWORD, $senha)) {
        session_regenerate_id(true);
        $_SESSION['nossa_admin_authenticated'] = true;
        $_SESSION['nossa_admin_user'] = ADMIN_USER;
        header('Location: index.php');
        exit;
    }

    $erro = 'Usuário ou senha inválidos.';
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Login - Painel Nossa Sertaneja</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="shortcut icon" href="../imagens/Design sem nome (4).png" type="image/png">
    <link rel="stylesheet" href="admin.css?v=1.2">
    <style>
        .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); }
        .login-card { width: min(100%, 430px); background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 16px; padding: 38px; box-shadow: 0 18px 50px rgba(0,0,0,.35); }
        .login-brand { text-align: center; margin-bottom: 28px; }
        .login-brand img { width: 180px; max-width: 80%; height: auto; }
        .login-brand h1 { color: #D07600; font-size: 24px; margin-top: 14px; }
        .login-field { margin-bottom: 18px; }
        .login-field label { display: block; color: #fff; font-weight: 700; margin-bottom: 8px; }
        .login-field input { width: 100%; padding: 13px 14px; border: 1px solid #d7d7d7; border-radius: 8px; font-size: 15px; outline: none; }
        .login-field input:focus { border-color: #D07600; box-shadow: 0 0 0 3px rgba(208,118,0,.14); }
        .login-submit { width: 100%; justify-content: center; margin-top: 8px; }
        .login-error { color: #a93226; background: #fdecea; border: 1px solid #f5b7b1; padding: 11px 13px; border-radius: 8px; margin-bottom: 18px; font-size: 14px; }
    </style>
</head>
<body>
    <main class="login-page">
        <section class="login-card" aria-labelledby="login-title">
            <div class="login-brand">
                <img src="../imagens/sem fundo.png" alt="Nossa Sertaneja">
                <h1 id="login-title">Painel Administrativo</h1>
            </div>
            <?php if ($erro !== ''): ?>
                <div class="login-error" role="alert"><i class="fas fa-circle-exclamation"></i> <?= htmlspecialchars($erro, ENT_QUOTES, 'UTF-8') ?></div>
            <?php endif; ?>
            <form method="post" autocomplete="on">
                <div class="login-field">
                    <label for="usuario">Usuário</label>
                    <input id="usuario" name="usuario" type="text" autocomplete="username" required autofocus>
                </div>
                <div class="login-field">
                    <label for="senha">Senha</label>
                    <input id="senha" name="senha" type="password" autocomplete="current-password" required>
                </div>
                <button class="btn btn-primary login-submit" type="submit"><i class="fas fa-right-to-bracket"></i> Entrar</button>
            </form>
        </section>
    </main>
</body>
</html>
