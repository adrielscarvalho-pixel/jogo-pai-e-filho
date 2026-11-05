/* =========================================================
   ITENS E PERGUNTAS PRÉ-PREENCHIDAS — "ACERTE O VALOR"
   Categorias:
   - 'barato'   (R$ 1 a R$ 300)
   - 'lazer'    (R$ 300 a R$ 3.000)
   - 'tech'     (R$ 3.000 a R$ 30.000)
   - 'veiculos' (R$ 30.000 a R$ 500.000)
   - 'imoveis'  (R$ 500.000 a R$ 15.000.000)
   - 'absurdo'  (Acima de R$ 15.000.000)
   ========================================================= */
window.CATEGORIAS_ITENS = [
  { id: 'todas', nome: '🌟 Todas', cor: '#FFD23F' },
  { id: 'barato', nome: '🍔 Até R$ 300', cor: '#2BD67B' },
  { id: 'lazer', nome: '👟 R$ 300 a 3 mil', cor: '#4D96FF' },
  { id: 'tech', nome: '🎮 R$ 3 mil a 30 mil', cor: '#7B5CFF' },
  { id: 'veiculos', nome: '🚗 R$ 30 mil a 500 mil', cor: '#FF9F1C' },
  { id: 'imoveis', nome: '🏡 R$ 500 mil a 15 mi', cor: '#FF5D73' },
  { id: 'absurdo', nome: '🚀 Bilionários', cor: '#FF7AC6' }
];

window.ITENS = [
  // --- barato (até R$ 300) ---
  { n: 'um pirulito', e: '🍭', p: 1, cat: 'barato' },
  { n: 'um pão francês', e: '🥖', p: 1, cat: 'barato' },
  { n: 'um brigadeiro de festa', e: '🍫', p: 4, cat: 'barato' },
  { n: 'um picolé de fruta', e: '🍦', p: 6, cat: 'barato' },
  { n: 'um pacotinho de figurinhas da Copa', e: '🃏', p: 7, cat: 'barato' },
  { n: 'uma coxinha com refrigerante', e: '🍗', p: 14, cat: 'barato' },
  { n: 'uma Coca-Cola de 2 litros', e: '🥤', p: 12, cat: 'barato' },
  { n: 'uma caixa de bombom', e: '🍬', p: 16, cat: 'barato' },
  { n: 'um balde de pipoca no cinema', e: '🍿', p: 28, cat: 'barato' },
  { n: 'um pote de sorvete de 2 litros', e: '🍨', p: 30, cat: 'barato' },
  { n: 'um ingresso de cinema', e: '🎬', p: 40, cat: 'barato' },
  { n: 'um combo de hambúrguer artesanal', e: '🍔', p: 50, cat: 'barato' },
  { n: 'um mês de Netflix', e: '📺', p: 45, cat: 'barato' },
  { n: 'uma pizza gigante com borda recheada', e: '🍕', p: 80, cat: 'barato' },
  { n: 'um ovo de Páscoa grande', e: '🥚', p: 90, cat: 'barato' },
  { n: 'uma bola de futebol de campo', e: '⚽', p: 120, cat: 'barato' },
  { n: 'um rodízio de churrasco pra 2 pessoas', e: '🥩', p: 220, cat: 'barato' },
  { n: 'uma mochila escolar resistente', e: '🎒', p: 250, cat: 'barato' },
  { n: 'um fone Bluetooth básico', e: '🎧', p: 150, cat: 'barato' },

  // --- lazer (R$ 300 a R$ 3.000) ---
  { n: 'um jogo lançamento de PS5', e: '💿', p: 350, cat: 'lazer' },
  { n: 'um skate completo', e: '🛹', p: 400, cat: 'lazer' },
  { n: 'a camisa oficial da Seleção Brasileira', e: '👕', p: 450, cat: 'lazer' },
  { n: 'um ingresso de arquibancada na final da Libertadores', e: '🎟️', p: 500, cat: 'lazer' },
  { n: 'um controle DualSense de PS5', e: '🎮', p: 500, cat: 'lazer' },
  { n: 'um tênis Nike Air Force', e: '👟', p: 800, cat: 'lazer' },
  { n: 'uma passagem de avião nacional (ida e volta)', e: '✈️', p: 900, cat: 'lazer' },
  { n: 'uma mesa de pebolim (totó)', e: '🥅', p: 1100, cat: 'lazer' },
  { n: 'um celular de entrada (básico)', e: '📱', p: 1200, cat: 'lazer' },
  { n: 'uma cama elástica grande de quintal', e: '🤸', p: 1500, cat: 'lazer' },
  { n: 'um fone AirPods original', e: '🎧', p: 1600, cat: 'lazer' },
  { n: 'uma chuteira profissional de jogador', e: '👟', p: 1800, cat: 'lazer' },
  { n: 'uma bicicleta aro 29 com marcha', e: '🚲', p: 2200, cat: 'lazer' },
  { n: 'um robô aspirador inteligente', e: '🤖', p: 2300, cat: 'lazer' },
  { n: 'um patinete elétrico', e: '🛴', p: 2800, cat: 'lazer' },

  // --- tech (R$ 3.000 a R$ 30.000) ---
  { n: 'um PlayStation 5 (PS5)', e: '🎮', p: 4000, cat: 'tech' },
  { n: 'uma Smart TV de 65 polegadas 4K', e: '📺', p: 4200, cat: 'tech' },
  { n: 'um Nintendo Switch 2', e: '🕹️', p: 4500, cat: 'tech' },
  { n: 'um óculos de Realidade Virtual (Meta Quest)', e: '🥽', p: 4300, cat: 'tech' },
  { n: 'uma mesa de sinuca oficial', e: '🎱', p: 5500, cat: 'tech' },
  { n: 'um drone profissional com câmera 4K', e: '🛸', p: 6500, cat: 'tech' },
  { n: 'o LEGO gigante da Millennium Falcon', e: '🧱', p: 7000, cat: 'tech' },
  { n: 'um notebook gamer com placa de vídeo RTX', e: '💻', p: 8500, cat: 'tech' },
  { n: 'uma geladeira French Door de duas portas', e: '🧊', p: 10000, cat: 'tech' },
  { n: 'um iPhone Pro Max topo de linha', e: '📱', p: 12000, cat: 'tech' },
  { n: 'uma festa de aniversário completa no buffet', e: '🎉', p: 16000, cat: 'tech' },
  { n: 'uma moto Honda CG 160 zero km', e: '🏍️', p: 19000, cat: 'tech' },
  { n: 'um cavalo Quarto de Milha', e: '🐴', p: 25000, cat: 'tech' },

  // --- veiculos (R$ 30.000 a R$ 500.000) ---
  { n: 'um PC Gamer extremo com 3 monitores', e: '🖥️', p: 38000, cat: 'veiculos' },
  { n: 'um carro usado popular (Gol / Uno)', e: '🚗', p: 42000, cat: 'veiculos' },
  { n: 'uma viagem pra Disney com a família toda', e: '🏰', p: 65000, cat: 'veiculos' },
  { n: 'um carro popular zero km (Fiat Mobi / Kwid)', e: '🚗', p: 75000, cat: 'veiculos' },
  { n: 'um jet ski novo', e: '🚤', p: 95000, cat: 'veiculos' },
  { n: 'um BYD Dolphin Mini (carro elétrico popular)', e: '🔋', p: 120000, cat: 'veiculos' },
  { n: 'uma picape Toyota Hilux', e: '🛻', p: 280000, cat: 'veiculos' },
  { n: 'um SUV zero km (Jeep Compass / Corolla Cross)', e: '🚙', p: 200000, cat: 'veiculos' },
  { n: 'um motorhome (casa sobre rodas)', e: '🚐', p: 380000, cat: 'veiculos' },
  { n: 'um apartamento de 2 quartos', e: '🏢', p: 450000, cat: 'veiculos' },

  // --- imoveis (R$ 500.000 a R$ 15.000.000) ---
  { n: 'uma cobertura duplex na cidade', e: '🏙️', p: 900000, cat: 'imoveis' },
  { n: 'um Porsche 911 zero km', e: '🏎️', p: 1200000, cat: 'imoveis' },
  { n: 'uma casa grande em condomínio com piscina', e: '🏡', p: 1800000, cat: 'imoveis' },
  { n: 'uma lancha de passeio para 12 pessoas', e: '🚤', p: 2500000, cat: 'imoveis' },
  { n: 'uma Ferrari vermelha', e: '🏎️', p: 4500000, cat: 'imoveis' },
  { n: 'uma Lamborghini Aventador', e: '🐂', p: 6500000, cat: 'imoveis' },
  { n: 'uma fazenda grande de gado', e: '🚜', p: 10000000, cat: 'imoveis' },
  { n: 'um helicóptero particular', e: '🚁', p: 12000000, cat: 'imoveis' },

  // --- absurdo (acima de R$ 15.000.000) ---
  { n: 'uma mansão de luxo com campo de futebol', e: '🏟️', p: 22000000, cat: 'absurdo' },
  { n: 'um iate de luxo de 3 andares', e: '🛥️', p: 35000000, cat: 'absurdo' },
  { n: 'uma ilha particular no litoral', e: '🏝️', p: 45000000, cat: 'absurdo' },
  { n: 'um jatinho executivo particular', e: '🛩️', p: 80000000, cat: 'absurdo' },
  { n: '1 mês de salário do Cristiano Ronaldo', e: '🤑', p: 100000000, cat: 'absurdo' },
  { n: 'um avião Boeing 737 comercial', e: '✈️', p: 500000000, cat: 'absurdo' },
  { n: 'o passe do Vini Jr.', e: '⭐', p: 1000000000, cat: 'absurdo' },
  { n: 'o passe do Haaland', e: '🦾', p: 1100000000, cat: 'absurdo' },
  { n: 'um estádio moderno de Copa do Mundo', e: '🏟️', p: 3000000000, cat: 'absurdo' },
  { n: 'o clube Real Madrid inteiro', e: '👑', p: 35000000000, cat: 'absurdo' }
];
