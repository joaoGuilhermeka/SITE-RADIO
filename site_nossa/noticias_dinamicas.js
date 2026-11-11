// Gerenciador de Notícias para a página noticias.html
const NoticiasManager = {
    noticias: [],
    paginaAtual: 1,
    itensPorPagina: 10,
    totalPaginas: 1,

    init() {
        // Verificar se há categoria na URL
        const urlParams = new URLSearchParams(window.location.search);
        const catUrl = urlParams.get('categoria');
        if (catUrl) {
            this.categoriaAtual = catUrl.toUpperCase();
        }
        this.carregarNoticias();
    },

    async carregarNoticias() {
        const container = document.getElementById('blog-news-list');
        if (!container) return;

        try {
            const response = await fetch('api/get_noticias_simples.php');
            const data = await response.json();
            if (data.sucesso && data.noticias && data.noticias.length > 0) {
                this.noticias = data.noticias;
                this.totalPaginas = Math.ceil(this.noticias.length / this.itensPorPagina);
                this.renderizarNoticias();
                this.renderizarPaginacao();
                return;
            }
        } catch (e) {
            console.log("API offline, usando fallback");
        }

        if (typeof noticiasData !== 'undefined') {
            this.noticias = noticiasData;
            this.totalPaginas = Math.ceil(this.noticias.length / this.itensPorPagina);
            this.renderizarNoticias();
            this.renderizarPaginacao();
        }
    },

    categoriaAtual: 'TODAS',
    ordemAtual: 'RECENTES',

    renderizarNoticias() {
        const container = document.getElementById('blog-news-list');
        if (!container) return;

        container.innerHTML = '';

        // Adicionar Barra de Pesquisa e Filtros apenas na primeira página
        if (this.paginaAtual === 1) {
            // Barra de Pesquisa
            const searchBar = document.createElement('div');
            searchBar.className = 'news-search-bar';
            searchBar.style.marginBottom = '20px';
            searchBar.style.position = 'relative';
            searchBar.innerHTML = `
                <i class="fas fa-search" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: #D07600;"></i>
                <input type="text" id="news-search-input" placeholder="Pesquisar notícias..." 
                    style="width: 100%; padding: 15px 15px 15px 50px; border-radius: 50px; border: 2px solid #D07600; background: #1a1a1a; color: white; font-size: 16px; outline: none; box-sizing: border-box;">
            `;
            container.appendChild(searchBar);

            // Container para os Filtros (Lado a Lado no Mobile)
            const filterContainer = document.createElement('div');
            filterContainer.className = 'news-filters-wrapper';
            filterContainer.style.marginBottom = '30px';
            filterContainer.style.display = 'flex';
            filterContainer.style.flexWrap = 'nowrap'; // Garante que fiquem na mesma linha
            filterContainer.style.gap = '10px';
            filterContainer.style.justifyContent = 'flex-start';
            filterContainer.style.overflowX = 'hidden'; // Evita scroll lateral indesejado
            
            // Estilos comuns para os Wrappers
            const commonWrapperStyles = {
                position: 'relative',
                flex: '1', // Faz com que ocupem o espaço proporcionalmente
                minWidth: '0' // Necessário para flexbox nowrap funcionar com largura fixa interna
            };

            // Estilos comuns para os Selects
            const isMobile = window.innerWidth <= 768;
            const commonSelectStyles = {
                width: '100%',
                padding: isMobile ? '10px 10px 10px 10px' : '12px 20px',
                paddingRight: '30px', // Espaço para a seta
                borderRadius: '10px',
                border: '2px solid #D07600',
                background: '#1a1a1a',
                color: 'white',
                fontSize: isMobile ? '13px' : '16px',
                fontWeight: '700',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                webkitAppearance: 'none',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            };

            // --- FILTRO DE CATEGORIA ---
            const catWrapper = document.createElement('div');
            Object.assign(catWrapper.style, commonWrapperStyles);
            
            const catSelect = document.createElement('select');
            catSelect.id = 'category-filter-select';
            Object.assign(catSelect.style, commonSelectStyles);

            const categorias = [
                { val: 'TODAS', label: isMobile ? 'Categorias' : 'Todas as Categorias' },
                { val: 'NOTICIA', label: 'Notícias' },
                { val: 'CELEBRIDADES', label: 'Celebridades' },
                { val: 'MUSICA', label: 'Música' },
                { val: 'OPORTUNIDADES', label: 'Oportunidades' }
            ];

            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.val;
                option.textContent = cat.label;
                option.selected = this.categoriaAtual === cat.val;
                option.style.background = '#1a1a1a';
                option.style.color = 'white';
                catSelect.appendChild(option);
            });

            const catArrow = document.createElement('i');
            catArrow.className = 'fas fa-chevron-down';
            Object.assign(catArrow.style, {
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                color: '#D07600', pointerEvents: 'none', fontSize: '12px'
            });

            catSelect.onchange = (e) => {
                this.categoriaAtual = e.target.value;
                this.paginaAtual = 1;
                this.renderizarNoticias();
                this.renderizarPaginacao();
            };

            catWrapper.appendChild(catSelect);
            catWrapper.appendChild(catArrow);
            filterContainer.appendChild(catWrapper);

            // --- FILTRO DE ORDENAÇÃO ---
            const orderWrapper = document.createElement('div');
            Object.assign(orderWrapper.style, commonWrapperStyles);
            
            const orderSelect = document.createElement('select');
            orderSelect.id = 'order-filter-select';
            Object.assign(orderSelect.style, commonSelectStyles);

            const ordens = [
                { val: 'RECENTES', label: isMobile ? 'Recentes' : 'Mais Recentes' },
                { val: 'ANTIGAS', label: isMobile ? 'Antigas' : 'Mais Antigas' }
            ];

            ordens.forEach(o => {
                const option = document.createElement('option');
                option.value = o.val;
                option.textContent = o.label;
                option.selected = this.ordemAtual === o.val;
                option.style.background = '#1a1a1a';
                option.style.color = 'white';
                orderSelect.appendChild(option);
            });

            const orderArrow = document.createElement('i');
            orderArrow.className = 'fas fa-chevron-down';
            Object.assign(orderArrow.style, {
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                color: '#D07600', pointerEvents: 'none', fontSize: '12px'
            });

            orderSelect.onchange = (e) => {
                this.ordemAtual = e.target.value;
                this.renderizarNoticias();
                this.renderizarPaginacao();
            };

            orderWrapper.appendChild(orderSelect);
            orderWrapper.appendChild(orderArrow);
            filterContainer.appendChild(orderWrapper);

            container.appendChild(filterContainer);

            this.setupSearchListener();
        }

        // 1. Filtrar notícias pela categoria selecionada
        let noticiasProcessadas = this.categoriaAtual === 'TODAS' 
            ? [...this.noticias] 
            : this.noticias.filter(n => this.removerAcentos((n.categoria || '').toUpperCase()) === this.removerAcentos(this.categoriaAtual));

        // 2. Ordenar notícias
        noticiasProcessadas.sort((a, b) => {
            // Assumindo formato de data "DD/MM/YYYY HH:mm" ou similar
            // Converter para objeto Date para comparação
            const parseData = (dStr) => {
                if (!dStr) return new Date(0);
                const parts = dStr.split(/[\/\s:]/);
                if (parts.length >= 3) {
                    // DD/MM/YYYY -> YYYY, MM-1, DD
                    return new Date(parts[2], parts[1] - 1, parts[0], parts[3] || 0, parts[4] || 0);
                }
                return new Date(dStr);
            };

            const dataA = parseData(a.data);
            const dataB = parseData(b.data);

            return this.ordemAtual === 'RECENTES' ? dataB - dataA : dataA - dataB;
        });

        this.totalPaginas = Math.ceil(noticiasProcessadas.length / this.itensPorPagina);

        const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        const noticiasPagina = noticiasProcessadas.slice(inicio, fim);

        if (noticiasPagina.length === 0) {
            container.innerHTML += '<p style="color: white; text-align: center; padding: 40px;">Nenhuma notícia encontrada para esta categoria.</p>';
            return;
        }

        noticiasPagina.forEach(noticia => {
            container.appendChild(this.criarElementoNoticia(noticia));
        });
    },

    criarElementoNoticia(noticia) {
        const card = document.createElement('article');
        card.className = 'blog-card';
        card.style.cursor = 'pointer';
        card.onclick = () => window.location.href = `detalhes_noticia.html?id=${noticia.id}`;

        const imagem = noticia.imagem && noticia.imagem.trim() !== '' 
            ? noticia.imagem 
            : 'https://via.placeholder.com/800x400?text=Noticia';

        card.innerHTML = `
            <div class="blog-img-wrapper">
                <img src="${this.escaparHTML(imagem)}" alt="${this.escaparHTML(noticia.titulo)}" onerror="this.onerror=null; this.src='https://via.placeholder.com/800x400?text=Noticia'">
                <span class="blog-category-tag">${this.escaparHTML(noticia.categoria || 'GERAL')}</span>
            </div>
            <div class="blog-content">
                <span class="blog-date"><i class="far fa-clock"></i> ${noticia.data}</span>
                <h2 class="blog-title">${this.escaparHTML(noticia.titulo)}</h2>
                <p class="blog-excerpt">${this.escaparHTML(noticia.resumo || '')}</p>
                <button class="btn-read-more-blog">LER MAIS</button>
            </div>
        `;

        return card;
    },

    renderizarPaginacao() {
        const container = document.querySelector('.pagination-dots');
        if (!container) return;

        container.innerHTML = '';

        if (this.totalPaginas <= 1) return;

        for (let i = 1; i <= this.totalPaginas; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot-item' + (i === this.paginaAtual ? ' active' : '');
            dot.textContent = i;
            dot.onclick = () => {
                this.paginaAtual = i;
                this.renderizarNoticias();
                this.renderizarPaginacao();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            container.appendChild(dot);
        }
    },

    setupSearchListener() {
        const input = document.getElementById('news-search-input');
        if (!input) return;

        input.addEventListener('input', (e) => {
            const termo = this.removerAcentos(e.target.value.toLowerCase());
            const cards = document.querySelectorAll('.blog-card');
            
            cards.forEach(card => {
                const titulo = this.removerAcentos(card.querySelector('.blog-title').textContent.toLowerCase());
                const resumo = this.removerAcentos(card.querySelector('.blog-excerpt').textContent.toLowerCase());
                const categoria = this.removerAcentos(card.querySelector('.blog-category-tag').textContent.toLowerCase());
                
                if (titulo.includes(termo) || resumo.includes(termo) || categoria.includes(termo)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Ocultar paginação durante a busca para não confundir
            const paginacao = document.querySelector('.pagination-dots');
            if (paginacao) {
                paginacao.style.display = termo.length > 0 ? 'none' : 'flex';
            }
        });
    },

    removerAcentos(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },

    escaparHTML(texto) {
        if (!texto) return '';
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    },

    mostrarErro(mensagem) {
        const container = document.getElementById('blog-news-list');
        if (container) {
            container.innerHTML = `<div style="color: white; padding: 40px; text-align: center;">${mensagem}</div>`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    NoticiasManager.init();
});
