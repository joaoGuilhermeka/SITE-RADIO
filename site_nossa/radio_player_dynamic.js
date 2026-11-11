const miniPlayer = {
  audio: new Audio(),
  isPlaying: false,
  currentStream: '',
  
  init() {
    this.audio.crossOrigin = 'anonymous';
    this.audio.preload = "auto";

    // Carregar estado salvo do localStorage
    const savedState = localStorage.getItem('ns_radio_state');
    if (savedState) {
        const state = JSON.parse(savedState);
        this.currentStream = state.currentStream;
        this.isPlaying = state.isPlaying;
        
        const citySelector = document.getElementById('city-selector');
        if (citySelector) {
            citySelector.value = this.currentStream;
        }

        // Se estava tocando na página anterior, continua tocando
        if (this.isPlaying) {
            this.playLive();
        }
    } else {
        const citySelector = document.getElementById('city-selector');
        if (citySelector) {
            this.currentStream = citySelector.value;
        }
    }

    this.setupEventListeners();
    this.atualizarProgramaAtual();
    this.updatePlayButtonIcon(this.isPlaying);
    
    setInterval(() => this.atualizarProgramaAtual(), 60000);
  },

  saveState() {
    localStorage.setItem('ns_radio_state', JSON.stringify({
        currentStream: this.currentStream,
        isPlaying: this.isPlaying
    }));
  },

  setupEventListeners() {
    const playBtn = document.getElementById('main-play-btn');
    const citySelector = document.getElementById('city-selector');
    
    if (playBtn) {
      playBtn.onclick = () => this.togglePlay();
    }
    
    if (citySelector) {
      citySelector.onchange = (e) => {
        this.currentStream = e.target.value;
        this.saveState();
        if (this.isPlaying) {
          this.playLive();
        }
      };
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('#on-air-play-btn')) {
            this.togglePlay();
        }
    });

    this.audio.onplaying = () => {
      this.isPlaying = true;
      this.updatePlayButtonIcon(true);
      this.saveState();
    };

    this.audio.onpause = () => {
      this.isPlaying = false;
      this.updatePlayButtonIcon(false);
      this.saveState();
    };

    this.audio.onerror = () => {
        this.isPlaying = false;
        this.updatePlayButtonIcon(false);
        this.saveState();
    };
  },

  updatePlayButtonIcon(playing) {
    const playBtn = document.getElementById('main-play-btn');
    if (playBtn) {
        const icon = playBtn.querySelector("i");
        if (icon) icon.className = playing ? "fas fa-pause" : "fas fa-play";
    }
    const onAirPlayBtns = document.querySelectorAll("#on-air-play-btn");
    onAirPlayBtns.forEach(btn => {
        const icon = btn.querySelector("i");
        if (icon) icon.className = playing ? "fas fa-pause" : "fas fa-play";
    });
  },

  getProgramaAtual() {
    if (typeof getProgramacaoHoje === 'function') {
        const programacao = getProgramacaoHoje();
        const agora = new Date();
        const minAtual = agora.getHours() * 60 + agora.getMinutes();
        let atual = programacao.find(p => {
            const [hIni, mIni] = p.inicio.split(':').map(Number);
            const [hFim, mFim] = p.fim === "00:00" ? [24, 0] : p.fim.split(':').map(Number);
            return minAtual >= (hIni * 60 + mIni) && minAtual < (hFim * 60 + mFim);
        });
        return atual || programacao[0];
    }
    return null;
  },

  atualizarProgramaAtual() {
    const programa = this.getProgramaAtual();
    if (!programa) return;
    const elements = {
        horario: document.getElementById('programa-horario'),
        dj: document.getElementById('dj-name-mini'),
        nome: document.getElementById('programa-mini'),
        img: document.getElementById('dj-image-mini')
    };
    if (elements.horario) elements.horario.textContent = `${programa.inicio} - ${programa.fim}`;
    if (elements.dj) elements.dj.textContent = programa.locutor;
    if (elements.nome) elements.nome.textContent = programa.programa;
    if (elements.img) elements.img.src = programa.img;
  },

  playLive() {
    const liveUrl = this.currentStream + (this.currentStream.includes('?') ? '&' : '?') + 't=' + Date.now();
    this.audio.src = liveUrl;
    this.audio.play().catch(e => {
        console.log("Play blocked, waiting for interaction", e);
        this.isPlaying = false;
        this.updatePlayButtonIcon(false);
    });
  },

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      if (typeof stopTV === 'function') stopTV();
      this.playLive();
    }
  }
};

window.miniPlayer = miniPlayer;
document.addEventListener('DOMContentLoaded', () => miniPlayer.init());
