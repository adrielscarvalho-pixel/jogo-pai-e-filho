# 🏆 Pai 🆚 Filho — O Desafio

Jogo divertido para jogar em família (2 a 4 jogadores) no computador, celular ou tablet.

## 🎮 Modos de Jogo

### 1. 💰 Dá Pra Comprar?
- **🤫 Valor Secreto (O viral!):** Cada jogador escolhe um valor secreto em reais antes de ver os itens (ex: `R$ 10.000` vs `R$ 500.000`). A cada pergunta (*"Dá pra comprar um PS5?"*, *"Dá pra comprar um BYD Dolphin Mini?"*), quem escolheu o valor mais próximo do preço real ganha **+1 ponto** (e **+1 bônus NA MOSCA 🎯** se ficar a menos de 10% do valor!).
- **🎯 Chute o Preço:** Aparece o item primeiro e cada jogador chuta o valor em segredo. Quem chegar mais perto vence a rodada!

### 2. ⚽ Tema Secreto (Futebol)
Um jogador é o **Juiz** e escolhe um tema secreto entre 3 opções sorteadas (ou inventa um na hora), como *"Jogaram no Real Madrid E no Barcelona"*. O outro jogador começa com **Fichas de Futebol (⚽)** e vai chutando jogadores:
- **SIM ✅ (é do tema):** Grátis (`0 ⚽`)
- **NÃO ❌ (não é do tema):** `-1 ⚽`
- **💡 Pedir Dica (até 3 dicas progressivas):** `-2 ⚽`
- **👀 Revelar 1 Jogador do tema:** `-3 ⚽`
- **🎯 Chutar o Tema:** Se acertar, **todas as fichas que sobraram viram pontos!** Se errar, `-3 ⚽`.
- **🧤 Defesa do Juiz:** Se as fichas acabarem, o Juiz ganha **+5 pontos**.

## 📲 Jogar em 1 ou 2 Aparelhos

- **1 Aparelho (Passa o celular):** O próprio jogo bloqueia a tela com aviso antes de revelar o valor secreto ou o tema secreto de cada um.
- **2 Aparelhos (Sala Online em Tempo Real):**
  1. No Aparelho 1, toque em **📲 Jogar em 2 Aparelhos → Criar Sala** (gera um código de 4 dígitos, ex: `7954`, ou link direto).
  2. No Aparelho 2, abra o link e digite os 4 dígitos em **Entrar numa Sala**.
  3. No **Dá Pra Comprar?**, cada um digita seu valor secreto no próprio aparelho simultaneamente.
  4. No **Tema Secreto ⚽**, a tela do **Juiz** mostra o tema secreto e a cola de jogadores o tempo todo, enquanto a tela do **Adivinhador** esconde o segredo e mostra os palpites/dicas em tempo real!

## 🚀 Como jogar

- **Direto no navegador:** Basta abrir o arquivo `index.html`.
- **Com servidor local (Node.js):**
  ```bash
  npm install
  npm start
  ```
