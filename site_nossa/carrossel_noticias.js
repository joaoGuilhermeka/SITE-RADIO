// Carrossel de Notícias com Destaque e Mini Cards
const NoticiaCarousel = {
    currentIndex: 0,
    noticias: [],
    autoplayInterval: null,
    autoplayDelay: 6000, // 6 segundos
    imagensCarregadas: {}, // Cache de imagens validadas

    init() {
        this.carregarNoticias();
    },

    async carregarNoticias() {
        // Tentar API primeiro
        try {
            const response = await fetch('api/get_noticias_simples.php');
            const data = await response.json();
            if (data.sucesso && data.noticias && data.noticias.length > 0) {
                this.noticias = data.noticias;
                this.renderizarTudo();
                this.setupEventListeners();
                this.iniciarAutoplay();
                return;
            }
        } catch (e) {
            console.log("API offline, usando fallback");
        }

        // Fallback direto se API falhar
        if (typeof noticiasData !== 'undefined') {
            this.noticias = noticiasData;
            this.renderizarTudo();
            this.setupEventListeners();
            this.iniciarAutoplay();
        }
    },

    // Validar se a imagem existe antes de usar
    async validarImagem(url) {
        // Se já foi validada, retornar do cache
        if (this.imagensCarregadas.hasOwnProperty(url)) {
            return this.imagensCarregadas[url];
        }

        // Usar um fallback padrão se a URL estiver vazia ou inválida
        if (!url || url.trim() === '') {
            this.imagensCarregadas[url] = 'https://via.placeholder.com/800x400?text=Noticia';
            return this.imagensCarregadas[url];
        }

        return new Promise((resolve) => {
            const img = new Image();
            const timeout = setTimeout(() => {
                // Se a imagem não carregar em 5 segundos, usar fallback
                this.imagensCarregadas[url] = 'https://via.placeholder.com/800x400?text=Noticia';
                resolve(this.imagensCarregadas[url]);
            }, 5000);

            img.onload = () => {
                clearTimeout(timeout);
                this.imagensCarregadas[url] = url;
                resolve(url);
            };

            img.onerror = () => {
                clearTimeout(timeout);
                this.imagensCarregadas[url] = 'https://via.placeholder.com/800x400?text=Noticia';
                resolve(this.imagensCarregadas[url]);
            };

            img.src = url;
        });
    },

    renderizarTudo() {
        // 1. Renderizar Carrossel (as 3 primeiras)
        this.renderizarCarrossel();
        
        // 2. Renderizar Lista Inferior (notícias a partir da 4ª)
        this.renderizarListaInferior();

        // 3. Renderizar Banner Lateral (Desativado para manter imagem fixa do HTML)
        // this.renderizarBannerLateral();
    },

    renderizarCarrossel() {
        const mainCarousel = document.getElementById('featured-carousel-main');
        if (!mainCarousel || this.noticias.length === 0) return;

        // Pegar apenas as 3 mais recentes para o carrossel
        const noticiasCarrossel = this.noticias.slice(0, 3);
        const noticia = noticiasCarrossel[this.currentIndex];
        
        if (!noticia) return;

        // Imagem com fallback imediato
        let imagem = noticia.imagem && noticia.imagem.trim() !== ''
            ? noticia.imagem
            : 'https://via.placeholder.com/800x400?text=Noticia';

        // Aplicar imagem imediatamente (o navegador cuida do carregamento)
        mainCarousel.style.backgroundImage = `url('${imagem}')`;
        
        // Tentar validar em background para cache futuro, sem travar a UI
        this.validarImagem(imagem);
        mainCarousel.style.cursor = 'pointer';
        mainCarousel.onclick = () => window.location.href = 'detalhes_noticia.html?id=' + noticia.id;

        // Atualizar conteúdo
        let conteudo = mainCarousel.querySelector('.featured-carousel-content');
        if (!conteudo) {
            conteudo = document.createElement('div');
            conteudo.className = 'featured-carousel-content';
            mainCarousel.appendChild(conteudo);
        }

        conteudo.innerHTML = `
            <div class="featured-carousel-meta">
                <span class="featured-carousel-tag" onclick="event.stopPropagation(); window.location.href='noticias.html?categoria=${encodeURIComponent(noticia.categoria || 'GERAL')}'">${this.escaparHTML(noticia.categoria || 'GERAL')}</span>
                <span class="featured-carousel-date"><i class="far fa-clock"></i> ${noticia.data}</span>
            </div>
            <h2 class="featured-carousel-title">${this.escaparHTML(noticia.titulo)}</h2>
        `;

        // Atualizar dots
        this.renderizarDots(noticiasCarrossel.length);
    },

    renderizarDots(total) {
        const dotsContainer = document.getElementById('featured-carousel-dots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';

        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'featured-carousel-dot' + (i === this.currentIndex ? ' active' : '');
            dot.onclick = (e) => {
                e.stopPropagation(); // Evitar clique no carrossel pai
                this.currentIndex = i;
                this.renderizarCarrossel();
                this.reiniciarAutoplay();
            };
            dotsContainer.appendChild(dot);
        }
    },

    renderizarListaInferior() {
        const homeNewsList = document.querySelector('.news-list-jk');
        if (!homeNewsList) return;

        // Pegar notícias a partir da 4ª (índice 3 em diante)
        // Se houver poucas notícias, mostrar o que tiver disponível que não esteja no carrossel
        const noticiasRestantes = this.noticias.slice(3, 8); // Mostrar até 5 notícias na lista
        
        if (noticiasRestantes.length === 0) {
            // Se não houver notícias suficientes para a lista, podemos mostrar as mesmas do carrossel ou deixar vazio
            // O usuário pediu: "quando eu colocar noticia pode colocar tanto no automatico e no de baixo... ai vai tirando com forma as ordens"
            // Isso sugere que a lista deve mostrar as notícias que vêm depois das do carrossel.
            homeNewsList.innerHTML = ''; 
            return;
        }

        homeNewsList.innerHTML = '';
        noticiasRestantes.forEach(noticia => {
            const imagemNoticia = noticia.imagem && noticia.imagem.trim() !== '' 
                ? noticia.imagem 
                : 'https://via.placeholder.com/150x100?text=Noticia';

            const item = document.createElement('div');
            item.className = 'news-item-jk';
            item.style.cursor = 'pointer';
            item.onclick = () => window.location.href = 'detalhes_noticia.html?id=' + noticia.id;
		            item.innerHTML = `
		                <div class="news-thumb-jk">
		                    <img src="${imagemNoticia}" alt="${noticia.titulo}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150x100?text=Noticia';" style="display: block;">
		                </div>
		                <div class="news-info-jk">
		                    <span class="news-tag-jk" onclick="event.stopPropagation(); window.location.href='noticias.html?categoria=${encodeURIComponent(noticia.categoria || 'GERAL')}'">${this.escaparHTML(noticia.categoria || 'GERAL')}</span>
		                    <h4 class="news-headline-jk">${this.escaparHTML(noticia.titulo)}</h4>
		                </div>
		            `;
            homeNewsList.appendChild(item);
        });
    },

    renderizarBannerLateral() {
        const bannerLateral = document.getElementById('banner-destaque');
        if (!bannerLateral || this.noticias.length === 0) return;

        // Usar a primeira notícia (a mais recente) para o banner lateral de destaque
        const destaque = this.noticias[0];
        const imagemDestaque = destaque.imagem && destaque.imagem.trim() !== '' 
            ? destaque.imagem 
            : 'imagens/Cópia  (510 x 1601 px) (1).png';

        bannerLateral.style.backgroundImage = `url('${imagemDestaque}')`;
        bannerLateral.style.cursor = 'pointer';
        bannerLateral.onclick = () => window.location.href = 'detalhes_noticia.html?id=' + destaque.id;
        
        // Adicionar um overlay de texto se necessário (opcional, mantendo o layout)
        bannerLateral.innerHTML = `
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 20px; color: white;">
                <span style="background: #ea974b; padding: 4px 8px; font-size: 10px; font-weight: bold; border-radius: 3px;">DESTAQUE</span>
                <h3 style="margin: 10px 0 0 0; font-size: 18px; line-height: 1.2;">${this.escaparHTML(destaque.titulo)}</h3>
            </div>
        `;
        bannerLateral.style.position = 'relative';
    },

    setupEventListeners() {
        const mainCarousel = document.getElementById('featured-carousel-main');
        if (!mainCarousel) return;

        let touchStartX = 0;
        let touchEndX = 0;

        mainCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mainCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    },

    handleSwipe(startX, endX) {
        const threshold = 50;
        if (startX - endX > threshold) {
            this.proximo();
            this.reiniciarAutoplay();
        } else if (endX - startX > threshold) {
            this.anterior();
            this.reiniciarAutoplay();
        }
    },

    proximo() {
        const totalCarrossel = Math.min(this.noticias.length, 3);
        if (totalCarrossel === 0) return;
        this.currentIndex = (this.currentIndex + 1) % totalCarrossel;
        this.renderizarCarrossel();
    },

    anterior() {
        const totalCarrossel = Math.min(this.noticias.length, 3);
        if (totalCarrossel === 0) return;
        this.currentIndex = (this.currentIndex - 1 + totalCarrossel) % totalCarrossel;
        this.renderizarCarrossel();
    },

    iniciarAutoplay() {
        if (this.autoplayInterval) clearInterval(this.autoplayInterval);
        this.autoplayInterval = setInterval(() => {
            this.proximo();
        }, this.autoplayDelay);
    },

    reiniciarAutoplay() {
        clearInterval(this.autoplayInterval);
        this.iniciarAutoplay();
    },

    escaparHTML(texto) {
        if (!texto) return '';
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    NoticiaCarousel.init();
});
