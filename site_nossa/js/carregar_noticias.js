// ============================================
// CARREGAR NOTÍCIAS DO BANCO DE DADOS
// ============================================

// Detectar se está em localhost ou produção
function obterURLAPI() {
    const host = window.location.hostname;
    
    if (host === 'localhost' || host === '127.0.0.1') {
        // Ambiente local
        return 'http://localhost:8000/api/get_noticias_simples.php';
    } else {
        // Produção (Hostgator)
        return '/api/get_noticias_simples.php';
    }
}

// Carregar notícias quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    carregarNoticias();
});

// Função para carregar notícias
async function carregarNoticias() {
    try {
        const urlAPI = obterURLAPI();
        const response = await fetch(urlAPI);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const dados = await response.json();
        
        if (dados.sucesso && dados.noticias.length > 0) {
            renderizarNoticias(dados.noticias);
        } else {
            mostrarMensagem('Nenhuma notícia disponível no momento.');
        }
    } catch (erro) {
        console.error('Erro ao carregar notícias:', erro);
        mostrarMensagem('Erro ao carregar notícias. Tente recarregar a página.');
    }
}

// Função para renderizar notícias
function renderizarNoticias(noticias) {
    const container = document.getElementById('noticias-container');
    
    if (!container) {
        console.error('Container de notícias não encontrado');
        return;
    }
    
    // Limpar container
    container.innerHTML = '';
    
    // Renderizar cada notícia
    noticias.forEach(noticia => {
        const noticiaHTML = criarElementoNoticia(noticia);
        container.appendChild(noticiaHTML);
    });
}

// Função para criar elemento de notícia
function criarElementoNoticia(noticia) {
    const div = document.createElement('div');
    div.className = 'blog-card';
    
    // Usar imagem padrão se não houver
    const imagem = noticia.imagem || 'https://via.placeholder.com/800x500?text=Notícia';
    
    // Formatar data
    const data = noticia.data || new Date().toLocaleDateString('pt-BR');
    
    div.innerHTML = `
        <div class="blog-image">
            <img src="${imagem}" alt="${noticia.titulo}" onerror="this.onerror=null; this.src='https://via.placeholder.com/800x500?text=Notícia'">
        </div>
        <div class="blog-content">
            <span class="blog-category">${noticia.categoria || 'GERAL'}</span>
            <h3>${noticia.titulo}</h3>
            <p class="blog-date">${data}</p>
            <p class="blog-excerpt">${noticia.resumo}</p>
            <a href="#" class="blog-link">Ler mais →</a>
        </div>
    `;
    
    return div;
}

// Função para mostrar mensagem
function mostrarMensagem(mensagem) {
    const container = document.getElementById('noticias-container');
    
    if (container) {
        container.innerHTML = `<p style="text-align: center; padding: 20px; color: #666;">${mensagem}</p>`;
    }
}
