/**
 * Carregador de Notícias Estático
 * Este script carrega as notícias do arquivo news_data.js em vez de chamar a API.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Carregando notícias estáticas...');
    
    // Verificar se noticiasData existe (vem do news_data.js)
    if (typeof noticiasData !== 'undefined' && noticiasData.length > 0) {
        renderizarNoticiasHome(noticiasData);
        renderizarNoticiasPagina(noticiasData);
    } else {
        console.warn('noticiasData não encontrado ou vazio. Verifique se o news_data.js está carregado.');
    }
});

/**
 * Renderiza as notícias na Home (index.html)
 */
function renderizarNoticiasHome(noticias) {
    const homeNewsList = document.querySelector('.news-list-jk');
    const homeFeatured = document.querySelector('.featured-column-right');

    if (!homeNewsList) return;

    // 1. Notícia em Destaque (Primeira da lista)
    if (homeFeatured && noticias.length > 0) {
        const destaque = noticias[0];
        const imagemDestaque = destaque.imagem || 'https://via.placeholder.com/800x1000?text=NOTÍCIA+EM+DESTAQUE';
        
        homeFeatured.innerHTML = `
            <div class="news-card-featured-large" onclick="window.location.href='detalhes_noticia.html?id=${destaque.id}'" style="cursor: pointer;">
                <div class="featured-img-wrapper">
                    <img src="${imagemDestaque}" alt="${destaque.titulo}" onerror="this.onerror=null; this.src='https://via.placeholder.com/800x1000?text=NOTICIA+EM+DESTAQUE'">
                    <span class="featured-tag-large">DESTAQUE DO DIA</span>
                </div>
                <div class="featured-content-large">
                    <h3>${destaque.titulo}</h3>
                    <p>${destaque.resumo}</p>
                    <button class="btn-read-more">LER NOTICIA COMPLETA</button>
                </div>
            </div>
        `;
    }

    // 2. Lista de Notícias (Próximas 5)
    homeNewsList.innerHTML = '';
    const proximasNoticias = noticias.slice(1, 6);

    proximasNoticias.forEach(noticia => {
        const imagemNoticia = noticia.imagem || 'https://via.placeholder.com/150x100?text=Noticia';
        
        const item = document.createElement('div');
        item.className = 'news-item-jk';
        item.style.cursor = 'pointer';
        item.onclick = () => window.location.href = 'detalhes_noticia.html?id=' + noticia.id;
        
        item.innerHTML = `
            <div class="news-thumb-jk">
                <img src="${imagemNoticia}" alt="${noticia.titulo}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150x100?text=Noticia'">
            </div>
            <div class="news-info-jk">
                <span class="news-tag-jk">${noticia.categoria || 'GERAL'}</span>
                <h4 class="news-headline-jk">${noticia.titulo}</h4>
            </div>
        `;
        homeNewsList.appendChild(item);
    });
}

/**
 * Renderiza as notícias na página de Notícias (noticias.html)
 */
function renderizarNoticiasPagina(noticias) {
    const container = document.querySelector('.blog-list') || document.querySelector('.news-list-jk');
    // Se estiver na noticias.html, o container geralmente tem uma classe diferente ou está em outro contexto
    // No projeto v14, noticias.html usa NoticiasManager no noticias_dinamicas.js
    
    // Vamos apenas garantir que se o NoticiasManager existir, ele use nossos dados
    if (typeof NoticiasManager !== 'undefined') {
        NoticiasManager.noticias = noticias;
        NoticiasManager.renderizarNoticias();
    }
}
