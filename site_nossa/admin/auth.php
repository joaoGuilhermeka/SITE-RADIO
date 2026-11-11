<?php
// Controle de acesso do painel administrativo.
// A sessão é mantida apenas no navegador do usuário autenticado.
session_name('nossa_admin_session');
session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'
]);
session_start();

const ADMIN_USER = 'redacaonossasertaneja1';
const ADMIN_PASSWORD = 'nossa117TV*';

function admin_is_authenticated(): bool
{
    return !empty($_SESSION['nossa_admin_authenticated'])
        && $_SESSION['nossa_admin_authenticated'] === true;
}

function require_admin_auth(): void
{
    if (!admin_is_authenticated()) {
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['sucesso' => false, 'erro' => 'Não autenticado.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
?>
