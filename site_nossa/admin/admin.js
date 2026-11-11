// ============================================
// PAINEL ADMINISTRATIVO - JAVASCRIPT
// ============================================

const API_BASE = '../api';
let noticiaEmEdicao = null;
let premioEmEdicao = null;
let top10EmEdicao = null;
let itemParaDeletar = { id: null, tipo: null };

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    carregarNoticias();
    carregarPremios();
    carregarTop10();
    setupEventListeners();
});

function setupEventListeners() {
    // --- NOTÍCIAS ---
    document.getElementById('btn-add-noticia').addEventListener('click', abrirModalAdicionarNoticia);
    document.getElementById('form-noticia').addEventListener('submit', salvarNoticia);
    document.getElementById('btn-cancel').addEventListener('click', fecharModalNoticia);
    document.getElementById('close-modal').addEventListener('click', fecharModalNoticia);

    // --- PRÊMIOS ---
    document.getElementById('btn-add-premio').addEventListener('click', abrirModalAdicionarPremio);
    document.getElementById('form-premio').addEventListener('submit', salvarPremio);

    // --- TOP 10 ---
    // Botão de adicionar Top 10 removido
    // document.getElementById('btn-add-top10').addEventListener('click', abrirModalAdicionarTop10);
    // document.getElementById('form-top10').addEventListener('submit', salvarTop10);

    // --- GERAL ---
    document.getElementById('btn-cancel-delete').addEventListener('click', fecharModalConfirm);
    document.getElementById('btn-confirm-delete').addEventListener('click', executarDelecao);

    // Navegação sidebar
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            mudarSecao(link.dataset.section);
        });
    });

    // Fechar modais ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    });
}

// ============================================
// SEÇÃO: NOTÍCIAS
// ============================================

async function carregarNoticias() {
    try {
        const response = await fetch(`${API_BASE}/get_noticias.php`);
        const data = await response.json();
        if (data.sucesso) renderizarTabelaNoticias(data.noticias);
    } catch (erro) {
        console.error('Erro:', erro);
        document.getElementById('noticias-tbody').innerHTML = '<tr><td colspan="5" class="text-center">Erro ao carregar</td></tr>';
    }
}

function renderizarTabelaNoticias(noticias) {
    const tbody = document.getElementById('noticias-tbody');
    if (noticias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma notícia encontrada</td></tr>';
        return;
    }
    tbody.innerHTML = noticias.map(n => `
        <tr>
            <td>#${n.id}</td>
            <td>${n.titulo}</td>
            <td><span class="badge">${n.categoria}</span></td>
            <td>${n.data}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editarNoticia(${n.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger" onclick="confirmarDelecao(${n.id}, 'noticia', '${n.titulo}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function abrirModalAdicionarNoticia() {
    noticiaEmEdicao = null;
    document.getElementById('modal-title').textContent = 'Adicionar Notícia';
    document.getElementById('form-noticia').reset();
    document.getElementById('modal-noticia').classList.add('active');
}

function fecharModalNoticia() {
    document.getElementById('modal-noticia').classList.remove('active');
}

async function editarNoticia(id) {
    try {
        const response = await fetch(`${API_BASE}/get_noticias.php`);
        const data = await response.json();
        const n = data.noticias.find(x => x.id === id);
        if (n) {
            document.getElementById('noticia-titulo').value = n.titulo;
            document.getElementById('noticia-resumo').value = n.resumo;
            document.getElementById('noticia-conteudo').value = n.conteudo;
            document.getElementById('noticia-categoria').value = n.categoria;
            document.getElementById('noticia-imagem').value = n.imagem;
            if (n.data_criacao) {
                const partes = n.data_criacao.split(' ');
                document.getElementById('noticia-data').value = partes[0];
                if (partes[1]) {
                    document.getElementById('noticia-hora').value = partes[1].substring(0, 5);
                }
            }
            noticiaEmEdicao = id;
            document.getElementById('modal-title').textContent = 'Editar Notícia';
            document.getElementById('modal-noticia').classList.add('active');
        }
    } catch (erro) { console.error(erro); }
}

async function salvarNoticia(e) {
    e.preventDefault();
    let dataCompleta = document.getElementById('noticia-data').value;
    const hora = document.getElementById('noticia-hora').value;
    
    // Se houver hora, concatenar com a data
    if (hora) {
        dataCompleta = dataCompleta + ' ' + hora + ':00';
    } else if (dataCompleta) {
        // Se não houver hora, usar 12:00 (meio-dia) como padrão
        dataCompleta = dataCompleta + ' 12:00:00';
    }
    
    const dados = {
        titulo: document.getElementById('noticia-titulo').value,
        resumo: document.getElementById('noticia-resumo').value,
        conteudo: document.getElementById('noticia-conteudo').value,
        categoria: document.getElementById('noticia-categoria').value,
        imagem: document.getElementById('noticia-imagem').value,
        data: dataCompleta
    };
    if (noticiaEmEdicao) dados.id = noticiaEmEdicao;
    const url = noticiaEmEdicao ? `${API_BASE}/edit_noticia.php` : `${API_BASE}/add_noticia.php`;
    try {
        const res = await fetch(url, { method: 'POST', body: JSON.stringify(dados) });
        const r = await res.json();
        if (r.sucesso) {
            mostrarSucesso(r.mensagem);
            fecharModalNoticia();
            carregarNoticias();
        }
    } catch (erro) { mostrarErro('Erro ao salvar'); }
}

// ============================================
// SEÇÃO: PRÊMIOS
// ============================================

async function carregarPremios() {
    try {
        const response = await fetch(`${API_BASE}/get_premios.php`);
        const data = await response.json();
        if (data.sucesso) renderizarTabelaPremios(data.premios);
    } catch (erro) {
        document.getElementById('premios-tbody').innerHTML = '<tr><td colspan="4" class="text-center">Erro ao carregar</td></tr>';
    }
}

function renderizarTabelaPremios(premios) {
    const tbody = document.getElementById('premios-tbody');
    if (premios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum prêmio encontrado</td></tr>';
        return;
    }
    tbody.innerHTML = premios.map(p => `
        <tr>
            <td>#${p.id}</td>
            <td>${p.titulo}</td>
            <td>${p.ordem}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editarPremio(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger" onclick="confirmarDelecao(${p.id}, 'premio', '${p.titulo}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function abrirModalAdicionarPremio() {
    premioEmEdicao = null;
    document.getElementById('modal-premio-title').textContent = 'Adicionar Prêmio';
    document.getElementById('form-premio').reset();
    document.getElementById('modal-premio').classList.add('active');
}

function fecharModalPremio() {
    document.getElementById('modal-premio').classList.remove('active');
}

async function editarPremio(id) {
    try {
        const res = await fetch(`${API_BASE}/get_premios.php`);
        const data = await res.json();
        const p = data.premios.find(x => x.id === id);
        if (p) {
            document.getElementById('premio-titulo').value = p.titulo;
            document.getElementById('premio-regras').value = p.regras || '';
            document.getElementById('premio-imagem').value = p.imagem;
            document.getElementById('premio-imagem-mobile').value = p.imagem_mobile || '';

            document.getElementById('premio-link').value = p.link;
            document.getElementById('premio-ordem').value = p.ordem;
            premioEmEdicao = id;
            document.getElementById('modal-premio-title').textContent = 'Editar Prêmio';
            document.getElementById('modal-premio').classList.add('active');
        }
    } catch (erro) { console.error(erro); }
}

async function salvarPremio(e) {
    e.preventDefault();
    const dados = {
        titulo: document.getElementById('premio-titulo').value,
        regras: document.getElementById('premio-regras').value,
        imagem: document.getElementById('premio-imagem').value,
        imagem_mobile: document.getElementById('premio-imagem-mobile').value,
        link: document.getElementById('premio-link').value,
        ordem: document.getElementById('premio-ordem').value
    };
    if (premioEmEdicao) dados.id = premioEmEdicao;
    const url = premioEmEdicao ? `${API_BASE}/edit_premio.php` : `${API_BASE}/add_premio.php`;
    try {
        const res = await fetch(url, { method: 'POST', body: JSON.stringify(dados) });
        const r = await res.json();
        if (r.sucesso) {
            mostrarSucesso(r.mensagem);
            fecharModalPremio();
            carregarPremios();
        }
    } catch (erro) { mostrarErro('Erro ao salvar'); }
}

// ============================================
// SEÇÃO: TOP 10
// ============================================

async function carregarTop10() {
    try {
        const response = await fetch(`${API_BASE}/get_top10.php`);
        const data = await response.json();
        if (data.sucesso) renderizarTabelaTop10(data.top10);
    } catch (erro) {
        document.getElementById('top10-tbody').innerHTML = '<tr><td colspan="4" class="text-center">Erro ao carregar</td></tr>';
    }
}

function renderizarTabelaTop10(top10) {
    const tbody = document.getElementById('top10-tbody');
    if (top10.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhuma música encontrada</td></tr>';
        return;
    }
    tbody.innerHTML = top10.map(t => `
        <tr>
            <td>${t.posicao}º</td>
            <td>${t.titulo}</td>
            <td><code>${t.video_id}</code></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editarTop10(${t.id})"><i class="fas fa-edit"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function abrirModalAdicionarTop10() {
    top10EmEdicao = null;
    document.getElementById('modal-top10-title').textContent = 'Adicionar ao Top 10';
    document.getElementById('form-top10').reset();
    document.getElementById('modal-top10').classList.add('active');
}

function fecharModalTop10() {
    document.getElementById('modal-top10').classList.remove('active');
}

async function editarTop10(id) {
    try {
        const res = await fetch(`${API_BASE}/get_top10.php`);
        const data = await res.json();
        const t = data.top10.find(x => x.id === id);
        if (t) {
            document.getElementById('top10-posicao').value = t.posicao;
            document.getElementById('top10-video-id').value = t.video_id;
            document.getElementById('top10-titulo').value = t.titulo;
            document.getElementById('top10-artista').value = t.artista;
            document.getElementById('top10-imagem').value = t.imagem;
            top10EmEdicao = id;
            document.getElementById('modal-top10-title').textContent = 'Editar Música';
            document.getElementById('modal-top10').classList.add('active');
        }
    } catch (erro) { console.error(erro); }
}

async function salvarTop10(e) {
    e.preventDefault();
    const dados = {
        posicao: document.getElementById('top10-posicao').value,
        video_id: document.getElementById('top10-video-id').value,
        titulo: document.getElementById('top10-titulo').value,
        artista: document.getElementById('top10-artista').value,
        imagem: document.getElementById('top10-imagem').value
    };
    if (top10EmEdicao) dados.id = top10EmEdicao;
    const url = top10EmEdicao ? `${API_BASE}/edit_top10.php` : `${API_BASE}/add_top10.php`;
    try {
        const res = await fetch(url, { method: 'POST', body: JSON.stringify(dados) });
        const r = await res.json();
        if (r.sucesso) {
            mostrarSucesso(r.mensagem);
            fecharModalTop10();
            carregarTop10();
        }
    } catch (erro) { mostrarErro('Erro ao salvar'); }
}

// ============================================
// GERAL: DELEÇÃO E UTILITÁRIOS
// ============================================

function confirmarDelecao(id, tipo, titulo) {
    itemParaDeletar = { id, tipo };
    document.getElementById('confirm-message').textContent = `Tem certeza que deseja deletar "${titulo}"?`;
    document.getElementById('modal-confirm').classList.add('active');
}

function fecharModalConfirm() {
    document.getElementById('modal-confirm').classList.remove('active');
}

async function executarDelecao() {
    const { id, tipo } = itemParaDeletar;
    const url = `${API_BASE}/delete_${tipo}.php`;
    try {
        const res = await fetch(url, { method: 'POST', body: JSON.stringify({ id }) });
        const r = await res.json();
        if (r.sucesso) {
            mostrarSucesso('Excluído com sucesso');
            fecharModalConfirm();
            if (tipo === 'noticia') carregarNoticias();
            if (tipo === 'premio') carregarPremios();
            if (tipo === 'top10') carregarTop10();
        }
    } catch (erro) { mostrarErro('Erro ao excluir'); }
}

function mudarSecao(secao) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const section = document.getElementById(`${secao}-section`);
    if (section) {
        section.classList.add('active');
    }
    const link = document.querySelector(`[data-section="${secao}"]`);
    if (link) {
        link.classList.add('active');
    }
}

function mostrarSucesso(msg) {
    const a = document.createElement('div');
    a.className = 'alert alert-success active';
    a.style.position = 'fixed'; a.style.bottom = '20px'; a.style.right = '20px'; a.style.zIndex = '9999';
    a.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    document.body.appendChild(a);
    setTimeout(() => a.remove(), 3000);
}

function mostrarErro(msg) {
    const a = document.createElement('div');
    a.className = 'alert alert-error active';
    a.style.position = 'fixed'; a.style.bottom = '20px'; a.style.right = '20px'; a.style.zIndex = '9999';
    a.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    document.body.appendChild(a);
    setTimeout(() => a.remove(), 5000);
}
