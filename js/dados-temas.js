/* =========================================================
   TEMAS DO MODO "TEMA SECRETO ⚽"
   jogadores: cada item é "Nome principal|apelido|outro jeito de escrever"
   nivel: 'facil' | 'medio' | 'dificil'
   dicas: da mais vaga para a mais reveladora
   Se faltar algum jogador na lista, o JUIZ (quem escolheu o tema)
   toca no palpite para corrigir para SIM.
   ========================================================= */
window.TEMAS = [
  // ---------------- FÁCEIS ----------------
  {
    id: 'msn-bbc', nivel: 'facil', emoji: '🔱',
    titulo: 'Fizeram parte do trio MSN ou do trio BBC',
    dicas: [
      'São trios de ataque muito famosos.',
      'Um trio jogava no Barcelona e o outro no Real Madrid.',
      'Junte as iniciais dos nomes dos três atacantes de cada trio...'
    ],
    jogadores: [
      'Lionel Messi|Messi|Leo Messi', 'Luis Suárez|Suarez|Luisito', 'Neymar|Neymar Jr|Ney',
      'Gareth Bale|Bale', 'Karim Benzema|Benzema', 'Cristiano Ronaldo|CR7|Cristiano'
    ]
  },
  {
    id: 'barca-miami', nivel: 'facil', emoji: '🦩',
    titulo: 'Ex-Barcelona que jogaram no Inter Miami',
    dicas: [
      'Todos jogaram juntos num clube da Espanha.',
      'Depois foram para um time dos Estados Unidos.',
      'O dono do time americano é o David Beckham.'
    ],
    jogadores: ['Lionel Messi|Messi|Leo Messi', 'Luis Suárez|Suarez', 'Sergio Busquets|Busquets', 'Jordi Alba|Alba']
  },
  {
    id: 'goleiros-copa', nivel: 'facil', emoji: '🧤',
    titulo: 'Goleiros titulares do Brasil em Copas (1994 a 2022)',
    dicas: ['Eles usam luvas.', 'Todos jogaram Copa do Mundo pela Seleção.', 'Um deles é o São Marcos do Penta.'],
    jogadores: ['Taffarel|Cláudio Taffarel', 'Marcos|São Marcos', 'Dida', 'Júlio César|Julio Cesar', 'Alisson|Alisson Becker']
  },
  {
    id: 'camisa10', nivel: 'facil', emoji: '🔟',
    titulo: 'Vestiram a camisa 10 do Brasil numa Copa (até 2022)',
    dicas: ['Todos jogaram pela Seleção Brasileira.', 'É o número mais famoso do futebol.', 'O Rei Pelé foi o primeiro a deixar esse número famoso.'],
    jogadores: [
      'Pelé|Pele', 'Rivellino|Rivelino|Roberto Rivellino', 'Zico', 'Silas', 'Raí|Rai',
      'Rivaldo', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Kaká|Kaka', 'Neymar|Neymar Jr|Ney'
    ]
  },
  {
    id: 'melhor-mundo-br', nivel: 'facil', emoji: '🌍',
    titulo: 'Brasileiros(as) eleitos Melhor do Mundo pela FIFA',
    dicas: ['Todos são do Brasil.', 'É um prêmio individual, só para um craque por ano.', 'A Rainha Marta ganhou 6 vezes!'],
    jogadores: [
      'Romário|Romario|Baixinho', 'Ronaldo|Ronaldo Fenômeno|Ronaldo Nazário|R9|Fenômeno', 'Rivaldo',
      'Ronaldinho|Ronaldinho Gaúcho|R10', 'Kaká|Kaka', 'Vinícius Júnior|Vini Jr|Vinicius Junior|Vini|Vinicius', 'Marta'
    ]
  },
  {
    id: 'revelados-fla', nivel: 'facil', emoji: '🔴',
    titulo: 'Revelados pelo Flamengo',
    dicas: ['Começaram a carreira no mesmo clube.', 'É um clube brasileiro do Rio de Janeiro.', 'O clube com a maior torcida do Brasil.'],
    jogadores: [
      'Zico', 'Júnior|Junior|Leovegildo Júnior', 'Leonardo', 'Júlio César|Julio Cesar', 'Adriano|Adriano Imperador',
      'Juan', 'Renato Augusto', 'Vinícius Júnior|Vini Jr|Vinicius Junior|Vini', 'Lucas Paquetá|Paqueta|Paquetá',
      'Reinier', 'João Gomes|Joao Gomes', 'Wesley', 'Hugo Souza', 'Lázaro|Lazaro'
    ]
  },
  {
    id: 'revelados-santos', nivel: 'facil', emoji: '🐳',
    titulo: 'Revelados pelo Santos (Meninos da Vila)',
    dicas: ['Começaram a carreira no mesmo clube.', 'Fica no litoral de São Paulo.', 'Foi o clube do Rei Pelé.'],
    jogadores: [
      'Pelé|Pele', 'Clodoaldo', 'Robinho', 'Diego|Diego Ribas', 'Neymar|Neymar Jr|Ney',
      'Paulo Henrique Ganso|Ganso', 'Gabigol|Gabriel Barbosa', 'Rodrygo|Rodrygo Goes',
      'Marcos Leonardo', 'Kaio Jorge', 'Ângelo|Angelo'
    ]
  },

  // ---------------- MÉDIOS ----------------
  {
    id: 'real-barca', nivel: 'medio', emoji: '⚔️',
    titulo: 'Jogaram no Real Madrid E no Barcelona',
    dicas: [
      'São dois clubes da Espanha.',
      'É o maior clássico do mundo: El Clásico!',
      'O Figo foi chamado de traidor por causa disso.'
    ],
    jogadores: [
      'Luís Figo|Figo|Luis Figo', 'Ronaldo|Ronaldo Fenômeno|Ronaldo Nazário|R9|Fenômeno',
      'Michael Laudrup|Laudrup', "Samuel Eto'o|Eto'o|Etoo|Samuel Etoo", 'Luis Enrique',
      'Bernd Schuster|Schuster', 'Javier Saviola|Saviola', 'Gheorghe Hagi|Hagi',
      'Robert Prosinečki|Prosinecki', 'Julen Lopetegui|Lopetegui', 'Albert Celades|Celades',
      'Alfonso Pérez|Alfonso', 'Ricardo Zamora|Zamora', 'Dani García', 'Miquel Soler',
      'Evaristo|Evaristo de Macedo'
    ]
  },
  {
    id: 'barca-psg', nivel: 'medio', emoji: '🗼',
    titulo: 'Jogaram no Barcelona E no PSG',
    dicas: ['Um clube é da Espanha e o outro da França.', 'Paris e Catalunha.', 'Dois jogadores do trio MSN passaram pelos dois.'],
    jogadores: [
      'Neymar|Neymar Jr|Ney', 'Lionel Messi|Messi', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Daniel Alves|Dani Alves',
      'Maxwell', 'Lucas Digne|Digne', 'Thiago Motta|Motta', 'Zlatan Ibrahimović|Ibrahimovic|Zlatan|Ibra',
      'Ousmane Dembélé|Dembele|Dembélé', 'Rafinha Alcântara|Rafinha'
    ]
  },
  {
    id: 'united-real', nivel: 'medio', emoji: '😈',
    titulo: 'Jogaram no Manchester United E no Real Madrid',
    dicas: ['Um time é da Inglaterra e o outro da Espanha.', 'Os "Diabos Vermelhos" e os "Merengues".', 'O Casemiro trocou um pelo outro em 2022.'],
    jogadores: [
      'Cristiano Ronaldo|CR7|Cristiano', 'David Beckham|Beckham', 'Ruud van Nistelrooy|Van Nistelrooy|Nistelrooy',
      'Gabriel Heinze|Heinze', 'Ángel Di María|Di Maria|Di María', 'Raphaël Varane|Varane', 'Casemiro',
      'Michael Owen|Owen', 'Chicharito|Javier Hernández|Javier Hernandez', 'Sergio Reguilón|Reguilon',
      'Laurie Cunningham|Cunningham'
    ]
  },
  {
    id: 'chelsea-real', nivel: 'medio', emoji: '🦁',
    titulo: 'Jogaram no Chelsea E no Real Madrid',
    dicas: ['Um é de Londres, o outro de Madri.', 'Um veste azul, o outro branco.', 'O goleiro Courtois passou pelos dois.'],
    jogadores: [
      'Thibaut Courtois|Courtois', 'Eden Hazard|Hazard', 'Mateo Kovačić|Kovacic', 'Arjen Robben|Robben',
      'Claude Makélélé|Makelele', 'Geremi', 'Michael Essien|Essien', 'Álvaro Morata|Morata',
      'Lassana Diarra|Lass Diarra|Lass', 'Kepa|Kepa Arrizabalaga', 'Antonio Rüdiger|Rudiger|Rüdiger',
      'Nicolas Anelka|Anelka', 'Marcos Alonso'
    ]
  },
  {
    id: 'penta-2002', nivel: 'medio', emoji: '🖐️',
    titulo: 'Convocados do Brasil campeão da Copa de 2002',
    dicas: ['Todos são da Seleção Brasileira.', 'Ganharam uma Copa do Mundo.', 'Foi o PENTA, na Coreia e no Japão!'],
    jogadores: [
      'Marcos|São Marcos', 'Dida', 'Rogério Ceni|Rogerio Ceni|Ceni', 'Cafu', 'Lúcio|Lucio',
      'Roque Júnior|Roque Junior', 'Edmílson|Edmilson', 'Roberto Carlos', 'Belletti|Juliano Belletti',
      'Anderson Polga|Polga', 'Júnior|Junior', 'Gilberto Silva', 'Kléberson|Kleberson',
      'Ronaldinho|Ronaldinho Gaúcho|R10', 'Rivaldo', 'Juninho Paulista|Juninho', 'Vampeta',
      'Ricardinho', 'Kaká|Kaka', 'Denílson|Denilson', 'Ronaldo|Ronaldo Fenômeno|Ronaldo Nazário|R9|Fenômeno',
      'Edílson|Edilson', 'Luizão|Luizao'
    ]
  },
  {
    id: 'argentina-2022', nivel: 'medio', emoji: '🇦🇷',
    titulo: 'Convocados da Argentina campeã da Copa de 2022',
    dicas: ['Todos são do mesmo país.', 'Ganharam uma Copa do Mundo.', 'Foi no Catar, com final contra a França nos pênaltis.'],
    jogadores: [
      'Emiliano Martínez|Dibu Martínez|Dibu|Emiliano Martinez', 'Franco Armani|Armani', 'Gerónimo Rulli|Rulli',
      'Nahuel Molina|Molina', 'Gonzalo Montiel|Montiel', 'Cristian Romero|Cuti Romero|Romero',
      'Germán Pezzella|Pezzella', 'Nicolás Otamendi|Otamendi', 'Lisandro Martínez|Lisandro',
      'Marcos Acuña|Acuña|Acuna', 'Nicolás Tagliafico|Tagliafico', 'Juan Foyth|Foyth',
      'Rodrigo De Paul|De Paul', 'Leandro Paredes|Paredes', 'Alexis Mac Allister|Mac Allister',
      'Enzo Fernández|Enzo|Enzo Fernandez', 'Guido Rodríguez|Guido Rodriguez', 'Exequiel Palacios|Palacios',
      'Papu Gómez|Alejandro Gómez|Papu Gomez', 'Thiago Almada|Almada', 'Lionel Messi|Messi',
      'Ángel Di María|Di María|Di Maria', 'Lautaro Martínez|Lautaro', 'Julián Álvarez|Julian Alvarez|Alvarez',
      'Paulo Dybala|Dybala', 'Ángel Correa|Correa'
    ]
  },
  {
    id: 'br-no-real', nivel: 'medio', emoji: '🤍',
    titulo: 'Brasileiros que jogaram no Real Madrid',
    dicas: ['Todos são brasileiros.', 'Jogaram num clube da Espanha.', 'O clube que mais ganhou a Champions.'],
    jogadores: [
      'Ronaldo|Ronaldo Fenômeno|Ronaldo Nazário|R9|Fenômeno', 'Roberto Carlos', 'Kaká|Kaka', 'Marcelo',
      'Casemiro', 'Vinícius Júnior|Vini Jr|Vinicius Junior|Vini|Vinicius', 'Rodrygo|Rodrygo Goes',
      'Éder Militão|Militão|Militao|Eder Militao', 'Endrick', 'Robinho', 'Júlio Baptista|Julio Baptista|Baptista',
      'Cicinho', 'Emerson', 'Danilo', 'Sávio|Savio', 'Flávio Conceição|Flavio Conceicao', 'Zé Roberto|Ze Roberto',
      'Reinier', 'Evaristo|Evaristo de Macedo', 'Didi'
    ]
  },

  // ---------------- DIFÍCEIS ----------------
  {
    id: 'liverpool-barca', nivel: 'dificil', emoji: '🎶',
    titulo: 'Jogaram no Liverpool E no Barcelona',
    dicas: ['Um time é da Inglaterra, o outro da Espanha.', '"You\'ll Never Walk Alone" e "Més que un club".', 'Um uruguaio camisa 9 e um brasileiro driblador fizeram esse caminho.'],
    jogadores: [
      'Luis Suárez|Suarez', 'Philippe Coutinho|Coutinho', 'Javier Mascherano|Mascherano',
      'Thiago Alcântara|Thiago|Thiago Alcantara', 'Luis García|Luis Garcia', 'Pepe Reina|Reina'
    ]
  },
  {
    id: 'bayern-barca', nivel: 'dificil', emoji: '🍺',
    titulo: 'Jogaram no Bayern de Munique E no Barcelona',
    dicas: ['Um é da Alemanha, o outro da Espanha.', 'Os dois foram treinados pelo Guardiola.', 'O artilheiro polonês "Lewa" passou pelos dois.'],
    jogadores: [
      'Robert Lewandowski|Lewandowski|Lewa', 'Thiago Alcântara|Thiago|Thiago Alcantara', 'Arturo Vidal|Vidal',
      'Philippe Coutinho|Coutinho', 'Mark van Bommel|Van Bommel', 'João Cancelo|Cancelo|Joao Cancelo'
    ]
  },
  {
    id: 'fla-barca', nivel: 'dificil', emoji: '🔥',
    titulo: 'Jogaram no Flamengo E no Barcelona',
    dicas: ['Um time é do Brasil, o outro da Espanha.', 'O time brasileiro tem a maior torcida do país.', 'Um chileno guerreiro e dois brasileiros lendários.'],
    jogadores: ['Romário|Romario|Baixinho', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Arturo Vidal|Vidal']
  },
  {
    id: 'copa-jogador-tecnico', nivel: 'dificil', emoji: '📋',
    titulo: 'Ganharam a Copa como jogador E como técnico',
    dicas: ['Eles ganharam a Copa do Mundo duas vezes, de jeitos diferentes.', 'Uma vez de chuteira, outra de prancheta.', 'Um brasileiro, um alemão e um francês.'],
    jogadores: ['Zagallo|Mário Zagallo|Mario Zagallo|Velho Lobo', 'Franz Beckenbauer|Beckenbauer|Kaiser', 'Didier Deschamps|Deschamps']
  },
  {
    id: 'cem-gols-ucl', nivel: 'dificil', emoji: '💯',
    titulo: 'Fizeram mais de 100 gols na Champions League',
    dicas: ['Eles fizeram MUITOS gols no mesmo torneio.', 'O torneio tem a musiquinha mais famosa do futebol.', 'Um português, um argentino e um polonês.'],
    jogadores: ['Cristiano Ronaldo|CR7|Cristiano', 'Lionel Messi|Messi', 'Robert Lewandowski|Lewandowski|Lewa']
  },
  {
    id: 'artilheiros-copa', nivel: 'dificil', emoji: '👟',
    titulo: 'Artilheiros de uma Copa do Mundo (1982 a 2022)',
    dicas: ['Eles fizeram muitos gols num mesmo torneio.', 'O torneio acontece de 4 em 4 anos.', 'Eles ganharam a Chuteira de Ouro.'],
    jogadores: [
      'Paolo Rossi|Rossi', 'Gary Lineker|Lineker', 'Salvatore Schillaci|Schillaci|Totò Schillaci',
      'Oleg Salenko|Salenko', 'Hristo Stoichkov|Stoichkov', 'Davor Šuker|Suker|Šuker',
      'Ronaldo|Ronaldo Fenômeno|Ronaldo Nazário|R9|Fenômeno', 'Miroslav Klose|Klose',
      'Thomas Müller|Thomas Muller', 'David Villa|Villa', 'Wesley Sneijder|Sneijder',
      'Diego Forlán|Forlan|Forlán', 'James Rodríguez|James Rodriguez|James', 'Harry Kane|Kane',
      'Kylian Mbappé|Mbappe|Mbappé'
    ]
  },
  {
    id: 'bola-de-ouro', nivel: 'dificil', emoji: '🏅',
    titulo: 'Ganharam a Bola de Ouro (até 2025)',
    dicas: ['É um prêmio individual.', 'É entregue pela revista France Football.', 'O Messi ganhou 8 vezes.'],
    jogadores: [
      'Cristiano Ronaldo|CR7|Cristiano', 'Lionel Messi|Messi', 'Luka Modrić|Modric|Modrić', 'Karim Benzema|Benzema',
      'Rodri', 'Ousmane Dembélé|Dembele|Dembélé', 'Kaká|Kaka', 'Fabio Cannavaro|Cannavaro',
      'Ronaldinho|Ronaldinho Gaúcho|R10', 'Andriy Shevchenko|Shevchenko|Sheva', 'Pavel Nedvěd|Nedved',
      'Ronaldo|Ronaldo Fenômeno|Ronaldo Nazário|R9|Fenômeno', 'Michael Owen|Owen', 'Luís Figo|Figo|Luis Figo',
      'Rivaldo', 'Zinedine Zidane|Zidane|Zizou', 'Matthias Sammer|Sammer', 'George Weah|Weah',
      'Hristo Stoichkov|Stoichkov', 'Roberto Baggio|Baggio', 'Jean-Pierre Papin|Papin',
      'Lothar Matthäus|Matthaus|Matthäus', 'Marco van Basten|Van Basten', 'Ruud Gullit|Gullit',
      'Igor Belanov|Belanov', 'Michel Platini|Platini', 'Paolo Rossi|Rossi', 'Karl-Heinz Rummenigge|Rummenigge',
      'Kevin Keegan|Keegan', 'Allan Simonsen|Simonsen', 'Oleg Blokhin|Blokhin', 'Johan Cruyff|Cruyff',
      'Franz Beckenbauer|Beckenbauer', 'Gerd Müller|Gerd Muller', 'Gianni Rivera|Rivera', 'George Best',
      'Bobby Charlton|Charlton', 'Flórián Albert', 'Eusébio|Eusebio', 'Denis Law', 'Lev Yashin|Yashin',
      'Josef Masopust|Masopust', 'Omar Sívori|Sivori', 'Luis Suárez Miramontes', 'Raymond Kopa|Kopa',
      'Alfredo Di Stéfano|Di Stefano|Di Stéfano', 'Stanley Matthews|Matthews'
    ]
  }
];

/* Nomes extras só para o autocompletar (não pertencem a nenhum tema específico).
   Servem para o jogador poder chutar qualquer craque. */
window.EXTRAS_JOGADORES = [
  'Erling Haaland', 'Mohamed Salah', 'Lamine Yamal', 'Jude Bellingham', 'Kevin De Bruyne', 'Antoine Griezmann',
  'Toni Kroos', 'Pedri', 'Gavi', 'Manuel Neuer', 'Gianluigi Buffon', 'Andrea Pirlo', 'Francesco Totti',
  'Paolo Maldini', 'Xavi', 'Andrés Iniesta', 'Carles Puyol', 'Gerard Piqué', 'Sergio Ramos', 'Iker Casillas',
  'Wayne Rooney', 'Steven Gerrard', 'Frank Lampard', 'Didier Drogba', 'Thierry Henry', 'Diego Maradona',
  'Endrick', 'Estêvão', 'Raphinha', 'Gabriel Jesus', 'Richarlison', 'Bruno Guimarães', 'Marquinhos',
  'Thiago Silva', 'Ederson', 'Hulk', 'Giorgian de Arrascaeta', 'Pedro', 'Everton Ribeiro', 'Gabriel Martinelli',
  'Bukayo Saka', 'Phil Foden', 'Declan Rice', 'Florian Wirtz', 'Jamal Musiala', 'Vitinha', 'Bruno Fernandes',
  'Bernardo Silva', 'Rafael Leão', 'Achraf Hakimi', 'Victor Osimhen', 'Sadio Mané', 'Son Heung-min',
  'Antoine Semenyo', 'Cole Palmer', 'Federico Valverde', 'Darwin Núñez', 'Edinson Cavani', 'Sergio Agüero',
  'Carlos Tevez', 'Juan Román Riquelme', 'Gabriel Batistuta', 'Hernán Crespo', 'Fernando Torres', 'David Silva',
  'Arjen Robben', 'Franck Ribéry', 'Bastian Schweinsteiger', 'Philipp Lahm', 'Mesut Özil', 'Gareth Bale',
  'Paul Pogba', 'N\'Golo Kanté', 'Patrice Evra', 'Rio Ferdinand', 'Paul Scholes', 'Ryan Giggs', 'Eric Cantona',
  'Zico', 'Sócrates', 'Garrincha', 'Romário', 'Bebeto', 'Cafu', 'Adriano', 'Fred', 'Hernanes', 'Oscar',
  'Willian', 'David Luiz', 'Fernandinho', 'Paulinho', 'Firmino', 'Douglas Costa', 'Alex Sandro', 'Danilo'
];
