# SESI System 🏫

**Sistema de Gestão de Notas e Atividades Escolar (Utilitário para Professores)**

Este projeto é uma aplicação moderna desenvolvida para substituir, unificar e automatizar as planilhas de gestão de notas utilizadas por professores do Sistema SESI (Ensino Fundamental I e II).

O sistema foca na experiência do usuário, integridade dos dados e na aplicação precisa das regras de negócio pedagógicas (como fórmulas de arredondamento específicas e lógicas de formativas compostas), eliminando a fragilidade e complexidade do Excel.

---

## 🚀 Funcionalidades Principais

* **Modelo Híbrido Inteligente:** Suporte nativo para os dois perfis de ensino:
  * **Pedagogo (Fund. I):** Um professor, múltiplas disciplinas, mesma turma.
  * **Especialista (Fund. II):** Um professor, uma disciplina, múltiplas turmas.
* **Motor de Avaliação Preciso:**
  * Cálculo automático de médias bimestrais e anuais.
  * Implementação da regra de arredondamento SESI (`ARREDMULTB`).
  * Gestão de Formativas Simples e Compostas (ex: Tarefas distribuídas).
* **Módulos Especializados:**
  * **Caligrafia:** Módulo dedicado para controle de textos e produção textual.
  * **Tarefas:** Cálculo proporcional de notas baseado na entrega de atividades.
* **Interface Premium:** Design simples, limpo e focado, construído com componentes modernos.

---

## 🛠️ Stack Tecnológica

O projeto utiliza uma arquitetura "Local-First" moderna, visando futura portabilidade para Desktop (Electron).

* **Core:** React 19, TypeScript, Vite.
* **Estilização:** Tailwind CSS (com design tokens personalizados).
* **Roteamento:** React Router Dom.
* **Ícones:** Lucide React.
* **Estado (Planejado):** Zustand.
* **Persistência (Dev):** JSON Server / LocalStorage.

---

## 📂 Estrutura do Projeto

O código-fonte (`sistema_sesi/src`) segue uma arquitetura **Feature-Based**:

```text
src/
├── app/            # Entry point, Router, Configurações globais
├── features/       # Módulos de negócio (Dashboard, Disciplinas, Alunos)
│   └── [feature]/  # Components, hooks e types isolados por feature
├── components/     # Componentes compartilhados
│   ├── layouts/    # Sidebar, Header, MainLayout
│   └── ui/         # Buttons, Inputs, Cards (Design System)
├── pages/          # Páginas (Route pages) que compõem as features
└── shared/         # Utilitários e Hooks globais
```

---

## ⚡ Como Rodar o Projeto

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/SEU_USUARIO/sesi_system.git
    ```

2. **Acesse a pasta da aplicação:**

    ```bash
    cd sesi_system/sistema_sesi
    ```

3. **Instale as dependências:**

    ```bash
    npm install
    ```

4. **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

5. Acesse `http://localhost:5173` no seu navegador.

---

## 📚 Documentação

A documentação detalhada das regras de negócio e contexto encontra-se na pasta `/docs`:

* `Contexto_do_Sistema_SESI.md`: A "single source of truth" sobre a lógica do sistema.

---
*Desenvolvido como projeto pessoal para otimização do fluxo pedagógico.*
