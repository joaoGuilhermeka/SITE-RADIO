document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // MODAL DE REGULAMENTO / COMO PARTICIPAR
    // O controle dos botões e slides é feito em js/dynamic_sections.js
    // Aqui apenas configuramos o fechamento do modal.
    // ============================================================
    const rulesModal = document.getElementById('rulesModal');
    const closeRulesBtn = document.getElementById('closeRulesModal');

    const closeModal = () => {
        if (rulesModal) {
            rulesModal.style.display = 'none';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    };

    if (closeRulesBtn) {
        closeRulesBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === rulesModal) {
            closeModal();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 1024) return;
        const subBar = document.getElementById('sub');
        const logoContainer = document.querySelector('.floating-highlight-container');
        const logoImg = document.querySelector('.big-mic-hat');
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            subBar?.classList.add('scrolled');
            logoContainer?.classList.add('scrolled');
            logoImg?.classList.add('scrolled');
            navbar?.classList.add('scrolled');
        } else {
            subBar?.classList.remove('scrolled');
            logoContainer?.classList.remove('scrolled');
            logoImg?.classList.remove('scrolled');
            navbar?.classList.remove('scrolled');
        }
    });
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalCloseBtn = document.querySelector('.close-modal');
    const videoTriggers = document.querySelectorAll('.video-trigger');
    if (modal && videoPlayer && modalCloseBtn) {
        videoTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const videoId = trigger.getAttribute('data-video');
                if (videoId) {
                    videoPlayer.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        modalCloseBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            videoPlayer.src = '';
            document.body.style.overflow = 'auto';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                videoPlayer.src = '';
                document.body.style.overflow = 'auto';
            }
        });
    }

    const cookieBanner = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => { cookieBanner.classList.add('show'); }, 2000);
        }
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }
    var carousel = document.querySelector('.carousel');
    if (carousel) {
        var isMobile = window.innerWidth <= 1024;
        var animationId;
        var scrollAmount = 0;
        var speed = 0.5;
        var isPaused = false;
        var itemWidth = 230;

        window.startTop10Carousel = function() {
            if (animationId) cancelAnimationFrame(animationId);
            scrollAmount = 0;
            carousel.querySelectorAll('.carousel-clone').forEach(c => c.remove());

            var items = Array.from(carousel.querySelectorAll('.carousel-item:not(.carousel-clone)'));
            if (items.length > 0) {
             
                var clones = carousel.querySelectorAll('.carousel-clone');
                if (clones.length === 0) {
                    items.forEach(function(item) {
                        var clone = item.cloneNode(true);
                        clone.classList.add('carousel-clone');
                        carousel.appendChild(clone);
                    });
                }
                
                var totalOriginalWidth = items.length * itemWidth;

                function step() {
                    if (!isPaused) {
                        scrollAmount -= speed;
                        if (Math.abs(scrollAmount) >= totalOriginalWidth) scrollAmount = 0;
                        carousel.style.transform = 'translateX(' + scrollAmount + 'px)';
                    }
                    animationId = requestAnimationFrame(step);
                }
                step();
            }
        }

        if (!isMobile) {
            window.startTop10Carousel();
            carousel.addEventListener('mouseenter', function() { isPaused = true; });
            carousel.addEventListener('mouseleave', function() { isPaused = false; });
        } else {
            carousel.style.transform = 'none';
        }

        window.addEventListener('resize', function() {
            var newIsMobile = window.innerWidth <= 1024;
            if (newIsMobile !== isMobile) {
                isMobile = newIsMobile;
                if (isMobile) {
                    cancelAnimationFrame(animationId);
                    carousel.style.transform = 'none';
                    var clones = carousel.querySelectorAll('.carousel-clone');
                    clones.forEach(function(c) { c.remove(); });
                } else {
                    window.startTop10Carousel();
                }
            }
        });
    }

   
    var menuBtn = document.getElementById('mobile-menu-btn');
    var navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        var menuOpen = false;

        function abrirMenu() {
            menuOpen = true;
            navLinks.classList.add('active');
            menuBtn.classList.add('active');
            var icon = menuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-times';
            document.body.style.overflow = 'hidden';
        }

        function fecharMenu() {
            menuOpen = false;
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
            var icon = menuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        }

        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (menuOpen) {
                fecharMenu();
            } else {
                abrirMenu();
            }
        });

        var menuCloseBtn = document.getElementById('menu-close-btn');
        if (menuCloseBtn) {
            menuCloseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                fecharMenu();
            });
        }

        var menuLinks = navLinks.querySelectorAll('a');
        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', function(e) {
                fecharMenu();
            });
        }

        document.addEventListener('click', function(e) {
            if (menuOpen && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                fecharMenu();
            }
        });
    }

    // Scroll automático desativado para prêmios
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    //     anchor.addEventListener('click', function (e) {
    //         const href = this.getAttribute('href');
    //         if (href !== '#' && href.length > 1) {
    //             e.preventDefault();
    //             const targetId = href.substring(1);
    //             const targetElement = document.getElementById(targetId);
    //             
    //             if (targetElement) {
    //                 const headerOffset = 140; 
    //                 const elementPosition = targetElement.getBoundingClientRect().top;
    //                 const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    //                 
    //                 window.scrollTo({
    //                     top: offsetPosition,
    //                     behavior: 'smooth'
    //                 });
    //             }
    //         }
    //     });
    // });
});

// Alternar favicon para a versão transparente original quando o site é carregado
(function() {
    const originalFavicon = 'imagens/favicon_bordas_arredondadas.ico';
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = originalFavicon;
    document.getElementsByTagName('head')[0].appendChild(link);
    
    // Garantir que outros tipos de ícone também sejam atualizados
    const icons = document.querySelectorAll("link[rel='icon'], link[rel='apple-touch-icon']");
    icons.forEach(icon => icon.href = originalFavicon);
})();
