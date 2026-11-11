// Script para carregar o card de destaque com imagem de fundo
// Este script funciona sem banco de dados, usando uma imagem fixa do projeto

document.addEventListener('DOMContentLoaded', () => {
    const bannerDestaque = document.getElementById('banner-destaque');
    
    if (!bannerDestaque) return;
    
    // Usar uma imagem fixa do projeto para preencher o card
    const imagemUrl = 'imagens/banner1.png';
    
    // Limpar qualquer conteúdo anterior
    bannerDestaque.innerHTML = '';
    
    // Adicionar classe image-only
    bannerDestaque.classList.add('image-only');
    
    // Definir a imagem de fundo com inline styles para garantir prioridade
    bannerDestaque.style.backgroundImage = `url('${imagemUrl}')`;
    bannerDestaque.style.backgroundSize = 'cover';
    bannerDestaque.style.backgroundPosition = 'center';
    bannerDestaque.style.backgroundRepeat = 'no-repeat';
    bannerDestaque.style.backgroundAttachment = 'scroll';
    bannerDestaque.style.display = 'block';
    bannerDestaque.style.width = '100%';
    bannerDestaque.style.height = 'auto';
    bannerDestaque.style.minHeight = '500px';
    bannerDestaque.style.padding = '0';
    bannerDestaque.style.margin = '0';
    bannerDestaque.style.backgroundColor = 'transparent';
    
    console.log('Banner de destaque carregado com imagem: ' + imagemUrl);
});
