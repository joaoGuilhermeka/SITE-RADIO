// Carregar detalhes da notícia individual
document.addEventListener('DOMContentLoaded', async () => {
    // Obter ID da notícia da URL
    const urlParams = new URLSearchParams(window.location.search);
    const noticiaId = urlParams.get('id');

    if (!noticiaId) {
        mostrarErro('Notícia não encontrada');
        return;
    }

    try {
        // Buscar todas as notícias
        const response = await fetch('/api/get_noticias_simples.php');
        const data = await response.json();

        if (!data.sucesso) {
            mostrarErro('Erro ao carregar notícia');
            return;
        }

        // Encontrar a notícia específica
        const noticia = data.noticias.find(n => n.id == noticiaId);

        if (!noticia) {
            mostrarErro('Notícia não encontrada');
            return;
        }

        // Atualizar título da página
        document.title = noticia.titulo + ' - Nossa Sertaneja';

        // Atualizar banner com o título da notícia
        document.getElementById('banner-title').textContent = noticia.titulo;

        // Renderizar conteúdo da notícia
        renderizarNoticia(noticia);

        // Renderizar notícias relacionadas
        renderizarRelacionadas(data.noticias, noticiaId);

    } catch (erro) {
        console.error('Erro:', erro);
        mostrarErro('Erro ao carregar a notícia');
    }
});

function renderizarNoticia(noticia) {
    const container = document.getElementById('noticia-content');
    const imagem = noticia.imagem && noticia.imagem.trim() !== '' 
        ? noticia.imagem 
        : 'https://via.placeholder.com/800x400?text=Noticia';

    container.innerHTML = `
        <div class="noticia-header">
            <span class="noticia-category">${escaparHTML(noticia.categoria || 'GERAL')}</span>
            <span class="noticia-date">${noticia.data}</span>
        </div>
        
        <img src="${escaparHTML(imagem)}" alt="${escaparHTML(noticia.titulo)}" class="noticia-image" onerror="this.onerror=null; this.src='https://via.placeholder.com/800x400?text=Noticia'">
        
        <div class="noticia-body">
            ${escaparHTML(noticia.conteudo).replace(/\n/g, '<p></p>')}
        </div>
    `;
}

function renderizarRelacionadas(noticias, noticiaAtualId) {
    const container = document.getElementById('related-posts');
    
    // Filtrar notícias relacionadas (excluir a atual e pegar as 5 primeiras)
    const relacionadas = noticias
        .filter(n => n.id != noticiaAtualId)
        .slice(0, 5);

    if (relacionadas.length === 0) {
        container.innerHTML = '<p style="color: #999;">Nenhuma notícia relacionada</p>';
        return;
    }

    container.innerHTML = '';

    relacionadas.forEach(noticia => {
        const imagem = noticia.imagem && noticia.imagem.trim() !== '' 
            ? noticia.imagem 
            : 'https://via.placeholder.com/80x60?text=Noticia';

        const item = document.createElement('div');
        item.className = 'related-post-item';
        item.style.cursor = 'pointer';
        item.onclick = () => window.location.href = 'detalhes_noticia.html?id=' + noticia.id;
        item.innerHTML = `
            <div class="related-post-thumb">
                <img src="${escaparHTML(imagem)}" alt="${escaparHTML(noticia.titulo)}" onerror="this.onerror=null; this.src='https://via.placeholder.com/80x60?text=Noticia'">
            </div>
            <div class="related-post-info">
                <h5>${escaparHTML(noticia.titulo)}</h5>
                <span>${noticia.data}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function mostrarErro(mensagem) {
    const container = document.getElementById('noticia-content');
    container.innerHTML = `<div class="error">${mensagem}</div>`;
}
