/* =========================================================
   TEMAS DO MODO "TEMA SECRETO ⚽" (60+ Temas Pré-Preenchidos!)
   + DADOS DOS JOGOS EXTRAS DO HUB ("Quem Sou Eu?", "Mais ou Menos", "Quiz")
   ========================================================= */
window.CATEGORIAS_TEMAS = [
  { id: 'todas', nome: '🌟 Todas' },
  { id: 'brasil', nome: '🇧🇷 Futebol Brasileiro' },
  { id: 'clubes', nome: '🇪🇺 Clubes Europeus' },
  { id: 'selecoes', nome: '🏆 Copas & Seleções' },
  { id: 'lendas', nome: '👑 Lendas & Prêmios' },
  { id: 'curiosidades', nome: '🤯 Curiosidades' }
];

window.TEMAS = [
  // ================= FÁCEIS =================
  {
    id: 'msn-bbc', nivel: 'facil', cat: 'clubes', emoji: '🔱',
    titulo: 'Fizeram parte do trio MSN ou do trio BBC',
    dicas: ['São dois trios de ataque históricos.', 'Um trio jogava no Barcelona e o outro no Real Madrid.', 'Iniciais: M-S-N e B-B-C.'],
    jogadores: ['Lionel Messi|Messi|Leo Messi', 'Luis Suárez|Suarez|Luisito', 'Neymar|Neymar Jr|Ney', 'Gareth Bale|Bale', 'Karim Benzema|Benzema', 'Cristiano Ronaldo|CR7|Cristiano']
  },
  {
    id: 'barca-miami', nivel: 'facil', cat: 'clubes', emoji: '🦩',
    titulo: 'Ex-Barcelona que foram jogar juntos no Inter Miami',
    dicas: ['Brilharam juntos na Espanha.', 'Depois foram atuar nos Estados Unidos.', 'O time americano veste rosa e tem Beckham como dono.'],
    jogadores: ['Lionel Messi|Messi', 'Luis Suárez|Suarez', 'Sergio Busquets|Busquets', 'Jordi Alba|Alba']
  },
  {
    id: 'goleiros-copa', nivel: 'facil', cat: 'selecoes', emoji: '🧤',
    titulo: 'Goleiros titulares do Brasil em Copas (1990 a 2022)',
    dicas: ['Todos jogam na mesma posição.', 'Defenderam a Seleção Brasileira em Copas.', 'Vai de Taffarel até Alisson.'],
    jogadores: ['Taffarel|Cláudio Taffarel', 'Marcos|São Marcos', 'Dida', 'Júlio César|Julio Cesar', 'Alisson|Alisson Becker']
  },
  {
    id: 'camisa10', nivel: 'facil', cat: 'selecoes', emoji: '🔟',
    titulo: 'Vestiram a camisa 10 do Brasil numa Copa do Mundo',
    dicas: ['Todos jogaram pela Seleção Brasileira.', 'Usaram o número mais místico do futebol.', 'Pelé, Zico, Rivaldo, Ronaldinho, Kaká e Neymar estão na lista.'],
    jogadores: ['Pelé|Pele', 'Rivellino|Rivelino', 'Zico', 'Silas', 'Raí|Rai', 'Rivaldo', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Kaká|Kaka', 'Neymar|Neymar Jr|Ney']
  },
  {
    id: 'melhor-mundo-br', nivel: 'facil', cat: 'lendas', emoji: '🌍',
    titulo: 'Brasileiros(as) eleitos Melhor do Mundo pela FIFA',
    dicas: ['Todos nasceram no Brasil.', 'Ganharam o prêmio máximo individual da FIFA.', 'Romário, Ronaldo, Rivaldo, Ronaldinho, Kaká, Vini Jr e Marta!'],
    jogadores: ['Romário|Romario|Baixinho', 'Ronaldo|Ronaldo Fenômeno|R9|Fenômeno', 'Rivaldo', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Kaká|Kaka', 'Vinícius Júnior|Vini Jr|Vinicius Junior|Vini', 'Marta']
  },
  {
    id: 'revelados-fla', nivel: 'facil', cat: 'brasil', emoji: '🔴',
    titulo: 'Revelados na base do Flamengo ("Garotos do Ninho")',
    dicas: ['Começaram a carreira no mesmo clube brasileiro.', 'É um clube do Rio de Janeiro.', 'Vini Jr, Paquetá, Adriano Imperador e Zico saíram de lá.'],
    jogadores: ['Zico', 'Júnior|Junior', 'Leonardo', 'Júlio César|Julio Cesar', 'Adriano|Adriano Imperador', 'Juan', 'Renato Augusto', 'Vinícius Júnior|Vini Jr|Vinicius Junior|Vini', 'Lucas Paquetá|Paqueta|Paquetá', 'Reinier', 'João Gomes|Joao Gomes', 'Wesley', 'Hugo Souza', 'Matheus França']
  },
  {
    id: 'revelados-santos', nivel: 'facil', cat: 'brasil', emoji: '🐳',
    titulo: 'Revelados pelo Santos ("Meninos da Vila")',
    dicas: ['Subiram da base do mesmo clube paulista.', 'O estádio é a Vila Belmiro.', 'De Pelé a Neymar e Rodrygo.'],
    jogadores: ['Pelé|Pele', 'Clodoaldo', 'Robinho', 'Diego|Diego Ribas', 'Elano', 'Neymar|Neymar Jr|Ney', 'Paulo Henrique Ganso|Ganso', 'Gabigol|Gabriel Barbosa', 'Rodrygo|Rodrygo Goes', 'Marcos Leonardo', 'Kaio Jorge', 'Ângelo|Angelo']
  },
  {
    id: 'revelados-palmeiras', nivel: 'facil', cat: 'brasil', emoji: '🐷',
    titulo: 'Revelados na base do Palmeiras ("Crias da Academia")',
    dicas: ['Começaram num grande clube de São Paulo.', 'O clube veste verde.', 'Gabriel Jesus, Endrick e Estêvão saíram de lá.'],
    jogadores: ['Gabriel Jesus', 'Endrick', 'Estêvão|Estevao', 'Danilo', 'Patrick de Paula', 'Gabriel Menino', 'Luis Guilherme', 'Vitor Reis', 'Marcos|São Marcos', 'Vágner Love|Vagner Love']
  },
  {
    id: 'revelados-flu', nivel: 'facil', cat: 'brasil', emoji: '🇭🇺',
    titulo: 'Revelados em Xerém (base do Fluminense)',
    dicas: ['Saíram da categoria de base de um clube carioca.', 'A base fica em Xerém.', 'Marcelo, Thiago Silva, Pedro e André vieram de lá.'],
    jogadores: ['Thiago Silva', 'Marcelo', 'Pedro', 'André|Andre', 'Luiz Henrique', 'João Pedro|Joao Pedro', 'Richarlison', 'Fabinho', 'Rafael', 'Fábio|Fabio', 'Gerson', 'Arias', 'Cano', 'Wellington Nem', 'Matheus Martins', 'Evanilson']
  },
  {
    id: 'revelados-vasco', nivel: 'facil', cat: 'brasil', emoji: '💢',
    titulo: 'Revelados pelo Vasco da Gama',
    dicas: ['Começaram num clube tradicional do Rio de Janeiro.', 'O estádio é São Januário.', 'Romário, Edmundo, Roberto Dinamite e Philippe Coutinho.'],
    jogadores: ['Roberto Dinamite|Dinamite', 'Romário|Romario', 'Edmundo', 'Philippe Coutinho|Coutinho', 'Douglas Luiz', 'Alex Teixeira', 'Paulinho', 'Talles Magno', 'Andrey Santos', 'Rayan', 'Felipe', 'Pedrinho', 'Carlos Germano']
  },
  {
    id: 'revelados-spfc', nivel: 'facil', cat: 'brasil', emoji: '🇾🇪',
    titulo: 'Revelados em Cotia / base do São Paulo',
    dicas: ['Saíram da base do Tricolor Paulista.', 'O centro de formação fica em Cotia.', 'Kaká, Casemiro, Lucas Moura e Antony saíram de lá.'],
    jogadores: ['Kaká|Kaka', 'Casemiro', 'Lucas Moura|Lucas', 'Antony', 'Éder Militão|Militao|Militão', 'Beraldo|Lucas Beraldo', 'David Neres', 'Hernanes', 'Oscar', 'Júlio Baptista|Julio Baptista', 'Cafu', 'Rogério Ceni|Rogerio Ceni', 'Denilson|Denílson']
  },
  {
    id: 'revelados-corinthians', nivel: 'facil', cat: 'brasil', emoji: '🦅',
    titulo: 'Revelados na base do Corinthians ("Filhos do Terrão")',
    dicas: ['Começaram no Parque São Jorge.', 'Conhecidos como Filhos do Terrão.', 'Rivellino, Deco, Marquinhos, Willian e Murillo.'],
    jogadores: ['Rivellino|Rivelino', 'Casagrande', 'Viola', 'Sylvinho', 'Edu Gaspar', 'Deco', 'Willian', 'Jô|Jo', 'Marquinhos', 'Malcom', 'Guilherme Arana|Arana', 'Murillo', 'Gabriel Moscardo|Moscardo', 'Wesley']
  },
  {
    id: 'arabia-saudita', nivel: 'facil', cat: 'curiosidades', emoji: '🐪',
    titulo: 'Craques que foram jogar na Arábia Saudita',
    dicas: ['Saíram da Europa por contratos milionários.', 'Foram jogar no Oriente Médio a partir de 2023.', 'CR7, Neymar, Benzema e Mané estão na lista.'],
    jogadores: ['Cristiano Ronaldo|CR7|Cristiano', 'Neymar|Neymar Jr|Ney', 'Karim Benzema|Benzema', 'Sadio Mané|Mane|Mané', 'Roberto Firmino|Firmino', 'Riyad Mahrez|Mahrez', "N'Golo Kanté|Kante|Kanté", 'Fabinho', 'João Cancelo|Cancelo', 'Sergej Milinković-Savić|Milinkovic-Savic', 'Aleksandar Mitrović|Mitrovic', 'Bono', 'Malcom', 'Talisca|Anderson Talisca', 'Bento', 'Roger Ibañez']
  },
  {
    id: '100-gols-selecao', nivel: 'facil', cat: 'selecoes', emoji: '💯',
    titulo: 'Marcaram mais de 100 gols por suas Seleções',
    dicas: ['São os maiores artilheiros de seleções da história.', 'Apenas três homens conseguiram essa marca.', 'Um português, um argentino e um iraniano!'],
    jogadores: ['Cristiano Ronaldo|CR7|Cristiano', 'Lionel Messi|Messi', 'Ali Daei']
  },

  // ================= MÉDIOS =================
  {
    id: 'real-barca', nivel: 'medio', cat: 'clubes', emoji: '⚔️',
    titulo: 'Jogaram no Real Madrid E no Barcelona',
    dicas: ['Atuaram nos dois maiores clubes da Espanha.', 'Jogaram dos dois lados do El Clásico!', 'Figo, Ronaldo Fenômeno, Eto\'o e Luis Enrique estão na lista.'],
    jogadores: ['Luís Figo|Figo|Luis Figo', 'Ronaldo|Ronaldo Fenômeno|R9|Fenômeno', 'Michael Laudrup|Laudrup', "Samuel Eto'o|Eto'o|Etoo", 'Luis Enrique', 'Bernd Schuster|Schuster', 'Javier Saviola|Saviola', 'Gheorghe Hagi|Hagi', 'Robert Prosinečki|Prosinecki', 'Julen Lopetegui|Lopetegui', 'Albert Celades|Celades', 'Alfonso Pérez|Alfonso', 'Ricardo Zamora|Zamora', 'Evaristo|Evaristo de Macedo']
  },
  {
    id: 'barca-psg', nivel: 'medio', cat: 'clubes', emoji: '🗼',
    titulo: 'Jogaram no Barcelona E no PSG',
    dicas: ['Um clube fica na Espanha e o outro na França.', 'Catalunha e Paris.', 'Messi, Neymar, Ronaldinho, Ibra e Dembélé passaram pelos dois.'],
    jogadores: ['Neymar|Neymar Jr|Ney', 'Lionel Messi|Messi', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Daniel Alves|Dani Alves', 'Maxwell', 'Lucas Digne|Digne', 'Thiago Motta|Motta', 'Zlatan Ibrahimović|Ibrahimovic|Zlatan|Ibra', 'Ousmane Dembélé|Dembele|Dembélé', 'Rafinha Alcântara|Rafinha', 'Xavi Simons', 'Arnau Tenas']
  },
  {
    id: 'real-psg', nivel: 'medio', cat: 'clubes', emoji: '👑',
    titulo: 'Jogaram no Real Madrid E no PSG',
    dicas: ['Passaram pelo maior da Espanha e pelo gigante de Paris.', 'Mbappé fez essa troca recentemente.', 'Beckham, Sergio Ramos, Di María, Navas e Hakimi também!'],
    jogadores: ['Kylian Mbappé|Mbappe|Mbappé', 'Sergio Ramos|Ramos', 'Ángel Di María|Di Maria|Di María', 'Keylor Navas|Navas', 'Achraf Hakimi|Hakimi', 'David Beckham|Beckham', 'Claude Makélélé|Makelele', 'Nicolas Anelka|Anelka', 'Marco Asensio|Asensio', 'Jesé|Jese', 'Lassana Diarra|Lass Diarra', 'Gabriel Heinze|Heinze']
  },
  {
    id: 'united-real', nivel: 'medio', cat: 'clubes', emoji: '😈',
    titulo: 'Jogaram no Manchester United E no Real Madrid',
    dicas: ['Um clube é inglês (Old Trafford) e o outro espanhol (Bernabéu).', 'Diabos Vermelhos e Merengues.', 'CR7, Beckham, Casemiro, Varane e Di María passaram pelos dois.'],
    jogadores: ['Cristiano Ronaldo|CR7|Cristiano', 'David Beckham|Beckham', 'Ruud van Nistelrooy|Van Nistelrooy', 'Gabriel Heinze|Heinze', 'Ángel Di María|Di Maria|Di María', 'Raphaël Varane|Varane', 'Casemiro', 'Michael Owen|Owen', 'Chicharito|Javier Hernández', 'Sergio Reguilón|Reguilon']
  },
  {
    id: 'chelsea-real', nivel: 'medio', cat: 'clubes', emoji: '🦁',
    titulo: 'Jogaram no Chelsea E no Real Madrid',
    dicas: ['Um time é azul de Londres, o outro branco de Madri.', 'Courtois, Hazard e Rüdiger fizeram esse caminho.', 'Robben, Makelele, Kovacic e Morata também.'],
    jogadores: ['Thibaut Courtois|Courtois', 'Eden Hazard|Hazard', 'Mateo Kovačić|Kovacic', 'Arjen Robben|Robben', 'Claude Makélélé|Makelele', 'Michael Essien|Essien', 'Álvaro Morata|Morata', 'Kepa|Kepa Arrizabalaga', 'Antonio Rüdiger|Rudiger|Rüdiger', 'Nicolas Anelka|Anelka', 'Marcos Alonso', 'Ricardo Carvalho']
  },
  {
    id: 'milan-inter', nivel: 'medio', cat: 'clubes', emoji: '🐍',
    titulo: 'Jogaram no Milan E na Inter de Milão',
    dicas: ['Dividiram o mesmo estádio (San Siro / Giuseppe Meazza).', 'Derby della Madonnina na Itália.', 'Ronaldo, Ibra, Pirlo, Seedorf, Balotelli e Çalhanoğlu!'],
    jogadores: ['Ronaldo|Ronaldo Fenômeno|R9|Fenômeno', 'Zlatan Ibrahimović|Ibrahimovic|Ibra', 'Andrea Pirlo|Pirlo', 'Clarence Seedorf|Seedorf', 'Roberto Baggio|Baggio', 'Hernán Crespo|Crespo', 'Christian Vieri|Vieri', 'Mario Balotelli|Balotelli', 'Hakan Çalhanoğlu|Calhanoglu', 'Leonardo Bonucci|Bonucci', 'Antonio Cassano|Cassano', 'Edgar Davids|Davids', 'Patrick Vieira|Vieira', 'Sulley Muntari|Muntari']
  },
  {
    id: 'city-barca', nivel: 'medio', cat: 'clubes', emoji: '🩵',
    titulo: 'Jogaram no Manchester City E no Barcelona',
    dicas: ['Dois clubes marcados pelo estilo de Pep Guardiola.', 'Inglaterra e Espanha.', 'Agüero, Gündoğan, Yaya Touré, Cancelo e Ferran Torres.'],
    jogadores: ['Sergio Agüero|Aguero|Kun Agüero', 'İlkay Gündoğan|Gundogan|Gündogan', 'Yaya Touré|Yaya Toure', 'João Cancelo|Cancelo', 'Ferran Torres', 'Eric García|Eric Garcia', 'Claudio Bravo|Bravo', 'Nolito', 'Sylvinho', 'Geovanni']
  },
  {
    id: 'chelsea-arsenal', nivel: 'medio', cat: 'clubes', emoji: '💂',
    titulo: 'Jogaram nos rivais de Londres: Chelsea E Arsenal',
    dicas: ['Dois gigantes da mesma cidade na Premier League.', 'Um veste azul e o outro vermelho e branco.', 'Cech, David Luiz, Jorginho, Havertz, Willian, Giroud e Fabregas!'],
    jogadores: ['Cesc Fàbregas|Fabregas', 'Petr Čech|Cech', 'Ashley Cole', 'Olivier Giroud|Giroud', 'David Luiz', 'Willian', 'Jorginho', 'Kai Havertz|Havertz', 'Raheem Sterling|Sterling', 'Pierre-Emerick Aubameyang|Aubameyang', 'Nicolas Anelka|Anelka', 'William Gallas|Gallas']
  },
  {
    id: 'dortmund-bayern', nivel: 'medio', cat: 'clubes', emoji: '🥨',
    titulo: 'Jogaram no Borussia Dortmund E no Bayern de Munique',
    dicas: ['É o maior clássico da Alemanha (Der Klassiker).', 'Vários trocaram o amarelo pelo vermelho.', 'Lewandowski, Götze, Hummels e Guerreiro!'],
    jogadores: ['Robert Lewandowski|Lewandowski|Lewa', 'Mario Götze|Gotze|Götze', 'Mats Hummels|Hummels', 'Raphaël Guerreiro|Guerreiro', 'Niklas Süle|Sule', 'Marcel Sabitzer|Sabitzer', 'Ivan Perišić|Perisic', 'Torsten Frings|Frings']
  },
  {
    id: 'penta-2002', nivel: 'medio', cat: 'selecoes', emoji: '🖐️',
    titulo: 'Convocados do Brasil campeão da Copa de 2002',
    dicas: ['Todos são brasileiros.', 'Foram campeões mundiais na Ásia (Coreia e Japão).', 'A família Scolari do Pentacampeonato!'],
    jogadores: ['Marcos|São Marcos', 'Dida', 'Rogério Ceni|Rogerio Ceni|Ceni', 'Cafu', 'Lúcio|Lucio', 'Roque Júnior|Roque Junior', 'Edmílson|Edmilson', 'Roberto Carlos', 'Belletti', 'Anderson Polga|Polga', 'Júnior|Junior', 'Gilberto Silva', 'Kléberson|Kleberson', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Rivaldo', 'Juninho Paulista', 'Vampeta', 'Ricardinho', 'Kaká|Kaka', 'Denílson|Denilson', 'Ronaldo|Ronaldo Fenômeno|R9|Fenômeno', 'Edílson|Edilson', 'Luizão|Luizao']
  },
  {
    id: 'tetra-1994', nivel: 'medio', cat: 'selecoes', emoji: '4️⃣',
    titulo: 'Convocados do Brasil campeão da Copa de 1994',
    dicas: ['Foram campeões nos Estados Unidos.', 'Final nos pênaltis contra a Itália.', 'Romário, Bebeto, Dunga, Taffarel e um jovem Ronaldo de 17 anos!'],
    jogadores: ['Taffarel', 'Zetti', 'Gilmar', 'Jorginho', 'Cafu', 'Aldair', 'Márcio Santos|Marcio Santos', 'Ricardo Rocha', 'Ronaldão|Rondaldao', 'Branco', 'Leonardo', 'Mauro Silva', 'Dunga', 'Mazinho', 'Zinho', 'Raí|Rai', 'Paulo Sérgio|Paulo Sergio', 'Romário|Romario', 'Bebeto', 'Müller|Muller', 'Viola', 'Ronaldo|Ronaldo Fenômeno|R9']
  },
  {
    id: 'argentina-2022', nivel: 'medio', cat: 'selecoes', emoji: '🇦🇷',
    titulo: 'Convocados da Argentina campeã da Copa de 2022',
    dicas: ['Ganharam o tricampeonato mundial no Catar.', 'Venceram a França nos pênaltis.', 'Messi, Di María, Dibu Martínez, Julian Álvarez e Enzo Fernández.'],
    jogadores: ['Emiliano Martínez|Dibu Martínez|Dibu', 'Franco Armani|Armani', 'Gerónimo Rulli|Rulli', 'Nahuel Molina|Molina', 'Gonzalo Montiel|Montiel', 'Cristian Romero|Cuti Romero|Romero', 'Germán Pezzella|Pezzella', 'Nicolás Otamendi|Otamendi', 'Lisandro Martínez|Lisandro', 'Marcos Acuña|Acuna', 'Nicolás Tagliafico|Tagliafico', 'Juan Foyth|Foyth', 'Rodrigo De Paul|De Paul', 'Leandro Paredes|Paredes', 'Alexis Mac Allister|Mac Allister', 'Enzo Fernández|Enzo', 'Guido Rodríguez', 'Exequiel Palacios|Palacios', 'Papu Gómez|Papu Gomez', 'Thiago Almada|Almada', 'Lionel Messi|Messi', 'Ángel Di María|Di Maria|Di María', 'Lautaro Martínez|Lautaro', 'Julián Álvarez|Julian Alvarez|Alvarez', 'Paulo Dybala|Dybala', 'Ángel Correa|Correa']
  },
  {
    id: 'franca-2018', nivel: 'medio', cat: 'selecoes', emoji: '🐓',
    titulo: 'Campeões da Copa de 2018 pela França',
    dicas: ['Ganharam a Copa na Rússia.', 'Venceram a Croácia por 4 a 2 na final.', 'Mbappé, Griezmann, Pogba, Kanté, Giroud e Lloris!'],
    jogadores: ['Kylian Mbappé|Mbappe|Mbappé', 'Antoine Griezmann|Griezmann', 'Paul Pogba|Pogba', "N'Golo Kanté|Kante|Kanté", 'Olivier Giroud|Giroud', 'Hugo Lloris|Lloris', 'Raphaël Varane|Varane', 'Samuel Umtiti|Umtiti', 'Lucas Hernández|Lucas Hernandez', 'Benjamin Pavard|Pavard', 'Blaise Matuidi|Matuidi', 'Ousmane Dembélé|Dembele|Dembélé', 'Corentin Tolisso|Tolisso', 'Nabil Fekir|Fekir', 'Steven Nzonzi', 'Adil Rami|Rami']
  },
  {
    id: 'br-no-real', nivel: 'medio', cat: 'clubes', emoji: '🤍',
    titulo: 'Brasileiros que jogaram no Real Madrid',
    dicas: ['Todos nasceram no Brasil.', 'Vestiram a camisa merengue na Espanha.', 'Roberto Carlos, Marcelo, Ronaldo, Kaká, Casemiro, Vini Jr, Rodrygo, Militão e Endrick!'],
    jogadores: ['Ronaldo|Ronaldo Fenômeno|R9|Fenômeno', 'Roberto Carlos', 'Kaká|Kaka', 'Marcelo', 'Casemiro', 'Vinícius Júnior|Vini Jr|Vinicius Junior|Vini', 'Rodrygo|Rodrygo Goes', 'Éder Militão|Militão|Militao', 'Endrick', 'Robinho', 'Júlio Baptista|Julio Baptista', 'Cicinho', 'Emerson', 'Danilo', 'Sávio|Savio', 'Flávio Conceição', 'Zé Roberto|Ze Roberto', 'Reinier', 'Evaristo|Evaristo de Macedo']
  },
  {
    id: 'br-no-barca', nivel: 'medio', cat: 'clubes', emoji: '🔵',
    titulo: 'Brasileiros que jogaram no Barcelona',
    dicas: ['Todos são brasileiros.', 'Jogaram no Camp Nou.', 'Romário, Ronaldo, Rivaldo, Ronaldinho, Neymar, Dani Alves e Raphinha!'],
    jogadores: ['Romário|Romario', 'Ronaldo|Ronaldo Fenômeno|R9', 'Rivaldo', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Neymar|Neymar Jr|Ney', 'Daniel Alves|Dani Alves', 'Raphinha', 'Philippe Coutinho|Coutinho', 'Paulinho', 'Arthur|Arthur Melo', 'Malcom', 'Vitor Roque', 'Belletti', 'Edmílson|Edmilson', 'Sylvinho', 'Adriano|Adriano Correia', 'Maxwell', 'Thiago Motta', 'Sonny Anderson', 'Giovanni']
  },
  {
    id: 'fla-2019', nivel: 'medio', cat: 'brasil', emoji: '🏆',
    titulo: 'Time histórico do Flamengo de 2019 (Jorge Jesus)',
    dicas: ['Ganharam Brasileirão e Libertadores no mesmo fim de semana.', 'Treinados por Jorge Jesus.', 'Diego Alves, Rafinha, Filipe Luís, Gerson, Arrascaeta, BH e Gabigol!'],
    jogadores: ['Diego Alves', 'Rafinha', 'Rodrigo Caio', 'Pablo Marí|Pablo Mari', 'Filipe Luís|Filipe Luis', 'Willian Arão|Arao', 'Gerson', 'Éverton Ribeiro|Everton Ribeiro', 'Arrascaeta|De Arrascaeta', 'Bruno Henrique|BH', 'Gabigol|Gabriel Barbosa', 'Diego|Diego Ribas', 'Vitinho', 'Reinier', 'Rodinei', 'Renê|Rene']
  },
  {
    id: 'corinthians-2012', nivel: 'medio', cat: 'brasil', emoji: '🌎',
    titulo: 'Campeões da Libertadores/Mundial pelo Corinthians em 2012',
    dicas: ['Time comandado por Tite.', 'Venceu o Boca Juniors e depois o Chelsea no Japão.', 'Cássio, Paulinho, Danilo, Emerson Sheik e Guerrero!'],
    jogadores: ['Cássio|Cassio', 'Alessandro', 'Chicão|Chicao', 'Leandro Castán|Castan', 'Paulo André|Paulo Andre', 'Fábio Santos|Fabio Santos', 'Ralf', 'Paulinho', 'Danilo', 'Alex', 'Jorge Henrique', 'Emerson Sheik|Sheik', 'Paolo Guerrero|Guerrero', 'Romarinho', 'Douglas']
  },
  {
    id: 'palmeiras-abel', nivel: 'medio', cat: 'brasil', emoji: '💚',
    titulo: 'Bicampeões da Libertadores pelo Palmeiras (2020/2021)',
    dicas: ['Venceram Santos e Flamengo nas finais.', 'Comandados por Abel Ferreira.', 'Weverton, Gómez, Veiga, Dudu, Rony e Deyverson!'],
    jogadores: ['Weverton', 'Marcos Rocha', 'Gustavo Gómez|Gustavo Gomez|Gomez', 'Luan', 'Matías Viña|Vina', 'Piquerez', 'Danilo', 'Zé Rafael|Ze Rafael', 'Patrick de Paula', 'Gabriel Menino', 'Raphael Veiga|Veiga', 'Gustavo Scarpa|Scarpa', 'Dudu', 'Rony', 'Luiz Adriano', 'Breno Lopes', 'Deyverson', 'Willian Bigode', 'Felipe Melo']
  },
  {
    id: 'fla-vasco', nivel: 'medio', cat: 'brasil', emoji: 'Carioca',
    titulo: 'Jogaram nos rivais Flamengo E Vasco',
    dicas: ['Vestiram as camisas do Clássico dos Milhões no Rio.', 'Romário, Bebeto e Edmundo fizeram isso!', 'Petkovic, Felipe e Diego Souza também.'],
    jogadores: ['Romário|Romario', 'Bebeto', 'Edmundo', 'Petković|Petkovic|Pet', 'Felipe', 'Betinho', 'Diego Souza', 'Léo Moura|Leo Moura', 'Jean', 'Tita']
  },
  {
    id: 'cor-pal', nivel: 'medio', cat: 'brasil', emoji: 'Paulista',
    titulo: 'Jogaram nos rivais Corinthians E Palmeiras',
    dicas: ['Atuaram dos dois lados do Dérbi Paulista.', 'Rivellino, Edmundo, Roberto Carlos e Willian Bigode estão na lista.', 'Luizão e Vágner Love também!'],
    jogadores: ['Rivellino|Rivelino', 'Edmundo', 'Neto|Craque Neto', 'Roberto Carlos', 'Luizão|Luizao', 'Vágner Love|Vagner Love', 'Willian|Willian Bigode', 'Bruno Henrique', 'Edu Dracena', 'Viola', 'Paulo Nunes', 'César Sampaio|Cesar Sampaio', 'Rincón|Freddy Rincon', 'Gabriel']
  },
  {
    id: 'gre-nal', nivel: 'medio', cat: 'brasil', emoji: '🧉',
    titulo: 'Jogaram no Grêmio E no Internacional (Gre-Nal)',
    dicas: ['Jogaram nos dois gigantes do Rio Grande do Sul.', 'Um é azul e o outro é vermelho.', 'Giuliano, Tinga e Mario Sérgio passaram pelos dois!'],
    jogadores: ['Tinga', 'Giuliano', 'Mário Sérgio|Mario Sergio', 'Edinho', 'Christian', 'Anderson', 'Fabiano', 'Edenílson|Edenilson', 'Paulo Cézar Caju']
  },
  {
    id: 'galo-cruzeiro', nivel: 'medio', cat: 'brasil', emoji: '🧀',
    titulo: 'Jogaram no Atlético-MG E no Cruzeiro',
    dicas: ['Jogaram nos dois maiores clubes de Minas Gerais.', 'Galo e Raposa.', 'Fred, Diego Tardelli e Guilherme passaram pelos dois!'],
    jogadores: ['Fred', 'Diego Tardelli|Tardelli', 'Guilherme', 'Fábio Júnior|Fabio Junior', 'Leonardo Silva', ' Éder Aleixo', 'Nelinho', 'Toninho Cerezo', 'procópio']
  },

  // ================= DIFÍCEIS =================
  {
    id: 'liverpool-barca', nivel: 'dificil', cat: 'clubes', emoji: '🎶',
    titulo: 'Jogaram no Liverpool E no Barcelona',
    dicas: ['Anfield e Camp Nou.', 'Suárez e Coutinho saíram de um direto pro outro.', 'Mascherano e Thiago Alcântara também!'],
    jogadores: ['Luis Suárez|Suarez', 'Philippe Coutinho|Coutinho', 'Javier Mascherano|Mascherano', 'Thiago Alcântara|Thiago', 'Luis García|Luis Garcia', 'Pepe Reina|Reina', 'Boudewijn Zenden']
  },
  {
    id: 'bayern-barca', nivel: 'dificil', cat: 'clubes', emoji: '🍺',
    titulo: 'Jogaram no Bayern de Munique E no Barcelona',
    dicas: ['Gigante da Alemanha e gigante da Catalunha.', 'Lewandowski, Thiago Alcântara, Vidal e Coutinho!', 'Cancelo e Van Bommel também.'],
    jogadores: ['Robert Lewandowski|Lewandowski|Lewa', 'Thiago Alcântara|Thiago', 'Arturo Vidal|Vidal', 'Philippe Coutinho|Coutinho', 'Mark van Bommel|Van Bommel', 'João Cancelo|Cancelo', 'Patrik Andersson']
  },
  {
    id: 'bayern-real', nivel: 'dificil', cat: 'clubes', emoji: '🏰',
    titulo: 'Jogaram no Bayern de Munique E no Real Madrid',
    dicas: ['Os dois maiores campeões da Alemanha e da Espanha.', 'Toni Kroos e Xabi Alonso trocaram um pelo outro.', 'Robben, James Rodríguez, Alaba e Zé Roberto também!'],
    jogadores: ['Toni Kroos|Kroos', 'Xabi Alonso|Alonso', 'David Alaba|Alaba', 'Arjen Robben|Robben', 'James Rodríguez|James Rodriguez|James', 'Zé Roberto|Ze Roberto', 'Álvaro Odriozola|Odriozola', 'Hamit Altıntop|Altintop', 'Paul Breitner|Breitner']
  },
  {
    id: 'juve-real', nivel: 'dificil', cat: 'clubes', emoji: '🦓',
    titulo: 'Jogaram na Juventus E no Real Madrid',
    dicas: ['Velha Senhora da Itália e Merengues da Espanha.', 'Zidane e Cristiano Ronaldo são os mais famosos!', 'Kaká? Não! Mas Cannavaro, Higuaín, Di María, Morata, Danilo e Khedira sim!'],
    jogadores: ['Cristiano Ronaldo|CR7|Cristiano', 'Zinedine Zidane|Zidane|Zizou', 'Fabio Cannavaro|Cannavaro', 'Gonzalo Higuaín|Higuain', 'Ángel Di María|Di Maria|Di María', 'Álvaro Morata|Morata', 'Danilo', 'Sami Khedira|Khedira', 'Emerson', 'Michael Laudrup|Laudrup', 'Nicolas Anelka|Anelka']
  },
  {
    id: 'fla-barca', nivel: 'dificil', cat: 'brasil', emoji: '🔥',
    titulo: 'Jogaram no Flamengo E no Barcelona',
    dicas: ['Um clube é carioca e o outro catalão.', 'Romário e Ronaldinho Gaúcho encabeçam a lista.', 'Arturo Vidal, Rafinha Alcântara e Sávio também!'],
    jogadores: ['Romário|Romario|Baixinho', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Arturo Vidal|Vidal', 'Rafinha Alcântara', 'Sávio|Savio', 'Geovanni', 'Marcelinho Paraíba']
  },
  {
    id: 'copa-jogador-tecnico', nivel: 'dificil', cat: 'lendas', emoji: '📋',
    titulo: 'Ganharam a Copa do Mundo como jogador E como técnico',
    dicas: ['Apenas 3 pessoas na história inteira conseguiram isso!', 'Uma vez em campo, outra no banco de reservas.', 'Um brasileiro, um alemão e um francês.'],
    jogadores: ['Zagallo|Mário Zagallo|Velho Lobo', 'Franz Beckenbauer|Beckenbauer|Kaiser', 'Didier Deschamps|Deschamps']
  },
  {
    id: 'champions-jogador-tecnico', nivel: 'dificil', cat: 'lendas', emoji: '👔',
    titulo: 'Ganharam a Champions League como jogador E como técnico',
    dicas: ['Levantaram a Orelhuda jogando e depois treinando.', 'Zidane, Guardiola e Ancelotti estão nessa lista!', 'Cruyff e Rijkaard também.'],
    jogadores: ['Zinedine Zidane|Zidane', 'Pep Guardiola|Guardiola', 'Carlo Ancelotti|Ancelotti', 'Johan Cruyff|Cruyff', 'Frank Rijkaard|Rijkaard', 'Miguel Muñoz', 'Giovanni Trapattoni|Trapattoni']
  },
  {
    id: 'cem-gols-ucl', nivel: 'dificil', cat: 'lendas', emoji: '💯',
    titulo: 'Marcaram mais de 100 gols na Champions League',
    dicas: ['Apenas 3 jogadores na história passaram dos 100 gols na Champions.', 'Um português, um argentino e um polonês.', 'CR7, Messi e Lewandowski!'],
    jogadores: ['Cristiano Ronaldo|CR7|Cristiano', 'Lionel Messi|Messi', 'Robert Lewandowski|Lewandowski|Lewa']
  },
  {
    id: 'artilheiros-copa', nivel: 'dificil', cat: 'selecoes', emoji: '👟',
    titulo: 'Artilheiros de uma Copa do Mundo (1978 a 2022)',
    dicas: ['Ganharam a Chuteira de Ouro de uma edição da Copa.', 'Ronaldo em 2002, James em 2014, Kane em 2018 e Mbappé em 2022.', 'Klose, Thomas Müller e Romário? Romário não foi artilheiro isolado em 94 (foi Salenko/Stoichkov)!'],
    jogadores: ['Mario Kempes|Kempes', 'Paolo Rossi|Rossi', 'Gary Lineker|Lineker', 'Salvatore Schillaci|Schillaci', 'Oleg Salenko|Salenko', 'Hristo Stoichkov|Stoichkov', 'Davor Šuker|Suker', 'Ronaldo|Ronaldo Fenômeno|R9|Fenômeno', 'Miroslav Klose|Klose', 'Thomas Müller|Thomas Muller', 'David Villa|Villa', 'Wesley Sneijder|Sneijder', 'Diego Forlán|Forlan|Forlán', 'James Rodríguez|James Rodriguez|James', 'Harry Kane|Kane', 'Kylian Mbappé|Mbappe|Mbappé']
  },
  {
    id: 'bola-de-ouro', nivel: 'dificil', cat: 'lendas', emoji: '🏅',
    titulo: 'Vencedores da Bola de Ouro (Ballon d\'Or)',
    dicas: ['Prêmio da revista France Football.', 'Messi (8x) e CR7 (5x) dominaram por anos.', 'Modrić, Benzema, Rodri, Kaká, Ronaldinho, Rivaldo e Ronaldo também ganharam!'],
    jogadores: ['Cristiano Ronaldo|CR7|Cristiano', 'Lionel Messi|Messi', 'Luka Modrić|Modric|Modrić', 'Karim Benzema|Benzema', 'Rodri', 'Ousmane Dembélé|Dembele|Dembélé', 'Kaká|Kaka', 'Fabio Cannavaro|Cannavaro', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Andriy Shevchenko|Shevchenko', 'Pavel Nedvěd|Nedved', 'Ronaldo|Ronaldo Fenômeno|R9|Fenômeno', 'Michael Owen|Owen', 'Luís Figo|Figo', 'Rivaldo', 'Zinedine Zidane|Zidane', 'George Weah|Weah', 'Hristo Stoichkov|Stoichkov', 'Roberto Baggio|Baggio', 'Marco van Basten|Van Basten', 'Ruud Gullit|Gullit', 'Michel Platini|Platini', 'Johan Cruyff|Cruyff', 'Franz Beckenbauer|Beckenbauer', 'Gerd Müller|Gerd Muller', 'Eusébio|Eusebio', 'Lev Yashin|Yashin', 'Alfredo Di Stéfano|Di Stefano']
  },
  {
    id: 'libertadores-e-champions', nivel: 'dificil', cat: 'lendas', emoji: '🌎',
    titulo: 'Ganharam a Libertadores E a Champions League',
    dicas: ['Campeões do maior torneio da América do Sul e do maior da Europa!', 'Ronaldinho, Neymar, Cafu, Dida, Danilo, Marcelo e Julian Álvarez conseguiram!', 'Marquinhos, Ramires, David Luiz, Rafinha e Roque Júnior também!'],
    jogadores: ['Ronaldinho|Ronaldinho Gaúcho|R10', 'Neymar|Neymar Jr|Ney', 'Cafu', 'Dida', 'Roque Júnior|Roque Junior', 'Walter Samuel|Samuel', 'Carlos Tevez|Tevez', 'Juan Pablo Sorín|Sorin', 'Danilo', 'Rafinha', 'Ramires', 'David Luiz', 'Marquinhos', 'Julián Álvarez|Julian Alvarez|Alvarez', 'Marcelo']
  },
  {
    id: 'goleiros-artilheiros', nivel: 'dificil', cat: 'curiosidades', emoji: '🥅',
    titulo: 'Goleiros famosos por fazer gols (de falta ou pênalti)',
    dicas: ['Eles usavam luvas, mas adoravam balançar a rede adversária.', 'O maior de todos fez mais de 130 gols pelo São Paulo.', 'Rogério Ceni, Chilavert, Higuita e Jorge Campos!'],
    jogadores: ['Rogério Ceni|Rogerio Ceni|Ceni', 'José Luis Chilavert|Chilavert', 'René Higuita|Higuita', 'Jorge Campos', 'Dimitar Ivankov|Ivankov', 'Hans-Jörg Butt|Butt', 'Márcio|Marcio', 'Tiago Volpi|Volpi']
  },
  {
    id: 'irmaos-futebol', nivel: 'medio', cat: 'curiosidades', emoji: '👬',
    titulo: 'Jogadores famosos que têm irmão também jogador profissional',
    dicas: ['Futebol está no sangue da família.', 'Bellingham, Mbappé, Hazard, Hernández, Boateng, Alcantara e Sócrates/Raí!', 'Os gêmeos Fábio e Rafael também!'],
    jogadores: ['Jude Bellingham|Bellingham', 'Jobe Bellingham', 'Kylian Mbappé|Mbappe', 'Ethan Mbappé', 'Eden Hazard|Hazard', 'Thorgan Hazard', 'Lucas Hernández|Lucas Hernandez', 'Theo Hernández|Theo Hernandez', 'Thiago Alcântara|Thiago', 'Rafinha Alcântara|Rafinha', 'Sócrates|Socrates', 'Raí|Rai', 'Jérôme Boateng|Boateng', 'Kevin-Prince Boateng', 'Paul Pogba|Pogba', 'Kolo Touré|Kolo Toure', 'Yaya Touré|Yaya Toure', 'Fábio|Fabio', 'Rafael', 'Gary Neville', 'Phil Neville', 'Filippo Inzaghi|Inzaghi', 'Simone Inzaghi', 'Milinković-Savić', 'Alisson|Alisson Becker', 'Muriel']
  },
  {
    id: 'pais-e-filhos', nivel: 'medio', cat: 'curiosidades', emoji: '👨‍👦',
    titulo: 'Pais e filhos que foram jogadores profissionais famosos',
    dicas: ['Tal pai, tal filho nos gramados.', 'Maldini, Haaland, Simeone, Chiesa, Thuram, Kluivert e Mazinho/Thiago!', 'Rivaldo e Rivaldinho, Bebeto e Mattheus, Djalminha e...'],
    jogadores: ['Paolo Maldini|Maldini', 'Cesare Maldini', 'Daniel Maldini', 'Erling Haaland|Haaland', 'Alf-Inge Haaland', 'Lilian Thuram|Thuram', 'Marcus Thuram', 'Khéphren Thuram', 'Diego Simeone|Simeone', 'Giovanni Simeone', 'Patrick Kluivert|Kluivert', 'Justin Kluivert', 'Enrico Chiesa', 'Federico Chiesa|Chiesa', 'Mazinho', 'Thiago Alcântara|Thiago', 'Rafinha Alcântara', 'Peter Schmeichel|Schmeichel', 'Kasper Schmeichel', 'George Weah|Weah', 'Timothy Weah', 'Zinedine Zidane|Zidane', 'Luca Zidane', 'Bebeto', 'Rivaldo']
  },
  {
    id: 'golden-boy', nivel: 'dificil', cat: 'lendas', emoji: '✨',
    titulo: 'Vencedores do prêmio Golden Boy (Melhor Sub-21 da Europa)',
    dicas: ['Prêmio para o melhor jovem abaixo de 21 anos na Europa.', 'Messi, Aguero, Pogba, Mbappé, Haaland, Pedri, Gavi, Bellingham e Lamine Yamal ganharam!', 'Alexandre Pato e Anderson foram os brasileiros que venceram.'],
    jogadores: ['Lionel Messi|Messi', 'Wayne Rooney|Rooney', 'Cesc Fàbregas|Fabregas', 'Sergio Agüero|Aguero', 'Anderson', 'Alexandre Pato|Pato', 'Mario Balotelli|Balotelli', 'Mario Götze|Gotze', 'Isco', 'Paul Pogba|Pogba', 'Raheem Sterling|Sterling', 'Anthony Martial|Martial', 'Renato Sanches', 'Kylian Mbappé|Mbappe', 'Matthijs de Ligt|De Ligt', 'João Félix|Joao Felix', 'Erling Haaland|Haaland', 'Pedri', 'Gavi', 'Jude Bellingham|Bellingham', 'Lamine Yamal|Yamal']
  },
  {
    id: 'puskas', nivel: 'dificil', cat: 'lendas', emoji: '🚀',
    titulo: 'Vencedores do Prêmio Puskás (Gol mais bonito do ano)',
    dicas: ['Prêmio da FIFA para o gol mais plástico do ano.', 'Cristiano Ronaldo ganhou o primeiro; Neymar e Wendell Lira são brasileiros que venceram!', 'Ibrahimović, James Rodríguez, Salah, Son e Garnacho também!'],
    jogadores: ['Cristiano Ronaldo|CR7', 'Hamit Altıntop|Altintop', 'Neymar|Neymar Jr|Ney', 'Miroslav Stoch', 'Zlatan Ibrahimović|Ibrahimovic|Ibra', 'James Rodríguez|James Rodriguez|James', 'Wendell Lira', 'Olivier Giroud|Giroud', 'Mohamed Salah|Salah', 'Dániel Zsóri', 'Son Heung-min|Son', 'Erik Lamela|Lamela', 'Marcin Oleksy', 'Guilherme Madruga|Madruga', 'Alejandro Garnacho|Garnacho']
  },
  {
    id: 'invictos-arsenal', nivel: 'dificil', cat: 'clubes', emoji: '🛡️',
    titulo: 'Destaques do Arsenal Campeão Invicto ("The Invincibles" 2003/04)',
    dicas: ['Ganharam a Premier League sem perder nenhum jogo.', 'Treinados por Arsène Wenger.', 'Henry, Bergkamp, Vieira, Pires e o brasileiro Gilberto Silva!'],
    jogadores: ['Thierry Henry|Henry', 'Dennis Bergkamp|Bergkamp', 'Patrick Vieira|Vieira', 'Robert Pires|Pires', 'Gilberto Silva', 'Sol Campbell|Campbell', 'Ashley Cole', 'Kolo Touré|Kolo Toure', 'Jens Lehmann|Lehmann', 'Freddie Ljungberg|Ljungberg', 'Edu Gaspar|Edu', 'Nwankwo Kanu|Kanu', 'Sylvain Wiltord']
  },
  {
    id: 'triplice-inter-2010', nivel: 'dificil', cat: 'clubes', emoji: '🏆',
    titulo: 'Inter de Milão campeã da Champions 2010 (Mourinho)',
    dicas: ['Ganharam Champions, Italiano e Copa da Itália em 2010.', 'Tinha vários brasileiros na defesa!', 'Júlio César, Maicon, Lúcio, Sneijder, Eto\'o e Diego Milito!'],
    jogadores: ['Júlio César|Julio Cesar', 'Maicon', 'Lúcio|Lucio', 'Walter Samuel|Samuel', 'Cristian Chivu|Chivu', 'Javier Zanetti|Zanetti', 'Esteban Cambiasso|Cambiasso', 'Thiago Motta', 'Wesley Sneijder|Sneijder', "Samuel Eto'o|Eto'o|Etoo", 'Diego Milito|Milito', 'Goran Pandev|Pandev', 'Mario Balotelli|Balotelli', 'Dejan Stanković|Stankovic', 'Marco Materazzi|Materazzi']
  },
  {
    id: '7x1-2014', nivel: 'medio', cat: 'selecoes', emoji: '😱',
    titulo: 'Estiveram em campo no 7 a 1 (Brasil x Alemanha em 2014)',
    dicas: ['Jogaram a semifinal da Copa de 2014 no Mineirão.', 'Vale tanto jogadores do Brasil quanto da Alemanha daquele jogo!', 'Júlio César, David Luiz, Fred, Kroos, Klose, Müller e Neuer!'],
    jogadores: ['Júlio César|Julio Cesar', 'Maicon', 'David Luiz', 'Dante', 'Marcelo', 'Luiz Gustavo', 'Fernandinho', 'Oscar', 'Hulk', 'Bernard', 'Fred', 'Paulinho', 'Ramires', 'Willian', 'Manuel Neuer|Neuer', 'Philipp Lahm|Lahm', 'Mats Hummels|Hummels', 'Jérôme Boateng|Boateng', 'Bastian Schweinsteiger|Schweinsteiger', 'Sami Khedira|Khedira', 'Toni Kroos|Kroos', 'Mesut Özil|Ozil', 'Thomas Müller|Thomas Muller|Muller', 'Miroslav Klose|Klose', 'André Schürrle|Schurrle', 'Julian Draxler|Draxler']
  },
  {
    id: 'carecas-lendarios', nivel: 'facil', cat: 'curiosidades', emoji: '👨‍🦲',
    titulo: 'Craques famosos pelo visual careca',
    dicas: ['Brilharam muito em campo (e a cabeça também!).', 'Ronaldo em 2002 não conta toda a carreira, mas Roberto Carlos, Zidane e Robben sim!', 'Pep Guardiola, Stam, Barthez e Iniesta também!'],
    jogadores: ['Zinedine Zidane|Zidane', 'Roberto Carlos', 'Arjen Robben|Robben', 'Ronaldo|Ronaldo Fenômeno|R9', 'Thierry Henry|Henry', 'Wayne Rooney|Rooney', 'Andrés Iniesta|Iniesta', 'Fabien Barthez|Barthez', 'Jaap Stam|Stam', 'Claude Makélélé|Makelele', 'Lilian Thuram|Thuram', 'Esteban Cambiasso|Cambiasso', 'Wesley Sneijder|Sneijder', 'Lucas Moura', 'Alex']
  },
  {
    id: 'canhotos-magicos', nivel: 'facil', cat: 'curiosidades', emoji: '🦶',
    titulo: 'Craques canhotos famosos (perna esquerda mágica)',
    dicas: ['Dominam a bola principalmente com a perna esquerda.', 'Messi e Maradona são os dois maiores exemplos.', 'Rivaldo, Roberto Carlos, Haaland, Salah, Bale e Yamal também!'],
    jogadores: ['Lionel Messi|Messi', 'Diego Maradona|Maradona', 'Rivaldo', 'Roberto Carlos', 'Erling Haaland|Haaland', 'Mohamed Salah|Salah', 'Gareth Bale|Bale', 'Lamine Yamal|Yamal', 'Arjen Robben|Robben', 'Ángel Di María|Di Maria|Di María', 'Antoine Griezmann|Griezmann', 'Mesut Özil|Ozil', 'Paulo Dybala|Dybala', 'James Rodríguez|James', 'Phil Foden|Foden', 'Bukayo Saka|Saka', 'Cole Palmer|Palmer', 'Raphinha', 'Estêvão|Estevao', 'Marcelo', 'Adriano|Adriano Imperador', 'Gerson', 'Pedro? Não', 'Hulk', 'Alex']
  },
  {
    id: 'batedores-falta', nivel: 'medio', cat: 'lendas', emoji: '🎯',
    titulo: 'Grandes cobradores de falta da história',
    dicas: ['Falta perto da área com eles era quase pênalti.', 'Juninho Pernambucano, Zico, Marcelinho Carioca, Beckham e Roberto Carlos!', 'Messi, Ronaldinho, Pirlo e Rogério Ceni também!'],
    jogadores: ['Juninho Pernambucano|Juninho', 'Zico', 'Marcelinho Carioca|Marcelinho', 'David Beckham|Beckham', 'Roberto Carlos', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Lionel Messi|Messi', 'Cristiano Ronaldo|CR7', 'Rogério Ceni|Rogerio Ceni', 'Andrea Pirlo|Pirlo', 'Siniša Mihajlović|Mihajlovic', 'Marcos Assunção', 'Petković|Petkovic', 'Neto|Craque Neto', 'Nelinho', 'Rivellino|Rivelino', 'Alex']
  },
  {
    id: 'nunca-ganharam-champions', nivel: 'dificil', cat: 'curiosidades', emoji: '💔',
    titulo: 'Lendas que NUNCA ganharam a Champions League',
    dicas: ['Foram gênios do futebol europeu, mas a Orelhuda escapou.', 'Ronaldo Fenômeno, Ibrahimović e Buffon estão nessa lista!', 'Totti, Batistuta, Bergkamp, Fabregas e Harry Kane também!'],
    jogadores: ['Ronaldo|Ronaldo Fenômeno|R9|Fenômeno', 'Zlatan Ibrahimović|Ibrahimovic|Ibra', 'Gianluigi Buffon|Buffon', 'Francesco Totti|Totti', 'Gabriel Batistuta|Batistuta', 'Dennis Bergkamp|Bergkamp', 'Patrick Vieira|Vieira', 'Cesc Fàbregas|Fabregas', 'Michael Ballack|Ballack', 'Ruud van Nistelrooy|Van Nistelrooy', 'Fabio Cannavaro|Cannavaro', 'Lilian Thuram|Thuram', 'Pavel Nedvěd|Nedved', 'Harry Kane|Kane', 'Romário|Romario', 'Diego Maradona|Maradona', 'Antoine Griezmann|Griezmann']
  },
  {
    id: '4-ou-mais-clubes-br', nivel: 'medio', cat: 'brasil', emoji: '🧳',
    titulo: 'Jogaram em 4 ou mais clubes grandes do Brasil',
    dicas: ['Rodaram por vários gigantes do Brasileirão.', 'Romário, Edmundo, Diego Souza, Fred e Gabigol? Não, Gabigol jogou em 3 (Santos, Fla, Cruzeiro).', 'Diego Souza, Emerson Sheik, Paulo Nunes, Luizão e Vágner Love!'],
    jogadores: ['Diego Souza', 'Emerson Sheik|Sheik', 'Luizão|Luizao', 'Paulo Nunes', 'Edmundo', 'Romário|Romario', 'Vágner Love|Vagner Love', 'Willian Bigode', 'Thiago Neves', 'Léo Lima', 'Roger Flores', 'Ricardinho', 'Rivaldo']
  },
  {
    id: 'treinados-guardiola-mourinho', nivel: 'dificil', cat: 'curiosidades', emoji: '🧠',
    titulo: 'Foram treinados TANTO por Guardiola QUANTO por Mourinho',
    dicas: ['Trabalharam com os dois maiores técnicos rivais do século.', "Eto'o, Ibrahimović, De Bruyne, Xabi Alonso e Fabregas!", 'Pedro, Robben, Cancelo e Schweinsteiger também!'],
    jogadores: ["Samuel Eto'o|Eto'o|Etoo", 'Zlatan Ibrahimović|Ibrahimovic|Ibra', 'Kevin De Bruyne|De Bruyne', 'Xabi Alonso', 'Cesc Fàbregas|Fabregas', 'Pedro|Pedro Rodríguez', 'Arjen Robben|Robben', 'Bastian Schweinsteiger|Schweinsteiger', 'João Cancelo|Cancelo', 'Claudio Pizarro', 'Eidur Gudjohnsen', 'Maxwell']
  },
  {
    id: 'jogaram-com-messi-e-cr7', nivel: 'dificil', cat: 'curiosidades', emoji: '🐐',
    titulo: 'Jogaram no mesmo time que Messi E também que Cristiano Ronaldo',
    dicas: ['Por clube ou seleção, foram companheiros dos dois maiores da era moderna.', 'Di María, Dybala, Higuaín, Tevez (Argentina + Real/United/Juve).', 'Deco e Cancelo (Portugal + Barça) e Piqué, Sérgio Ramos e Neymar? Neymar não jogou com CR7, masSergio Ramos e Achraf Hakimi jogaram com os dois!'],
    jogadores: ['Ángel Di María|Di Maria|Di María', 'Gonzalo Higuaín|Higuain', 'Paulo Dybala|Dybala', 'Carlos Tevez|Tevez', 'Gerard Piqué|Pique', 'Sergio Ramos|Ramos', 'Keylor Navas|Navas', 'Achraf Hakimi|Hakimi', 'Deco', 'João Cancelo|Cancelo', 'Nélson Semedo|Semedo', 'André Gomes|Andre Gomes', 'Francisco Trincão', 'Arthur|Arthur Melo', 'Miralem Pjanić|Pjanic', 'Henrik Larsson|Larsson', 'Gabriel Heinze|Heinze', 'Fernando Gago|Gago', 'Ezequiel Garay|Garay', 'Vitinha', 'Danilo Pereira', 'Nuno Mendes']
  },
  {
    id: 'campeoes-olimpicos-br', nivel: 'medio', cat: 'selecoes', emoji: '🥇',
    titulo: 'Campeões Olímpicos pelo Brasil (Rio 2016 ou Tóquio 2020)',
    dicas: ['Ganharam a medalha de ouro olímpica no futebol masculino.', 'Neymar, Gabigol e Gabriel Jesus em 2016; Richarlison, Antony e Dani Alves em 2020!', 'Weverton, Marquinhos e Bruno Guimarães também!'],
    jogadores: ['Neymar|Neymar Jr|Ney', 'Gabriel Jesus', 'Gabigol|Gabriel Barbosa', 'Luan', 'Weverton', 'Marquinhos', 'Rodrigo Caio', 'Renato Augusto', 'Rafinha Alcântara', 'Walace', 'Zeca', 'Douglas Santos', 'Richarlison', 'Antony', 'Matheus Cunha', 'Bruno Guimarães', 'Claudinho', 'Malcom', 'Guilherme Arana|Arana', 'Diego Carlos', 'Nino', 'Santos', 'Daniel Alves|Dani Alves', 'Reinier', 'Paulinho', 'Gabriel Martinelli|Martinelli']
  },
  {
    id: 'inter-2006', nivel: 'medio', cat: 'brasil', emoji: '🇦🇹',
    titulo: 'Campeões do Mundial de 2006 pelo Internacional (contra o Barcelona)',
    dicas: ['Venceram o Barcelona de Ronaldinho Gaúcho no Japão.', 'O técnico era Abel Braga.', 'Clemer, Índio, Fernandão, Iarley, Alexandre Pato e Gabiru!'],
    jogadores: ['Clemer', 'Ceará|Ceara', 'Índio|Indio', 'Fabiano Eller', 'Rubens Cardoso', 'Edinho', 'Wellington Monteiro', 'Alex', 'Fernandão|Fernandao', 'Iarley', 'Alexandre Pato|Pato', 'Adriano Gabiru|Gabiru', 'Luiz Adriano', 'Vargas', 'Perdigão']
  },
  {
    id: 'spfc-2005', nivel: 'medio', cat: 'brasil', emoji: '🇾🇪',
    titulo: 'Campeões da Libertadores/Mundial de 2005 pelo São Paulo',
    dicas: ['Venceram o Liverpool por 1 a 0 no Japão.', 'Rogério Ceni fez defesas históricas e Mineiro fez o gol.', 'Lugano, Cicinho, Júnior, Josué, Amoroso e Aloísio Chulapa!'],
    jogadores: ['Rogério Ceni|Rogerio Ceni|Ceni', 'Cicinho', 'Fabão|Fabao', 'Diego Lugano|Lugano', 'Edcarlos', 'Júnior|Junior', 'Mineiro', 'Josué|Josue', 'Danilo', 'Amoroso', 'Aloísio|Aloisio Chulapa', 'Grafite', 'Luizão|Luizao', 'Christian', 'Souza', 'Richarlyson', 'Tardelli|Diego Tardelli']
  },
  {
    id: 'botafogo-2024', nivel: 'facil', cat: 'brasil', emoji: '⭐',
    titulo: 'Campeões da Libertadores e Brasileirão 2024 pelo Botafogo',
    dicas: ['Ganharam a América e o Brasileirão na mesma semana em 2024.', 'Venceram o Atlético-MG na final com um jogador a menos desde o 1º minuto.', 'Luiz Henrique, Igor Jesus, Almada, Savarino, Marlon Freitas e John!'],
    jogadores: ['John', 'Vitinho', 'Bastos', 'Alexander Barboza|Barboza', 'Alex Telles', 'Gregore', 'Marlon Freitas', 'Thiago Almada|Almada', 'Savarino', 'Luiz Henrique', 'Igor Jesus', 'Tiquinho Soares|Tiquinho', 'Júnior Santos|Junior Santos', 'Cuiabano', 'Danilo Barbosa', 'Eduardo', 'Matheus Martins', 'Gatito Fernández|Gatito']
  },
  {
    id: 'fluminense-2023', nivel: 'facil', cat: 'brasil', emoji: '🇭🇺',
    titulo: 'Campeões da Libertadores 2023 pelo Fluminense',
    dicas: ['Venceram o Boca Juniors na final no Maracanã.', 'Treinados por Fernando Diniz.', 'Fábio, Marcelo, Felipe Melo, Nino, André, Ganso, Arias, Cano e John Kennedy!'],
    jogadores: ['Fábio|Fabio', 'Samuel Xavier', 'Nino', 'Felipe Melo', 'Marcelo', 'André|Andre', 'Martinelli', 'Paulo Henrique Ganso|Ganso', 'Jhon Arias|Arias', 'Keno', 'Germán Cano|Cano', 'John Kennedy', 'Lima', 'Guga', 'Diogo Barbosa', 'Alexsander']
  },
  {
    id: 'galo-2013', nivel: 'medio', cat: 'brasil', emoji: '🐓',
    titulo: 'Campeões da Libertadores 2013 pelo Atlético-MG ("Eu Acredito!")',
    dicas: ['Campanha épica com defesas de pênalti no fim.', 'Ronaldinho Gaúcho era o camisa 10.', 'Victor, Réver, Leonardo Silva, Bernard, Diego Tardelli e Jô!'],
    jogadores: ['Victor|São Victor', 'Marcos Rocha', 'Réver|Rever', 'Leonardo Silva', 'Richarlyson', 'Pierre', 'Josué|Josue', 'Ronaldinho|Ronaldinho Gaúcho|R10', 'Bernard', 'Diego Tardelli|Tardelli', 'Jô|Jo', 'Luan', 'Guilherme', 'Alecsandro', 'Gilberto Silva']
  },
  {
    id: 'santos-2011', nivel: 'medio', cat: 'brasil', emoji: '🐳',
    titulo: 'Campeões da Libertadores 2011 pelo Santos',
    dicas: ['Venceram o Peñarol na final no Pacaembu.', 'Treinados por Muricy Ramalho.', 'Rafael, Edu Dracena, Léo, Danilo, Arouca, Elano, Ganso e Neymar!'],
    jogadores: ['Rafael|Rafael Cabral', 'Danilo', 'Edu Dracena', 'Durval', 'Léo|Leo', 'Adriano', 'Arouca', 'Elano', 'Paulo Henrique Ganso|Ganso', 'Neymar|Neymar Jr|Ney', 'Zé Eduardo|Ze Love', 'Alan Kardec', 'Alex Sandro', 'Borges', 'Felipe Anderson']
  },
  {
    id: 'gremio-2017', nivel: 'medio', cat: 'brasil', emoji: '🇪🇪',
    titulo: 'Campeões da Libertadores 2017 pelo Grêmio',
    dicas: ['Venceram o Lanús na final.', 'Treinados por Renato Portaluppi.', 'Marcelo Grohe, Geromel, Kannemann, Arthur, Luan e Everton Cebolinha!'],
    jogadores: ['Marcelo Grohe|Grohe', 'Edílson|Edilson', 'Pedro Geromel|Geromel', 'Kannemann', 'Cortez', 'Jailson', 'Arthur|Arthur Melo', 'Ramiro', 'Luan', 'Fernandinho', 'Lucas Barrios|Barrios', 'Everton|Everton Cebolinha|Cebolinha', 'Maicon', 'Jael', 'Cícero|Cicero']
  },
  {
    id: 'city-triplice-2023', nivel: 'facil', cat: 'clubes', emoji: '🩵',
    titulo: 'Manchester City campeão da Champions 2023 (Tríplice Coroa)',
    dicas: ['Ganharam Premier League, Copa da Inglaterra e Champions League.', 'Rodri fez o gol do título contra a Inter de Milão.', 'Ederson, Ruben Dias, Stones, De Bruyne, Bernardo Silva, Grealish e Haaland!'],
    jogadores: ['Ederson', 'Kyle Walker|Walker', 'Rúben Dias|Ruben Dias', 'John Stones|Stones', 'Manuel Akanji|Akanji', 'Nathan Aké|Ake', 'Rodri', 'İlkay Gündoğan|Gundogan', 'Kevin De Bruyne|De Bruyne', 'Bernardo Silva', 'Jack Grealish|Grealish', 'Erling Haaland|Haaland', 'Julián Álvarez|Julian Alvarez', 'Phil Foden|Foden', 'Riyad Mahrez|Mahrez', ' Rico Lewis']
  },
  {
    id: 'real-la-decima', nivel: 'medio', cat: 'clubes', emoji: '🔟',
    titulo: 'Real Madrid campeão de "La Décima" (Champions 2014)',
    dicas: ['Gol de cabeça aos 92:48 levou a final contra o Atlético para a prorrogação.', 'Treinados por Carlo Ancelotti.', 'Casillas, Sergio Ramos, Marcelo, Modrić, Di María, Bale, Benzema e CR7!'],
    jogadores: ['Iker Casillas|Casillas', 'Dani Carvajal|Carvajal', 'Sergio Ramos|Ramos', 'Raphaël Varane|Varane', 'Pepe', 'Marcelo', 'Fábio Coentrão|Coentrao', 'Sami Khedira|Khedira', 'Xabi Alonso', 'Luka Modrić|Modric', 'Ángel Di María|Di Maria', 'Isco', 'Gareth Bale|Bale', 'Karim Benzema|Benzema', 'Cristiano Ronaldo|CR7|Cristiano', 'Álvaro Morata|Morata', 'Casemiro']
  },
  {
    id: 'barca-2015', nivel: 'facil', cat: 'clubes', emoji: '🔵',
    titulo: 'Barcelona campeão da Champions 2015 (Trio MSN)',
    dicas: ['Venceram a Juventus por 3 a 1 na final em Berlim.', 'Treinados por Luis Enrique.', 'Ter Stegen, Dani Alves, Piqué, Mascherano, Jordi Alba, Busquets, Iniesta, Rakitić, Xavi e o trio MSN!'],
    jogadores: ['Ter Stegen', 'Claudio Bravo', 'Daniel Alves|Dani Alves', 'Gerard Piqué|Pique', 'Javier Mascherano|Mascherano', 'Jordi Alba|Alba', 'Sergio Busquets|Busquets', 'Ivan Rakitić|Rakitic', 'Andrés Iniesta|Iniesta', 'Xavi', 'Lionel Messi|Messi', 'Luis Suárez|Suarez', 'Neymar|Neymar Jr|Ney', 'Pedro', 'Rafinha Alcântara', 'Adriano']
  },
  {
    id: 'liverpool-2019', nivel: 'medio', cat: 'clubes', emoji: '🔴',
    titulo: 'Liverpool campeão da Champions 2019 (Jürgen Klopp)',
    dicas: ['Virada histórica de 4 a 0 sobre o Barcelona na semifinal.', 'Três brasileiros eram fundamentais no time!', 'Alisson, Van Dijk, Alexander-Arnold, Robertson, Fabinho, Mane, Firmino e Salah!'],
    jogadores: ['Alisson|Alisson Becker', 'Trent Alexander-Arnold|Alexander-Arnold', 'Virgil van Dijk|Van Dijk', 'Joël Matip|Matip', 'Andrew Robertson|Robertson', 'Fabinho', 'Jordan Henderson|Henderson', 'Georginio Wijnaldum|Wijnaldum', 'James Milner|Milner', 'Mohamed Salah|Salah', 'Roberto Firmino|Firmino', 'Sadio Mané|Mane|Mané', 'Divock Origi|Origi', 'Xherdan Shaqiri|Shaqiri']
  },
  {
    id: 'portugal-euro-2016', nivel: 'dificil', cat: 'selecoes', emoji: '🇵🇹',
    titulo: 'Campeões da Eurocopa 2016 por Portugal',
    dicas: ['Venceram a anfitriã França na prorrogação.', 'CR7 saiu machucado no 1º tempo e virou "auxiliar técnico" na beira do campo.', 'Rui Patrício, Pepe, Guerreiro, Renato Sanches, Quaresma, Nani, CR7 e Éder!'],
    jogadores: ['Cristiano Ronaldo|CR7', 'Pepe', 'Nani', 'Ricardo Quaresma|Quaresma', 'Rui Patrício|Rui Patricio', 'Raphaël Guerreiro|Guerreiro', 'Cédric Soares|Cedric', 'José Fonte|Fonte', 'William Carvalho', 'João Moutinho|Moutinho', 'Renato Sanches', 'João Mário|Joao Mario', 'André Gomes', 'Éder|Eder', 'Danilo Pereira', 'Ricardo Carvalho', 'Bruno Alves']
  },
  {
    id: 'italia-2006', nivel: 'dificil', cat: 'selecoes', emoji: '🇮🇹',
    titulo: 'Campeões da Copa de 2006 pela Itália',
    dicas: ['Venceram a França nos pênaltis em Berlim.', 'Cannavaro ganhou a Bola de Ouro naquele ano.', 'Buffon, Materazzi, Grosso, Gattuso, Pirlo, Totti, Del Piero e Toni!'],
    jogadores: ['Gianluigi Buffon|Buffon', 'Fabio Cannavaro|Cannavaro', 'Marco Materazzi|Materazzi', 'Gianluca Zambrotta|Zambrotta', 'Fabio Grosso|Grosso', 'Alessandro Nesta|Nesta', 'Gennaro Gattuso|Gattuso', 'Andrea Pirlo|Pirlo', 'Daniele De Rossi|De Rossi', 'Mauro Camoranesi|Camoranesi', 'Francesco Totti|Totti', 'Alessandro Del Piero|Del Piero', 'Luca Toni|Toni', 'Filippo Inzaghi|Inzaghi', 'Alberto Gilardino|Gilardino']
  },
  {
    id: 'espanha-2010', nivel: 'medio', cat: 'selecoes', emoji: '🇪🇸',
    titulo: 'Campeões da Copa de 2010 pela Espanha',
    dicas: ['Gol do título na prorrogação contra a Holanda na África do Sul.', 'Base formada por Barcelona e Real Madrid.', 'Casillas, Sergio Ramos, Piqué, Puyol, Busquets, Xabi Alonso, Xavi, Iniesta, Pedro, Torres e David Villa!'],
    jogadores: ['Iker Casillas|Casillas', 'Sergio Ramos|Ramos', 'Gerard Piqué|Pique', 'Carles Puyol|Puyol', 'Joan Capdevila', 'Sergio Busquets|Busquets', 'Xabi Alonso', 'Xavi', 'Andrés Iniesta|Iniesta', 'Pedro', 'David Villa|Villa', 'Fernando Torres|Torres', 'Cesc Fàbregas|Fabregas', 'Jesús Navas', 'David Silva', 'Juan Mata', 'Pepe Reina', 'Víctor Valdés']
  },
  {
    id: 'artilheiros-brasileirao-pontos-corridos', nivel: 'dificil', cat: 'brasil', emoji: '⚽',
    titulo: 'Artilheiros de uma edição do Brasileirão nos pontos corridos',
    dicas: ['Terminaram um Campeonato Brasileiro no topo da artilharia (desde 2003).', 'Gabigol (2x), Cano, Pedro, Hulk, Fred, Adriano Imperador e Washington Coração Valente!', 'Romário em 2005 (aos 39 anos!), Jonas, Borges, Tardelli e Paulinho também!'],
    jogadores: ['Dimba', 'Washington|Washington Coração Valente', 'Romário|Romario', 'Souza', 'Josiel', 'Keirrison', 'Kléber Pereira', 'Adriano|Adriano Imperador', 'Diego Tardelli|Tardelli', 'Jonas', 'Borges', 'Fred', 'Éderson', 'Ricardo Oliveira', 'William Pottker', 'Diego Souza', 'Henrique Dourado', 'Jô|Jo', 'Gabigol|Gabriel Barbosa', 'Claudinho', 'Luciano', 'Hulk', 'Germán Cano|Cano', 'Paulinho', 'Yuri Alberto', 'Alerrandro', 'Pedro']
  }
];

/* Lista completa de jogadores para o Autocomplete */
window.EXTRAS_JOGADORES = [
  'Erling Haaland', 'Mohamed Salah', 'Lamine Yamal', 'Jude Bellingham', 'Kevin De Bruyne', 'Antoine Griezmann',
  'Toni Kroos', 'Pedri', 'Gavi', 'Manuel Neuer', 'Gianluigi Buffon', 'Andrea Pirlo', 'Francesco Totti',
  'Paolo Maldini', 'Xavi', 'Andrés Iniesta', 'Carles Puyol', 'Gerard Piqué', 'Sergio Ramos', 'Iker Casillas',
  'Wayne Rooney', 'Steven Gerrard', 'Frank Lampard', 'Didier Drogba', 'Thierry Henry', 'Diego Maradona',
  'Endrick', 'Estêvão', 'Raphinha', 'Gabriel Jesus', 'Richarlison', 'Bruno Guimarães', 'Marquinhos',
  'Thiago Silva', 'Ederson', 'Hulk', 'Giorgian de Arrascaeta', 'Pedro', 'Everton Ribeiro', 'Gabriel Martinelli',
  'Bukayo Saka', 'Phil Foden', 'Declan Rice', 'Florian Wirtz', 'Jamal Musiala', 'Vitinha', 'Bruno Fernandes',
  'Bernardo Silva', 'Rafael Leão', 'Achraf Hakimi', 'Victor Osimhen', 'Sadio Mané', 'Son Heung-min',
  'Cole Palmer', 'Federico Valverde', 'Darwin Núñez', 'Edinson Cavani', 'Sergio Agüero',
  'Carlos Tevez', 'Juan Román Riquelme', 'Gabriel Batistuta', 'Hernán Crespo', 'Fernando Torres', 'David Silva',
  'Arjen Robben', 'Franck Ribéry', 'Bastian Schweinsteiger', 'Philipp Lahm', 'Mesut Özil', 'Gareth Bale',
  'Paul Pogba', "N'Golo Kanté", 'Patrice Evra', 'Rio Ferdinand', 'Paul Scholes', 'Ryan Giggs', 'Eric Cantona',
  'Zico', 'Sócrates', 'Garrincha', 'Romário', 'Bebeto', 'Cafu', 'Adriano', 'Fred', 'Hernanes', 'Oscar',
  'Willian', 'David Luiz', 'Fernandinho', 'Paulinho', 'Roberto Firmino', 'Douglas Costa', 'Alex Sandro', 'Danilo'
];

/* =========================================================
   DADOS DO JOGO 3: 🕵️ QUEM SOU EU? (Craques & Lendas)
   ========================================================= */
window.QUEM_SOU_EU = [
  { nome: 'Pelé|Pele|Rei Pelé', emoji: '👑', dicas: ['Sou brasileiro e atacante.', 'Ganhei 3 Copas do Mundo (1958, 1962 e 1970).', 'Fiz mais de mil gols e sou o Rei do Futebol!'] },
  { nome: 'Lionel Messi|Messi', emoji: '🐐', dicas: ['Sou canhoto e nasci na América do Sul.', 'Ganhei 8 Bolas de Ouro e a Copa de 2022.', 'Fiz história com a camisa 10 do Barcelona e da Argentina.'] },
  { nome: 'Cristiano Ronaldo|CR7|Cristiano', emoji: '🤖', dicas: ['Sou europeu e comecei no Sporting.', 'Sou o maior artilheiro da história da Champions League.', 'Comemoro gritando "SIUUU!".'] },
  { nome: 'Ronaldo|Ronaldo Fenômeno|R9|Fenômeno', emoji: '🦷', dicas: ['Sou centroavante brasileiro.', 'Joguei no Cruzeiro, PSV, Barça, Inter, Real Madrid, Milan e Corinthians.', 'Fiz os 2 gols da final da Copa de 2002 com corte de cabelo cascão!'] },
  { nome: 'Ronaldinho|Ronaldinho Gaúcho|R10', emoji: '🧙', dicas: ['Nasci no Rio Grande do Sul.', 'Sou famoso pelos dribles mágicos e por olhar para um lado e tocar para o outro.', 'Fui aplaudido de pé no Bernabéu jogando pelo Barcelona.'] },
  { nome: 'Neymar|Neymar Jr|Ney', emoji: '🤙', dicas: ['Subi da base do Santos.', 'Ganhei a Libertadores de 2011, a Champions de 2015 e o Ouro Olímpico de 2016.', 'Sou o maior artilheiro da Seleção Brasileira nas contas da FIFA.'] },
  { nome: 'Vinícius Júnior|Vini Jr|Vinicius Junior', emoji: '🕺', dicas: ['Fui revelado pelo Flamengo.', 'Fiz gol em duas finais de Champions League pelo Real Madrid.', 'Venci o prêmio The Best da FIFA de Melhor do Mundo em 2024.'] },
  { nome: 'Kylian Mbappé|Mbappe|Mbappé', emoji: '🐢', dicas: ['Sou francês e muito veloz.', 'Ganhei a Copa do Mundo de 2018 com 19 anos.', 'Fiz 3 gols na final da Copa de 2022 e troquei o PSG pelo Real Madrid.'] },
  { nome: 'Erling Haaland|Haaland', emoji: '🦾', dicas: ['Sou centroavante canhoto e muito alto.', 'Nasci na Noruega (mas nasci na Inglaterra quando meu pai jogava lá).', 'Quebrei o recorde de gols em uma edição da Premier League pelo Manchester City.'] },
  { nome: 'Marta|Rainha Marta', emoji: '👸', dicas: ['Nasci em Alagoas.', 'Fui eleita a Melhor Jogadora do Mundo 6 vezes.', 'Sou a maior artilheira da história das Copas do Mundo (entre homens e mulheres).'] },
  { nome: 'Zinedine Zidane|Zidane|Zizou', emoji: '👨‍🦲', dicas: ['Sou meia clássico francês.', 'Fiz dois gols de cabeça na final da Copa de 1998 contra o Brasil.', 'Ganhei 3 Champions seguidas como técnico do Real Madrid.'] },
  { nome: 'Romário|Romario|Baixinho', emoji: '🐟', dicas: ['Sou carioca e gênio da pequena área.', 'Brilhei no PSV, no Barcelona e nos grandes do Rio.', 'Fui o craque do Tetra da Seleção Brasileira em 1994.'] },
  { nome: 'Rogério Ceni|Rogerio Ceni|Ceni', emoji: '🧤', dicas: ['Joguei a carreira inteira no mesmo clube paulista.', 'Era goleiro, mas batia faltas e pênaltis.', 'Fiz mais de 130 gols pelo São Paulo!'] },
  { nome: 'Zico|Galinho', emoji: '🐓', dicas: ['Sou o maior ídolo da história do Flamengo.', 'Era especialista em cobranças de falta e vestia a 10.', 'Ganhei a Libertadores e o Mundial de 1981 e sou ídolo no Japão.'] },
  { nome: 'Lamine Yamal|Yamal', emoji: '💎', dicas: ['Sou ponta-direita canhoto da Espanha.', 'Fui campeão da Eurocopa 2024 com apenas 17 anos.', 'Sou a joia revelada em La Masia pelo Barcelona.'] },
  { nome: 'Gabigol|Gabriel Barbosa', emoji: '💪', dicas: ['Fui revelado pelo Santos.', 'Fiz dois gols nos minutos finais da final da Libertadores de 2019.', 'Minha comemoração de braços flexionados virou marca registrada.'] }
];

/* =========================================================
   DADOS DO JOGO 4: 📈 MAIS OU MENOS? (Comparação de Números)
   ========================================================= */
window.MAIS_OU_MENOS = [
  { t: 'Gols na carreira do Pelé (oficiais)', e: '👑', v: 767, u: 'gols' },
  { t: 'Gols do Cristiano Ronaldo na Champions League', e: '🤖', v: 140, u: 'gols' },
  { t: 'Gols do Rogério Ceni na carreira', e: '🧤', v: 131, u: 'gols' },
  { t: 'Capacidade do Maracanã atual', e: '🏟️', v: 78838, u: 'lugares' },
  { t: 'Títulos de Champions League do Real Madrid', e: '🤍', v: 15, u: 'títulos' },
  { t: 'Copas do Mundo da Seleção Brasileira', e: '🇧🇷', v: 5, u: 'Copas' },
  { t: 'Bolas de Ouro do Lionel Messi', e: '🏅', v: 8, u: 'prêmios' },
  { t: 'Gols da Marta pela Seleção Brasileira', e: '👸', v: 119, u: 'gols' },
  { t: 'Gols do Miroslav Klose em Copas do Mundo', e: '🇩🇪', v: 16, u: 'gols' },
  { t: 'Gols do Ronaldo Fenômeno em Copas do Mundo', e: '🦷', v: 15, u: 'gols' },
  { t: 'Gols do Just Fontaine na Copa de 1958', e: '🇫🇷', v: 13, u: 'gols' },
  { t: 'Minutos de uma partida com prorrogação', e: '⏱️', v: 120, u: 'minutos' },
  { t: 'Distância da marca do pênalti até o gol', e: '📏', v: 11, u: 'metros' },
  { t: 'Pontos do Flamengo campeão brasileiro de 2019', e: '🔴', v: 90, u: 'pontos' },
  { t: 'Ano do primeiro título mundial do Brasil na Suécia', e: '🏆', v: 1958, u: 'ano' },
  { t: 'Jogadores convocados por seleção na Copa de 2022', e: '📋', v: 26, u: 'jogadores' }
];

/* =========================================================
   DADOS DO JOGO 5: ⚡ DUELO RELÂMPAGO (Quiz 1v1)
   ========================================================= */
window.QUIZ_PERGUNTAS = [
  { p: 'Quem fez os dois gols do Brasil na final da Copa de 2002 contra a Alemanha?', o: ['Ronaldo Fenômeno', 'Rivaldo', 'Ronaldinho Gaúcho', 'Roberto Carlos'], c: 0 },
  { p: 'Qual clube tem mais títulos da UEFA Champions League?', o: ['Barcelona', 'Milan', 'Real Madrid', 'Bayern de Munique'], c: 2 },
  { p: 'Em que país foi disputada a Copa do Mundo de 2022?', o: ['Rússia', 'Catar', 'África do Sul', 'Alemanha'], c: 1 },
  { p: 'Qual goleiro brasileiro tem mais de 130 gols marcados na carreira?', o: ['Marcos', 'Taffarel', 'Dida', 'Rogério Ceni'], c: 3 },
  { p: 'Quem é o maior artilheiro da história das Copas do Mundo (16 gols)?', o: ['Pelé', 'Ronaldo', 'Miroslav Klose', 'Mbappé'], c: 2 },
  { p: 'Qual seleção venceu a primeira Copa do Mundo da história, em 1930?', o: ['Brasil', 'Uruguai', 'Argentina', 'Itália'], c: 1 },
  { p: 'Qual jogador ganhou 8 vezes a Bola de Ouro?', o: ['Cristiano Ronaldo', 'Lionel Messi', 'Pelé', 'Zidane'], c: 1 },
  { p: 'Em qual clube brasileiro Neymar foi revelado?', o: ['Palmeiras', 'São Paulo', 'Corinthians', 'Santos'], c: 3 },
  { p: 'Contra qual time o Flamengo virou a final da Libertadores de 2019 no fim do jogo?', o: ['Boca Juniors', 'River Plate', 'Palmeiras', 'Grêmio'], c: 1 },
  { p: 'Qual destes jogadores jogou TANTO no Real Madrid QUANTO no Barcelona?', o: ['Lionel Messi', 'Cristiano Ronaldo', 'Luís Figo', 'Karim Benzema'], c: 2 },
  { p: 'Qual é o apelido tradicional da Seleção da Argentina?', o: ['Fúria', 'Albiceleste', 'Azzurra', 'Celeste Olímpica'], c: 1 },
  { p: 'Quantos jogadores de linha (sem contar o goleiro) um time tem em campo?', o: ['9', '10', '11', '12'], c: 1 },
  { p: 'Quem marcou o gol do título da Espanha na final da Copa de 2010?', o: ['David Villa', 'Xavi', 'Andrés Iniesta', 'Fernando Torres'], c: 2 },
  { p: 'Qual brasileiro ganhou a Bola de Ouro em 2007 jogando pelo Milan?', o: ['Kaká', 'Ronaldinho', 'Ronaldo', 'Cafu'], c: 0 },
  { p: 'Em que ano o Brasil conquistou o Tetracampeonato nos Estados Unidos?', o: ['1990', '1994', '1998', '2002'], c: 1 }
];
