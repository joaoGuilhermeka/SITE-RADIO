<?php
require_once __DIR__ . '/auth.php';
if (!admin_is_authenticated()) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TXRWDXM2TS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-TXRWDXM2TS');
</script>
    <meta name="robots" content="noindex, nofollow">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Administrativo - Nossa Sertaneja</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
    <link rel="stylesheet" href="admin.css?v=1.1">
     <link rel="shortcut icon" href="../imagens/Design sem nome (4).png" type="image/png">
     <link rel="icon" href="../imagens/Design sem nome (4).png" type="image/png">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <img src="../imagens/sem fundo.png" alt="Nossa Sertaneja" class="admin-logo">
            </div>
            <nav class="sidebar-nav">
                <a href="#" class="nav-link active" data-section="noticias">
                    <i class="fas fa-newspaper"></i> Notícias
                </a>
                <a href="#" class="nav-link" data-section="premios">
                    <i class="fas fa-gift"></i> Prêmios
                </a>
                <a href="#" class="nav-link" data-section="top10">
                    <i class="fas fa-trophy"></i> Top 10
                </a>
                <a href="../index.html" class="nav-link">
                    <i class="fas fa-house"></i> Voltar ao site
                </a>
                <a href="logout.php" class="nav-link" title="Sair do painel">
                    <i class="fas fa-right-from-bracket"></i> Sair
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Header -->
            <header class="admin-header">
                <h1>Gerenciador de Notícias</h1>
                <div class="header-actions">
                    <span class="user-info">Admin</span>
                </div>
            </header>

            <!-- Seção de Notícias -->
            <section id="noticias-section" class="content-section active">
                <div class="section-header">
                    <h2>Notícias</h2>
                    <button class="btn btn-primary" id="btn-add-noticia">
                        <i class="fas fa-plus"></i> Adicionar Notícia
                    </button>
                </div>

                <!-- Tabela de Notícias -->
                <div class="table-responsive">
                    <table class="noticias-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Categoria</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="noticias-tbody">
                            <tr>
                                <td colspan="5" class="text-center">Carregando notícias...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Seção de Prêmios -->
            <section id="premios-section" class="content-section">
                <div class="section-header">
                    <h2>Prêmios / Promoções</h2>
                    <button class="btn btn-primary" id="btn-add-premio">
                        <i class="fas fa-plus"></i> Adicionar Prêmio
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Ordem</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="premios-tbody">
                            <tr><td colspan="4" class="text-center">Carregando prêmios...</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Seção de Top 10 -->
            <section id="top10-section" class="content-section">
                <div class="section-header">
                    <h2>Top 10 da Nossa</h2>
                </div>
                <div class="table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Posição</th>
                                <th>Título</th>
                                <th>ID Vídeo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="top10-tbody">
                            <tr><td colspan="4" class="text-center">Carregando Top 10...</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>


        </main>
    </div>

    <!-- Modal para Adicionar/Editar Notícia -->
    <div id="modal-noticia" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Adicionar Notícia</h2>
                <button class="close-btn" id="close-modal">&times;</button>
            </div>
            <form id="form-noticia">
                <div class="form-group">
                    <label for="noticia-titulo">Título *</label>
                    <input type="text" id="noticia-titulo" required placeholder="Digite o título da notícia">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="noticia-categoria">Categoria *</label>
                        <select id="noticia-categoria" required style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ddd; background: white; color: #333;">
                            <option value="">Selecione uma categoria</option>
                            <option value="NOTICIA">NOTÍCIA</option>
                            <option value="CELEBRIDADES">CELEBRIDADES</option>
                            <option value="MUSICA">MÚSICA</option>
                            <option value="OPORTUNIDADES">OPORTUNIDADES</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="noticia-data">Data da Notícia</label>
                        <input type="date" id="noticia-data">
                    </div>
                    <div class="form-group">
                        <label for="noticia-hora">Hora da Notícia</label>
                        <input type="time" id="noticia-hora">
                    </div>
                </div>

                <div class="form-group">
                    <label for="noticia-resumo">Resumo *</label>
                    <textarea id="noticia-resumo" required placeholder="Digite um resumo da notícia" rows="3"></textarea>
                </div>

                <div class="form-group">
                    <label for="noticia-conteudo">Conteúdo Completo</label>
                    <textarea id="noticia-conteudo" placeholder="Digite o conteúdo completo da notícia" rows="5"></textarea>
                </div>

                <div class="form-group">
                    <label for="noticia-imagem">URL da Imagem</label>
                    <input type="url" id="noticia-imagem" placeholder="https://exemplo.com/imagem.jpg">
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> Salvar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btn-cancel">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal para Prêmios -->
    <div id="modal-premio" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-premio-title">Adicionar Prêmio</h2>
                <button class="close-btn" onclick="fecharModalPremio()">&times;</button>
            </div>
            <form id="form-premio">
                <div class="form-group">
                    <label for="premio-titulo">Título da Promoção *</label>
                    <input type="text" id="premio-titulo" required>
                </div>
                <div class="form-group">
                    <label for="premio-regras">Regulamento do Prêmio</label>
                    <textarea id="premio-regras" rows="5" placeholder="Digite o regulamento que será exibido no botão REGULAMENTO DO PRÊMIO"></textarea>
                </div>
                <div class="form-group">
                    <label for="premio-imagem">URL da Imagem (Desktop) *</label>
                    <input type="text" id="premio-imagem" required placeholder="imagens/exemplo.png">
                </div>
                <div class="form-group">
                    <label for="premio-imagem-mobile">URL da Imagem (Mobile 370x450)</label>
                    <input type="text" id="premio-imagem-mobile" placeholder="imagens/exemplo_mobile.png">
                </div>


                <div class="form-row">
                    <div class="form-group">
                        <label for="premio-link">Link de Participação</label>
                        <input type="text" id="premio-link">
                    </div>
                    <div class="form-group">
                        <label for="premio-ordem">Ordem de Exibição</label>
                        <input type="number" id="premio-ordem" value="0">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-success"><i class="fas fa-save"></i> Salvar</button>
                    <button type="button" class="btn btn-secondary" onclick="fecharModalPremio()">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal para Top 10 -->
    <div id="modal-top10" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-top10-title">Adicionar Música ao Top 10</h2>
                <button class="close-btn" onclick="fecharModalTop10()">&times;</button>
            </div>
            <form id="form-top10">
                <div class="form-row">
                    <div class="form-group">
                        <label for="top10-posicao">Posição (1-10) *</label>
                        <input type="number" id="top10-posicao" required min="1" max="10">
                    </div>
                    <div class="form-group">
                        <label for="top10-video-id">ID do Vídeo YouTube *</label>
                        <input type="text" id="top10-video-id" required placeholder="Ex: 1jlDqubhZvU">
                    </div>
                </div>
                <div class="form-group">
                    <label for="top10-titulo">Título da Música *</label>
                    <input type="text" id="top10-titulo" required>
                </div>
                <div class="form-group">
                    <label for="top10-artista">Artista</label>
                    <input type="text" id="top10-artista">
                </div>
                <div class="form-group">
                    <label for="top10-imagem">URL da Miniatura (Opcional)</label>
                    <input type="text" id="top10-imagem" placeholder="Deixe vazio para gerar do YouTube">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-success"><i class="fas fa-save"></i> Salvar</button>
                    <button type="button" class="btn btn-secondary" onclick="fecharModalTop10()">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal de Confirmação -->
    <div id="modal-confirm" class="modal">
        <div class="modal-content modal-confirm">
            <div class="modal-header">
                <h2>Confirmar Exclusão</h2>
            </div>
            <p id="confirm-message">Tem certeza que deseja deletar esta notícia?</p>
            <div class="form-actions">
                <button class="btn btn-danger" id="btn-confirm-delete">
                    <i class="fas fa-trash"></i> Deletar
                </button>
                <button class="btn btn-secondary" id="btn-cancel-delete">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        </div>
    </div>

    <script src="admin.js?v=1.2"></script>
</body>
</html>
