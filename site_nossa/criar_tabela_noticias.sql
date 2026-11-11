

CREATE TABLE IF NOT EXISTS noticias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumo TEXT NOT NULL,
    conteudo LONGTEXT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    imagem VARCHAR(500),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    ordem INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir notícias de exemplo
INSERT INTO noticias (titulo, resumo, conteudo, categoria, imagem, ordem) VALUES
(
    'Ed Gama impressiona ao mostrar mudança física após perder 25kg',
    'O humorista compartilhou sua jornada de saúde e os resultados surpreendentes com seus seguidores.',
    'Conteúdo completo da notícia aqui...',
    'FAMOSOS',
    'https://via.placeholder.com/800x500?text=Ed+Gama+Noticia',
    1
),
(
    'EITA! Vaza verdadeiro motivo do término entre Ana Castela e Zé Felipe',
    'Fontes próximas ao casal revelam o que realmente aconteceu nos bastidores do fim do relacionamento.',
    'Conteúdo completo da notícia aqui...',
    'FAMOSOS',
    'https://via.placeholder.com/800x500?text=Ana+Castela+Noticia',
    2
),
(
    'BBB 26: Saiba qual é a data do início do pré-confinamento do reality',
    'A produção do programa já definiu o cronograma para os novos participantes da casa mais vigiada do Brasil.',
    'Conteúdo completo da notícia aqui...',
    'EVENTOS',
    'https://via.placeholder.com/800x500?text=BBB+26+Noticia',
    3
),
(
    'Helicóptero da Band cai em pouso de emergência em SP',
    'Aeronave teve problemas técnicos e precisou realizar manobra arriscada; não há feridos graves.',
    'Conteúdo completo da notícia aqui...',
    'ATUALIDADE',
    'https://via.placeholder.com/800x500?text=Helicoptero+Noticia',
    4
),
(
    'Virginia Fonseca posta reflexão minutos após término de Zé Felipe',
    'A influenciadora quebrou o silêncio nas redes sociais com uma mensagem enigmática sobre novos ciclos.',
    'Conteúdo completo da notícia aqui...',
    'FAMOSOS',
    'https://via.placeholder.com/800x500?text=Virginia+Noticia',
    5
),
(
    'Ana Castela e Zé Felipe terminam o namoro; cantor fez o anúncio',
    'O anúncio oficial foi feito através das redes sociais do cantor, pegando os fãs de surpresa.',
    'Conteúdo completo da notícia aqui...',
    'MÚSICA',
    'https://via.placeholder.com/800x500?text=Termino+Noticia',
    6
);
