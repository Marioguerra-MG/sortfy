function generateYouTubeTitle() {
  // Coletando a palavra-chave selecionada pelo usuário
  const keyword = document.getElementById('keywords').value.trim();

  // Se não houver palavra-chave selecionada, alertar o usuário
  if (!keyword) {
    alert('Por favor, selecione uma palavra-chave!');
    return;
  }

  // Mapeamento de nichos e títulos com base na palavra-chave
  const nicheTemplates = {
    'emagrecimento': [
      `Como Perder Peso Com ${keyword} em Apenas 30 Dias`,
      `O Guia Completo para Emagrecer Usando ${keyword}`,
      `5 Dicas de ${keyword} Para Emagrecer Rápido`,
      `Como ${keyword} Pode Transformar Seu Corpo`,
      `A Verdade Sobre Como Usar ${keyword} Para Emagrecer`
    ],
    'tecnologia': [
      `Tudo o Que Você Precisa Saber Sobre ${keyword} em 2025`,
      `Como ${keyword} Está Mudando o Futuro da Tecnologia`,
      `O Impacto de ${keyword} no Mundo Digital`,
      `Como Utilizar ${keyword} Para Aumentar Sua Produtividade`,
      `A Revolução de ${keyword} no Mercado de Tecnologia`
    ],
    'marketing digital': [
      `Como Utilizar ${keyword} Para Impulsionar Seu Negócio Online`,
      `5 Estratégias de ${keyword} Que Todo Empreendedor Deveria Conhecer`,
      `Como Aumentar Suas Vendas Usando ${keyword}`,
      `O Poder de ${keyword} no Marketing Digital`,
      `Como Usar ${keyword} Para Atingir Mais Clientes`
    ],
    'culinária': [
      `Como Preparar o Melhor ${keyword} em 10 Minutos`,
      `Receita Fácil de ${keyword} Para Iniciantes`,
      `O Guia Completo de Como Fazer ${keyword}`,
      `Transforme Sua Cozinha com ${keyword}`,
      `Como Cozinhar ${keyword} de Forma Simples e Saborosa`
    ],
    'fitness': [
      `Como Fazer Exercícios de ${keyword} Para Emagrecer`,
      `Os Benefícios de ${keyword} Para Sua Saúde`,
      `Como ${keyword} Pode Te Ajudar a Perder Peso Rápido`,
      `Aumente Sua Força com ${keyword}`,
      `Transforme Seu Corpo Com ${keyword}`
    ],
    'educação': [
      `Como Aprender ${keyword} de Forma Rápida e Eficaz`,
      `O Melhor Método de Estudo Para ${keyword}`,
      `Como Dominar ${keyword} em Poucos Dias`,
      `Tudo Sobre ${keyword} Para Iniciantes`,
      `Como Aprender ${keyword} Para Crescer na Carreira`
    ],
    'negócios': [
      `Como Criar um Negócio de ${keyword} Do Zero`,
      `5 Passos Para Criar um Negócio de ${keyword}`,
      `Como Utilizar ${keyword} Para Crescer Seu Negócio`,
      `Segredos de Sucesso no Mercado de ${keyword}`,
      `Como Usar ${keyword} Para Atingir Seus Objetivos Empreendedores`
    ],
    'beleza': [
      `Como Usar ${keyword} Para Transformar Sua Beleza`,
      `Dicas de Maquiagem Usando ${keyword}`,
      `Os Benefícios de ${keyword} Para Sua Pele`,
      `Como Incorporar ${keyword} Na Sua Rotina de Beleza`,
      `Transforme Seu Visual com ${keyword}`
    ],
    'autoajuda': [
      `Como Superar Seus Medos Usando ${keyword}`,
      `5 Dicas de ${keyword} Para Melhorar Sua Vida`,
      `Aumente Sua Confiança com ${keyword}`,
      `Como Usar ${keyword} Para Alcançar Seus Objetivos`,
      `O Poder de ${keyword} Para Transformar Sua Mente`
    ],
    'negócios online': [
      `Como Criar um Negócio de ${keyword} de Sucesso`,
      `Estratégias Comprovadas de ${keyword} Para Iniciar Seu Negócio`,
      `Como Aumentar Suas Vendas Online Usando ${keyword}`,
      `Como Usar ${keyword} Para Atrair Mais Clientes`,
      `O Guia Completo Para Empreender com ${keyword}`
    ],
    'investimentos': [
      `Como Investir em ${keyword} e Garantir o Seu Futuro`,
      `O Guia Para Iniciantes em ${keyword}`,
      `5 Passos Para Começar a Investir em ${keyword}`,
      `Como Obter Lucros Rápidos com ${keyword}`,
      `A Melhor Estratégia de Investimento em ${keyword}`
    ],
    'moda': [
      `Como Se Vestir Bem Usando ${keyword}`,
      `As Últimas Tendências de ${keyword} Para 2025`,
      `Como Combinar ${keyword} Para Arrasar no Look`,
      `Transforme Seu Estilo Com ${keyword}`,
      `As Melhores Dicas de ${keyword} Para o Seu Guarda-Roupa`
    ],
    'viagem': [
      `O Melhor Destino para Viajar com ${keyword}`,
      `Dicas de ${keyword} Para Aproveitar Sua Viagem ao Máximo`,
      `Como Planejar a Viagem dos Seus Sonhos Usando ${keyword}`,
      `Os Melhores Lugares para Visitar com ${keyword}`,
      `Viaje Como um Expert Usando ${keyword}`
    ],
    'música': [
      `Como Tocar ${keyword} Como um Profissional`,
      `Os Melhores Métodos Para Aprender ${keyword} Rapidamente`,
      `Dicas de ${keyword} Para Melhorar Suas Habilidades Musicais`,
      `Como Criar Música Usando ${keyword}`,
      `Tudo Que Você Precisa Saber Sobre ${keyword}`
    ],
    'saúde mental': [
      `Como Lidar com a Ansiedade Usando ${keyword}`,
      `Estratégias Para Melhorar Sua Saúde Mental com ${keyword}`,
      `O Impacto de ${keyword} na Sua Vida Emocional`,
      `Como Praticar ${keyword} Para Ter Uma Mente Mais Equilibrada`,
      `Como Combater o Estresse Usando ${keyword}`
    ],
    'fotografia': [
      `Como Tirar Fotos Incríveis Usando ${keyword}`,
      `O Guia Para Iniciantes em ${keyword}`,
      `Dicas de ${keyword} Para Melhorar Suas Habilidades Fotográficas`,
      `Como Editar Suas Fotos Usando ${keyword}`,
      `Como Usar ${keyword} Para Capturar Momentos Perfeitos`
    ],
    'decoração': [
      `Como Decorar Sua Casa Usando ${keyword}`,
      `Transforme Seu Ambiente com ${keyword}`,
      `Dicas de ${keyword} Para Organizar e Embelezar o Seu Espaço`,
      `Como Criar um Estilo Único com ${keyword}`,
      `O Guia Completo Para Decorar com ${keyword}`
    ],
    'esportes': [
      `Como Melhorar Seu Desempenho em ${keyword}`,
      `Dicas de ${keyword} Para Jogadores Iniciantes`,
      `Como Usar ${keyword} Para Aumentar Sua Performance Esportiva`,
      `O Guia de Treinamento para ${keyword}`,
      `Como Se Tornar Um Expert em ${keyword}`
    ],
    'games': [
      `Como Melhorar Seu Desempenho em ${keyword} no Jogo`,
      `Dicas de ${keyword} Para Jogadores Iniciantes`,
      `Como Usar ${keyword} Para Vencer Seus Adversários`,
      `O Guia Completo de Estratégias em ${keyword}`,
      `Como Se Tornar Um Expert em ${keyword}`,
      `As Melhores Técnicas de ${keyword} Para Ganhadores`,
      `Como Aumentar Sua Habilidade em ${keyword} Rápido`,
      `Tudo o Que Você Precisa Saber Sobre ${keyword} em 2025`,
      `Dicas Avançadas de ${keyword} Para Elevar Seu Jogo`,
      `Os Segredos dos Profissionais em ${keyword}`,
      `Como Dominar ${keyword} e Se Tornar um Campeão`,
      `A Verdade Sobre Como Jogar ${keyword} Como um Pro`
    ]
  };

  // Verifica o nicho da palavra-chave
  let matchedTitles = [];
  for (let niche in nicheTemplates) {
    if (keyword.toLowerCase().includes(niche)) {
      matchedTitles = nicheTemplates[niche];
      break;
    }
  }

  // Se não encontrar um nicho relevante para a palavra-chave
  if (matchedTitles.length === 0) {
    alert('Não encontramos um título adequado para esse nicho.');
    return;
  }

  // Escolhendo um título aleatório da lista de títulos do nicho correspondente
  const randomTitle = matchedTitles[Math.floor(Math.random() * matchedTitles.length)];

  // Exibindo o título gerado
  document.getElementById('generated-title').innerText = randomTitle;
}
