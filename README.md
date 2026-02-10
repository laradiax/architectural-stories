# 🏰 PatternQuest

> **Resolva problemas de código, domine padrões arquiteturais e torne-se um Mestre da Arquitetura de Software.**

**PatternQuest** é uma aplicação gamificada desenvolvida em **React + TypeScript** que ensina conceitos avançados de Arquitetura de Software (MVC, Microservices, SOA, etc.) através de uma narrativa interativa. O jogador assume o papel de um investigador que deve corrigir sistemas falhos em diferentes distritos de uma cidade tecnológica.


## 🚀 Funcionalidades Principais

* **🎮 Gamificação:** Sistema de XP, Níveis (Estagiário a Mestre), Títulos e Conquistas.
* **🌍 Internacionalização (i18n):** Suporte completo para **Português (PT)** e **Inglês (EN)** com carregamento dinâmico de conteúdo.
* **🎨 Temas:** Modo Claro (Light) e Escuro (Dark) persistentes.
* **💾 Persistência:** Sistema de Save automático local (`localStorage`) com suporte a múltiplos perfis e proteção por senha.
* **🧩 Quiz Engine:** Mecânica de jogo baseada em tempo, com barra de integridade (vida) e feedback imediato.
* **📱 Responsivo:** Interface adaptável para diferentes tamanhos de tela.


## 📂 Estrutura do Projeto

O projeto segue uma arquitetura modular focada em separação de responsabilidades (Dados, Lógica, UI).

```text
src/
├── 📂 components/          # Componentes visuais da aplicação
│   ├── 📂 game/            # Lógica do jogo (Quiz, Resultado)
│   │   ├── PhaseResult.tsx
│   │   ├── QuizEngine.tsx
│   │   └── game.css
│   ├── 📂 layout/          # Estrutura base (HUD, Menus, Modais)
│   │   ├── HUD.tsx
│   │   ├── Layout.tsx
│   │   ├── SettingsModal.tsx
│   │   ├── StartScreen.tsx
│   │   ├── SystemDialog.tsx
│   │   └── ... (arquivos .css)
│   └── 📂 narrative/       # Elementos de história (Mapa, Briefing)
│       ├── Briefing.tsx
│       ├── PhaseMap.tsx
│       └── map.css
│
├── 📂 data/                # Fonte de verdade dos dados (JSONs e i18n)
│   ├── contentManager.ts   # Gerenciador de importação dinâmica (PT/EN)
│   ├── i18n.ts             # Dicionário de traduções da Interface (UI)
│   ├── phases-pt.json      # Fases e perguntas (Português)
│   ├── phases-en.json      # Fases e perguntas (Inglês)
│   ├── patterns-pt.json    # Biblioteca de padrões (Português)
│   └── patterns-en.json    # Biblioteca de padrões (Inglês)
│
├── 📂 hooks/               # Lógica de Estado e Persistência (Custom Hooks)
│   ├── useGameData.ts      # Entrega o conteúdo traduzido para o App
│   └── usePersistence.ts   # Gerencia Login, Save, Load e LocalStorage
│
├── 📂 styles/              # Estilos globais
│   ├── global.css          # Reset e estilos base
│   └── variables.css       # Variáveis CSS (Cores, Fontes, Temas Dark/Light)
│
├── 📂 types/               # Definições de Tipos TypeScript
│   ├── game.ts             # Interfaces (Phase, Question, UserProfile, etc.)
│   └── index.ts            # Exportador de tipos
│
├── 📂 utils/               # Funções auxiliares
│   └── gamification.ts     # Lógica de cálculo de XP e Níveis
│
├── App.tsx                 # Componente Raiz (Roteamento de Views e Estado Global)
└── main.tsx                # Ponto de entrada do React
```

## 🛠️ Tecnologias Utilizadas

* **React 18**
Hooks e Functional Components para uma arquitetura moderna e declarativa.

* **TypeScript**
Tipagem estrita para maior segurança, legibilidade e manutenção do código.

* **Vite**
Build tool e servidor de desenvolvimento ultra-rápido.

* **CSS Modules / CSS Variables**
Estilização nativa, performática e alinhada ao Design System do jogo.

* **Local Storage API**
Persistência de dados do jogador (perfil, progresso, conquistas).

## 🏃‍♂️ Como Executar

Certifique-se de ter o Node.js instalado em sua máquina.

1. Clone o repositório
```bash
  git clone https://seu-repositorio/pattern-quest.git
  cd pattern-quest
```
2. Instale as dependências
```bash
  npm install
  # ou
  yarn install
```
3. Rode o servidor de desenvolvimento
```bash
  npm run dev
```
4. Acesse no navegador

Normalmente disponível em:
👉 http://localhost:5173

## 🕹️ Guia do Jogador
### 👤 Criação de Perfil

Na tela inicial, digite um nome de usuário e uma senha para criar seu progresso (save).

### 🗺️ O Mapa

Selecione um Distrito (Fase) desbloqueado.
Fases mais avançadas exigem a conclusão das anteriores.

### 📋 O Briefing

Cada fase começa com um problema arquitetural apresentado por uma empresa fictícia da TechCity.

### 🎮 O Jogo

Você tem 30 segundos para responder cada caso.

Respostas rápidas rendem mais pontos.

Respostas erradas reduzem a Integridade do Sistema.

Se a integridade chegar a 0%, a missão falha e a fase deve ser reiniciada.

### ⚙️ Configurações

Clique na engrenagem (⚙️) no HUD para:

Alterar o idioma

Alternar o tema (Claro / Escuro)

## 🤝 Contribuição

Para adicionar novas fases ou padrões arquiteturais:

Edite os arquivos de fases:

src/data/phases-pt.json

src/data/phases-en.json

Mantenha a consistência dos IDs, por exemplo:

Fases: p1_garage

Questões: q1_mixed

Adicione novos padrões em:

patterns-pt.json

patterns-en.json