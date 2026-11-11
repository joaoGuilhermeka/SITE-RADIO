
// Variável global para armazenar os prêmios carregados
let listaDePremiosGlobal = [];
let indicePremioAtual = 0;

document.addEventListener('DOMContentLoaded', () => {
    carregarPremiosDinamicos();
    carregarTop10Dinamico();
    configurarBotoesAcao();
});

async function carregarPremiosDinamicos() {
    const track = document.getElementById('prize-track');
    if (!track) return;

    try {
        const response = await fetch('api/get_premios.php?nocache=' + Date.now());
        const data = await response.json();

        if (data.sucesso && Array.isArray(data.premios) && data.premios.length > 0) {
            listaDePremiosGlobal = data.premios;
            
            track.innerHTML = '';
            listaDePremiosGlobal.forEach((p, index) => {
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                
                const img = document.createElement('img');
                
                // Detecta se é mobile ou desktop
                const isMobile = window.innerWidth <= 768;
                
                // Usa imagem mobile se existir e for mobile, senão usa desktop
                if (isMobile && p.imagem_mobile && p.imagem_mobile.trim() !== '') {
                    img.src = p.imagem_mobile;
                } else {
                    img.src = p.imagem;
                }
                
                img.alt = p.titulo;
                slide.appendChild(img);
                track.appendChild(slide);
            });

            inicializarCarrosselPremios();
        }
    } catch (erro) {
        console.error('Erro ao carregar prêmios:', erro);
    }
}

function inicializarCarrosselPremios() {
    const track = document.getElementById('prize-track');
    const nextButton = document.getElementById('next-prize');
    const prevButton = document.getElementById('prev-prize');
    
    if (!track || listaDePremiosGlobal.length === 0) return;

    const slides = Array.from(track.children);
    indicePremioAtual = 0;

    const updateSlidePosition = () => {
        const slideWidth = slides[0].offsetWidth;
        track.style.transform = `translateX(-${indicePremioAtual * slideWidth}px)`;
    };

    if (nextButton && prevButton) {
        // Clonar para remover listeners antigos
        const newNext = nextButton.cloneNode(true);
        const newPrev = prevButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newNext, nextButton);
        prevButton.parentNode.replaceChild(newPrev, prevButton);

        newNext.addEventListener('click', () => {
            indicePremioAtual = (indicePremioAtual + 1) % slides.length;
            updateSlidePosition();
        });

        newPrev.addEventListener('click', () => {
            indicePremioAtual = (indicePremioAtual - 1 + slides.length) % slides.length;
            updateSlidePosition();
        });
    }
    
    updateSlidePosition();
}

function configurarBotoesAcao() {
    const infoBtn = document.querySelector('.btn-rules');
    const participateBtn = document.querySelector('.btn-participate');

    if (infoBtn) {
        const newInfoBtn = infoBtn.cloneNode(true);
        infoBtn.parentNode.replaceChild(newInfoBtn, infoBtn);
        newInfoBtn.addEventListener('click', () => {
            const premio = listaDePremiosGlobal[indicePremioAtual];
            if (!premio) return;
            
            const title = premio.titulo || 'INFORMAÇÕES';
            const rules = (premio.regras && premio.regras.trim() !== '') ? premio.regras : 'Informações em breve.';
            window.openRulesModal(title, rules);
        });
    }

    if (participateBtn) {
        const newParticipateBtn = participateBtn.cloneNode(true);
        participateBtn.parentNode.replaceChild(newParticipateBtn, participateBtn);
        newParticipateBtn.addEventListener('click', () => {
            const premio = listaDePremiosGlobal[indicePremioAtual];
            if (!premio) return;

            const comoParticipar = premio.como_participar;
            const link = premio.link;

            if (comoParticipar && comoParticipar.trim() !== '' && comoParticipar.trim() !== 'null') {
                window.openRulesModal('COMO PARTICIPAR', comoParticipar);
            } else if (link && link.trim() !== '' && link.startsWith('http')) {
                window.open(link, '_blank');
            } else {
                window.openRulesModal('COMO PARTICIPAR', 'Informações de participação em breve. Fique ligado na nossa programação!');
            }
        });
    }
}

// Recarregar imagens ao redimensionar a janela (quando muda de portrait para landscape, por exemplo)
window.addEventListener('resize', () => {
    const track = document.getElementById('prize-track');
    if (!track || listaDePremiosGlobal.length === 0) return;
    
    const slides = Array.from(track.children);
    const isMobile = window.innerWidth <= 768;
    
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (img) {
            const premio = listaDePremiosGlobal[index];
            if (isMobile && premio.imagem_mobile && premio.imagem_mobile.trim() !== '') {
                img.src = premio.imagem_mobile;
            } else {
                img.src = premio.imagem;
            }
        }
    });
});

async function carregarTop10Dinamico() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    try {
        const response = await fetch('api/get_top10.php');
        const data = await response.json();
        if (data.sucesso && data.top10.length > 0) {
            carousel.innerHTML = data.top10.map(t => {
                const thumb = t.imagem || `https://i.ytimg.com/vi/${t.video_id}/hq720.jpg`;
                return `
                    <div class="carousel-item">
                        <a href="#" class="card" onclick="abrirVideo('${t.video_id}')">
                            <img src="${thumb}" alt="${t.titulo}">
                            <div class="card-number">${t.posicao}</div>
                        </a>
                    </div>
                `;
            }).join('');
            if (window.startTop10Carousel && window.innerWidth > 1024) window.startTop10Carousel();
        }
    } catch (e) {}
}

window.openRulesModal = (title, text) => {
    const modal = document.getElementById('rulesModal');
    const mTitle = document.getElementById('rulesModalTitle');
    const mText = document.getElementById('rulesModalText');
    if (modal && mTitle && mText) {
        mTitle.textContent = title;
        mText.innerText = text;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
};
