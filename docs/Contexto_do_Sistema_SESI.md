# Contexto do Sistema SESI (Sesi System)

Este documento consolida a lógica de negócios, regras pedagógicas e requisitos funcionais para o **Sesi System**. Ele serve como a "Verdade Única" (Single Source of Truth) para o desenvolvimento, unificando os relatos do usuário, a análise de planilhas existentes e pesquisas arquiteturais.

## 1. Visão Geral e Filosofia do Projeto

O **Sesi System** é um utilitário de gestão escolar focado no professor, projetado para ser híbrido, intuitivo e potente. Ele visa substituir o uso de planilhas Excel complexas (que quebram fórmulas e formatações) por uma aplicação Web (futuramente Desktop via Electron) robusta.

### 1.1 Objetivo Central

Gerenciar o ciclo de vida de avaliações, notas e entregas de atividades de alunos do Ensino Fundamental (I e II), respeitando as particularidades de **Pedagogos** (Generalistas) e **Professores Especialistas**.

### 1.2 Stack Tecnológica (Fase Atual)

* **Frontend:** React 19, TypeScript, Tailwind CSS, Vite.
* **Dados:** Dados mocados (JSON Server ou Local Storage simulado) e arquivos locais. Sem banco de dados relacional complexo neste momento.
* **Design:** Interface moderna, "Vanilla" (sem frameworks de arquitetura rígida como MVC ou Angular), focada em React Hooks e Componentização funcional. Design visual premium e minimalista.

---

## 2. Perfis de Ensino e Enturmação (Modelo Híbrido)

O sistema deve suportar dois "modos" de operação, refletindo a realidade do SESI:

### 2.1 Modo Pedagogo (Fundamental I - 1º ao 5º Ano)

* **Característica:** Um professor leciona múltiplas disciplinas para a **mesma turma** o ano todo.
* **Exceções:** Disciplinas especialistas (Inglês, Educação Física) podem ter outros professores.
* **Curricular:** Disciplinas "Padrão" (Português, Matemática, História, Geografia, Ciências) + Formativas Específicas (Caligrafia).

### 2.2 Modo Especialista (Fundamental II - 6º ao 9º Ano)

* **Característica:** Um professor leciona **uma disciplina específica** para **várias turmas** diferentes.
* **Complexidade Adicional:**
  * Lógica de Recuperação mais robusta (Recuperação Paralela, RPA/Simulados).
  * Cálculo de médias anuais considerando pesos.

---

## 3. Lógica Nuclear de Avaliação (O "Motor" de Notas)

O coração do sistema é o cálculo de notas, que deve replicar fielmente a lógica das planilhas Excel fornecidas (especialmente dos documentos do 6º Ano e Planilhas de Pedagogos).

### 3.1 Estrutura do Bimestre

Cada disciplina, em cada bimestre, compõe a nota do aluno baseada em componentes que podem variar (4º ano vs 6º ano), mas seguem uma espinha dorsal:

| Componente | Sigla | Tipo de Input | Descrição |
| :--- | :--- | :--- | :--- |
| **Pontos Extras** | P.E. | Manual | Pontuação bonus (Opcional, comum no Fund. II). |
| **Mensal** | AV.1 | Manual | Prova ou avaliação formal mensal. |
| **Bimestral** | AV.2 | Manual | Prova ou avaliação formal de fim de bimestre. |
| **Formativa** | AV.3 | **Calculada** | Média aritmética de todas as "Atividades Formativas" cadastradas. |

#### 3.1.1 Fórmula da Média Bimestral (Precisa)

A média não é apenas uma média aritmética simples em todos os casos. Baseado na fórmula extraída (`ARREDMULTB((((SOMA(PE:AV3))/3)+0,2);0,5)`), temos regras específicas:

1. **Soma com Extras:** `Soma = PontosExtras + AV1 + AV2 + AV3`.
2. **Divisão:** A divisão é por **3** (Considerando AV1, AV2, AV3 como pilares, e Pontos Extras como aditivo direto ao numerador).
    * *Nota:* Verificar se "Pontos Extras" entra na média ou é somado após. Pela fórmula do Excel `SOMA(Q:T)/3`, ele está dentro da soma do numerador. Isso significa que 1 ponto extra aumenta a média final em 0.33.

#### 3.1.2 Regra de Arredondamento SESI (ARREDMULTB)

O sistema **não** usa arredondamento comum (Round Half Up). Ele usa "Arredondar para Múltiplo de 0.5 com viés".

* **Fórmula Excel:** `ARREDMULTB(Valor + 0.2; 0.5)`
* **Lógica de Negócio:**
  * O `+ 0.2` serve como um "empurrãozinho" para atingir o próximo degrau de 0.5.
  * **Exemplos:**
    * 6.1 + 0.2 = 6.3 $\to$ Múltiplo 0.5 mais próximo = **6.5** (O aluno ganha nota).
    * 6.0 + 0.2 = 6.2 $\to$ Múltiplo 0.5 mais próximo = **6.0** (Mantém).
    * 6.6 + 0.2 = 6.8 $\to$ Múltiplo 0.5 mais próximo = **7.0**.
* **Objetivo:** Notas finais e médias são sempre terminadas em `.0` ou `.5`.

### 3.2 O Ecossistema de Formativas (AV.3)

A nota `AV.3` é dinâmica. Ela é a **ménia** (ou soma parametrizável) das formativas.

#### 3.2.1 Taxonomia das Formativas

As formativas podem ser classificadas por **Escopo** e **Estrutura**:

1. **Quanto ao Escopo:**
    * **Genérica:** Pode ser aplicada a qualquer disciplina (Ex: Participação, Tarefas, Comportamento/Disciplina).
    * **Exclusiva:** Pertence apenas a uma disciplina específica (Ex: Caligrafia $\to$ Português).

2. **Quanto à Estrutura:**
    * **Simples:** O professor digita a nota diretamente (0 a Pontuação Máxima).
    * **Composta:** A nota é calculada automaticamente baseada no cumprimento de sub-itens (atividades/tarefas).

#### 3.2.2 Lógica da Formativa Composta (Tarefas/Atividades)

* **Configuração:**
  * `Pontuação Máxima` (Ex: 4.0 pontos).
* **Fórmula de Cálculo:**
    $$Nota = \left( \frac{\text{Pontuação Máxima}}{\text{Total de Atividades Lançadas}} \right) \times \text{Qtd. Atividades Entregues}$$
* **Status de Entrega (Input):**
  * `✔` (Check): Entregue (Valor 1).
  * `✖` (X): Não Entregue (Valor 0).
  * `🟡` (Falta): Não Entregue por falta (Valor 0 - *Obs: O usuário mencionou que pode ser ignorado, mas matematicamente atua como 0 na fórmula atual*).

---

## 4. Módulos Específicos e Regras de Negócio

### 4.1 Módulo de Caligrafia (Língua Portuguesa)

* **Tipo:** Formativa Exclusiva Composta.
* **Integração:** Funciona como uma aba de planilha separada. O cálculo segue a lógica de "Composta", mas os itens são "Textos" e não "Tarefas genéricas".
* **Consolidação:** O resultado alimenta uma coluna específica dentro da AV.3 de Língua Portuguesa.

### 4.2 Lógica de Recuperação (Fundamental II / 6º Ano)

Para turmas avançadas, o sistema ativa colunas extras:

* **Recuperação Paralela:** Substitui a nota do bimestre se $NotaRec > NotaBimestre$.
* **RPA (Recuperação Paralela de Aprendizagem / Simulado):** Pode entrar como componente de avaliação extra.
* **Situação Anual:**
  * Média Anual = Média(Bim1, Bim2, Bim3, Bim4). (Aplicar regra de arredondamento SESI).
  * **Aprovação:** Média Anual $\ge$ 6.0 (ou 7.0, configurável) E Frequência $\ge$ 75%.
  * **Exame:** Se não aprovado, o aluno faz Exame Final.
  * **Média Final pós-Exame:** Fórmula específica (Geralmente `(MédiaAnual + Exame) / 2`).

---

## 5. Requisitos de Interface (UI/UX)

O sistema deve superar o Excel em usabilidade, mantendo a densidade de informação necessária.

* **Grade de Notas:** Visualização densa mas limpa.
* **Configurações:**
  * Capacidade de alterar "Pesos" e "Pontuação Máxima" das formativas.
  * Capacidade de alternar entre regras de Fundamental I (Pedagogo) e Fundamental II (Especialista).
* **Semântica Visual:**
  * Uso de cores do SESI (Azul, Branco, Cinza) como base.
  * Indicadores de status (Aprovado/Reprovado/Recuperação) automáticos.

## 6. Considerações Técnicas

* **Offline/Local:** Priorizar funcionamento sem dependência de internet constante (futuro Electron).
* **Dados:** Estruturas JSON flexíveis para permitir que uma disciplina tenha 3 formativas e outra tenha 5, sem quebrar o schema.
