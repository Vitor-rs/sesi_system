# SESI System - Documentação Técnica Completa

## 📋 Sumário Executivo

O **SESI System** é um sistema de gerenciamento acadêmico para professores da rede SESI/FIEMS/SENAI, projetado para substituir planilhas Excel complexas e propensas a erros. O sistema gerencia notas, frequência, entregas de tarefas e avaliações formativas de alunos.

---

## 1. GLOSSÁRIO E CONCEITOS FUNDAMENTAIS

### 1.1 Hierarquia Educacional

| Termo | Definição |
|-------|-----------|
| **1º Fundamental** | Anos iniciais (1º ao 5º ano) - geralmente com pedagogos que lecionam múltiplas disciplinas |
| **2º Fundamental** | Anos finais (6º ao 9º ano) - professores especializados por disciplina |
| **Pedagogo(a)** | Professor(a) generalista que leciona várias disciplinas para uma única turma |
| **Professor Especialista** | Leciona uma disciplina para múltiplas turmas |

### 1.2 Estrutura de Avaliações

```
MÉDIA BIMESTRAL = (AV.1 + AV.2 + AV.3) / 3

Onde:
├── AV.1 (Mensal)     → Prova mensal (inserção manual)
├── AV.2 (Bimestral)  → Prova bimestral (inserção manual)  
└── AV.3 (Formativa)  → Média das formativas (calculada automaticamente)
```

### 1.3 Taxonomia das Formativas

```
FORMATIVAS
├── Por Escopo
│   ├── GENÉRICA → Pode ser usada em qualquer disciplina
│   └── EXCLUSIVA → Pertence a uma disciplina específica
│
└── Por Estrutura
    ├── SIMPLES → Pontuação única (ex: Participação = 0 a 2)
    └── COMPOSTA → Contém sub-atividades (ex: Tarefas, Caligrafia)
```

**Combinações possíveis:**
- Genérica Simples (ex: Participação, Disciplina/Comportamento)
- Genérica Composta (ex: Tarefas)
- Exclusiva Simples (ex: Prática de Tabuada para Matemática)
- Exclusiva Composta (ex: Caligrafia para Língua Portuguesa)

---

## 2. LÓGICA DE NEGÓCIOS

### 2.1 Regras de Cálculo de Notas

#### 2.1.1 Média Bimestral
```typescript
// Só calcula se todas as avaliações estiverem preenchidas
// Retorna vazio se qualquer valor estiver ausente
calcularMediaBimestral(mensal, bimestral, formativa): number | null {
  if (!mensal || !bimestral || !formativa) return null;
  const soma = mensal + bimestral + formativa;
  return soma === 0 ? null : soma / 3;
}
```

#### 2.1.2 Nota da Avaliação Formativa (AV.3)
```typescript
// Média de todas as formativas da disciplina naquele bimestre
// O número de formativas varia por disciplina (4, 5, 6...)
calcularNotaFormativa(formativas: number[]): number | null {
  const validas = formativas.filter(f => f !== null);
  if (validas.length === 0) return null;
  return validas.reduce((a, b) => a + b, 0) / validas.length;
}
```

#### 2.1.3 Pontuação de Formativa Composta (ex: Tarefas)
```typescript
// A pontuação máxima é dividida igualmente entre as atividades
// Apenas atividades com status "entregue" (✓) pontuam
calcularFormativaComposta(
  pontuacaoMaxima: number,
  atividades: AtividadeStatus[]
): number {
  const total = atividades.length;
  if (total === 0) return 0;
  
  const entregues = atividades.filter(a => a === 'entregue').length;
  const valorPorAtividade = pontuacaoMaxima / total;
  
  return Number((valorPorAtividade * entregues).toFixed(1));
}
```

### 2.2 Status de Entrega de Atividades

| Status | Símbolo | Valor | Significado |
|--------|---------|-------|-------------|
| Entregue | ✓ | 1 | Tarefa feita e entregue no prazo |
| Não Entregue | ✖ | 0 | Não entregou a tarefa |
| Falta | 🟡 | 0* | Aluno faltou na aula |

> *Falta não pontua, mas é registrada para fins de controle

### 2.3 Nota de Corte (Aprovação)

- Padrão configurável (ex: 6.5)
- Aplica-se a todas as avaliações (Mensal, Bimestral, Formativa)
- Formatação condicional: notas abaixo da corte são destacadas visualmente

### 2.4 Ordenação de Alunos

**Regra imutável:** Alunos são SEMPRE exibidos em ordem alfabética em todas as visualizações. O número do aluno (N°) reflete sua posição na ordem alfabética, não é um ID.

---

## 3. LEVANTAMENTO DE REQUISITOS

### 3.1 Requisitos Funcionais

#### RF01 - Gestão de Configurações Globais
- RF01.1: Definir ano letivo da turma (ex: "4º Ano A")
- RF01.2: Definir período (Matutino/Vespertino)
- RF01.3: Definir nota de corte padrão (ex: 6.5)
- RF01.4: Definir quantidade de bimestres (padrão: 4)
- RF01.5: Configurar pontuações padrão das formativas genéricas

#### RF02 - Gestão de Alunos
- RF02.1: Cadastrar aluno individualmente (nome completo)
- RF02.2: Importar alunos em lote via CSV/XLSX
- RF02.3: Editar nome do aluno
- RF02.4: Excluir aluno (com cascata para notas/registros)
- RF02.5: Manter ordenação alfabética automática
- RF02.6: Gerar número sequencial automático

#### RF03 - Gestão de Disciplinas
- RF03.1: Cadastrar nova disciplina
- RF03.2: Associar formativas à disciplina
- RF03.3: Configurar pontuação específica por disciplina/formativa
- RF03.4: Editar/excluir disciplinas
- RF03.5: Distinguir modo pedagogo (múltiplas disciplinas) vs especialista

#### RF04 - Gestão de Formativas
- RF04.1: Cadastrar formativa genérica simples
- RF04.2: Cadastrar formativa genérica composta
- RF04.3: Cadastrar formativa exclusiva simples
- RF04.4: Cadastrar formativa exclusiva composta
- RF04.5: Definir pontuação máxima padrão
- RF04.6: Vincular formativa exclusiva a disciplina específica

#### RF05 - Lançamento de Notas
- RF05.1: Lançar nota da prova mensal (AV.1)
- RF05.2: Lançar nota da prova bimestral (AV.2)
- RF05.3: Lançar pontuação de formativa simples
- RF05.4: Registrar status de atividade (✓/✖/🟡)
- RF05.5: Calcular automaticamente AV.3 (Formativa)
- RF05.6: Calcular automaticamente Média Bimestral

#### RF06 - Gestão de Atividades (Formativas Compostas)
- RF06.1: Criar nova atividade (nome, data início, data fim, descrição)
- RF06.2: Visualizar detalhes da atividade
- RF06.3: Editar/excluir atividade
- RF06.4: Distribuir pontuação automaticamente entre atividades

#### RF07 - Visualização e Relatórios
- RF07.1: Visualizar tabela por disciplina/bimestre
- RF07.2: Destacar notas abaixo da corte (formatação condicional)
- RF07.3: Alternar visualização soma total vs média (formativas)
- RF07.4: Resumo anual com médias de todos os bimestres

#### RF08 - Backup e Persistência
- RF08.1: Salvar dados automaticamente
- RF08.2: Exportar backup manualmente
- RF08.3: Importar backup
- RF08.4: Detectar Google Drive/OneDrive para sync (futuro)

### 3.2 Requisitos Não-Funcionais

| ID | Requisito | Descrição |
|----|-----------|-----------|
| RNF01 | Portabilidade | Funcionar em computadores corporativos sem admin |
| RNF02 | Offline-first | Funcionar sem conexão à internet |
| RNF03 | Performance | Interface responsiva mesmo com 30+ alunos |
| RNF04 | Usabilidade | Mínima curva de aprendizado para professores |
| RNF05 | Consistência | Integridade referencial entre entidades |

---

## 4. MODELO DE DADOS

### 4.1 Diagrama Entidade-Relacionamento (Conceitual)

```
┌─────────────────┐       ┌─────────────────┐
│  CONFIGURACAO   │       │     TURMA       │
├─────────────────┤       ├─────────────────┤
│ notaCorte       │       │ id              │
│ qtdBimestres    │       │ nome (4º Ano A) │
│ anoLetivo       │       │ periodo         │
└─────────────────┘       └────────┬────────┘
                                   │ 1:N
                                   ▼
┌─────────────────┐       ┌─────────────────┐
│    FORMATIVA    │       │     ALUNO       │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ nome            │       │ nome            │
│ tipo (enum)     │       │ turma_id (FK)   │
│ escopo (enum)   │       └────────┬────────┘
│ pontuacaoPadrao │                │
│ disciplina_id?  │                │ 1:N
└────────┬────────┘                ▼
         │              ┌─────────────────────┐
         │ N:M          │   DISCIPLINA        │
         ▼              ├─────────────────────┤
┌─────────────────────┐ │ id                  │
│ DISCIPLINA_FORMATIVA│ │ nome                │
├─────────────────────┤ │ turma_id (FK)       │
│ disciplina_id (FK)  │ └──────────┬──────────┘
│ formativa_id (FK)   │            │
│ pontuacaoCustom?    │            │ 1:N
└─────────────────────┘            ▼
                        ┌─────────────────────┐
                        │       NOTA          │
                        ├─────────────────────┤
                        │ id                  │
                        │ aluno_id (FK)       │
                        │ disciplina_id (FK)  │
                        │ bimestre            │
                        │ notaMensal          │
                        │ notaBimestral       │
                        └─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│     ATIVIDADE       │       │  REGISTRO_ATIVIDADE │
├─────────────────────┤       ├─────────────────────┤
│ id                  │◄──────│ id                  │
│ formativa_id (FK)   │ 1:N   │ atividade_id (FK)   │
│ disciplina_id (FK)  │       │ aluno_id (FK)       │
│ bimestre            │       │ status (enum)       │
│ nome                │       └─────────────────────┘
│ dataInicio          │
│ dataFim             │       ┌─────────────────────┐
│ descricao           │       │  NOTA_FORMATIVA     │
└─────────────────────┘       ├─────────────────────┤
                              │ id                  │
                              │ aluno_id (FK)       │
                              │ formativa_id (FK)   │
                              │ disciplina_id (FK)  │
                              │ bimestre            │
                              │ valor               │
                              └─────────────────────┘
```

### 4.2 Enumerações

```typescript
enum TipoFormativa {
  SIMPLES = 'simples',
  COMPOSTA = 'composta'
}

enum EscopoFormativa {
  GENERICA = 'generica',
  EXCLUSIVA = 'exclusiva'
}

enum StatusAtividade {
  ENTREGUE = 'entregue',     // ✓ (valor 1)
  NAO_ENTREGUE = 'nao_entregue', // ✖ (valor 0)
  FALTA = 'falta'            // 🟡 (valor 0, registro especial)
}

enum Periodo {
  MATUTINO = 'matutino',
  VESPERTINO = 'vespertino'
}
```

---

## 5. ARQUITETURA DO SISTEMA

### 5.1 Visão Geral da Stack

```
┌─────────────────────────────────────────────────────────┐
│                    APRESENTAÇÃO                         │
│  React 18 + TypeScript + Tailwind CSS + Vite            │
├─────────────────────────────────────────────────────────┤
│                    ESTADO/LÓGICA                        │
│  Zustand (estado global) + React Query (cache)          │
├─────────────────────────────────────────────────────────┤
│                    PERSISTÊNCIA                         │
│  [Dev] JSON/IndexedDB  →  [Prod] SQLite (Electron)      │
├─────────────────────────────────────────────────────────┤
│                    DESKTOP (Futuro)                     │
│  Electron + electron-builder (portável)                 │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Estrutura de Pastas

```
sesi-system/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MainContent.tsx
│   │   ├── disciplinas/
│   │   │   ├── TabelaDisciplina.tsx
│   │   │   ├── ColunaFormativa.tsx
│   │   │   └── CelulaAtividade.tsx
│   │   ├── alunos/
│   │   │   ├── ListaAlunos.tsx
│   │   │   └── FormAluno.tsx
│   │   ├── formativas/
│   │   │   ├── GerenciadorFormativas.tsx
│   │   │   └── FormFormativa.tsx
│   │   └── shared/
│   │       ├── InputNota.tsx
│   │       ├── StatusBadge.tsx
│   │       └── Modal.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Disciplinas.tsx
│   │   ├── Alunos.tsx
│   │   ├── Formativas.tsx
│   │   └── Configuracoes.tsx
│   ├── stores/
│   │   ├── useAlunosStore.ts
│   │   ├── useDisciplinasStore.ts
│   │   ├── useFormativasStore.ts
│   │   ├── useNotasStore.ts
│   │   └── useConfigStore.ts
│   ├── services/
│   │   ├── database.ts
│   │   ├── calculoNotas.ts
│   │   └── importExport.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── App.tsx
├── electron/ (futuro)
│   ├── main.ts
│   └── preload.ts
└── package.json
```

### 5.3 Componentes Principais

#### 5.3.1 Sidebar (Navegação)
```
┌──────────────────────┐
│ 🏫 SESI System       │
├──────────────────────┤
│ 📊 Dashboard         │
├──────────────────────┤
│ 📚 Disciplinas       │
│   ├─ Visualizar      │
│   ├─ Gerenciar       │
│   └─ Formativas      │
├──────────────────────┤
│ 👥 Alunos            │
├──────────────────────┤
│ ⚙️ Configurações     │
└──────────────────────┘
```

#### 5.3.2 Tabela de Disciplina (Core)
```
┌─────────────────────────────────────────────────────────────────┐
│ Disciplina: Ciências | Turma: 4º Ano A | Matutino | 1º Bimestre │
├────┬──────────────────────┬───────┬─────────────────────────────┤
│    │                      │       │      Avaliação Formativa    │
│ N° │ Aluno(a)             │ Média ├──────┬──────┬──────┬────────┤
│    │                      │       │ AV.1 │ AV.2 │ AV.3 │ Form.. │
├────┼──────────────────────┼───────┼──────┼──────┼──────┼────────┤
│ 1  │ Alice Nogueira...    │ 7.7   │ 9.1  │ 8.5  │ 5.5  │ ...    │
│ 2  │ Ana Luiza Garcia...  │       │      │      │      │        │
└────┴──────────────────────┴───────┴──────┴──────┴──────┴────────┘
```

### 5.4 Fluxos de Dados

#### Fluxo: Lançamento de Nota em Formativa Composta
```
1. Professor clica na célula de atividade
2. Seleciona status (✓/✖/🟡)
3. Store atualiza registro_atividade
4. Trigger recalcula:
   └─► Nota da Formativa Composta
       └─► Nota AV.3 (média formativas)
           └─► Média Bimestral
5. UI atualiza todas as células afetadas
```

---

## 6. CASOS ESPECIAIS E EDGE CASES

### 6.1 Caligrafia como Formativa Exclusiva Composta

A Caligrafia é o caso mais complexo do sistema:

```
LÍNGUA PORTUGUESA
└── Formativas
    ├── Participação (genérica simples)
    ├── Tarefas (genérica composta)
    └── Caligrafia (exclusiva composta) ◄─── Caso especial
        ├── Texto 01
        ├── Texto 02
        ├── Redação
        └── Caderno
```

**Regra:** A nota de Caligrafia na disciplina de Língua Portuguesa é o TOTAL calculado na "planilha" de Caligrafia, que funciona como uma sub-disciplina.

### 6.2 Pontuação Customizada por Disciplina

Uma formativa genérica pode ter pontuação diferente em disciplinas diferentes:

```
Formativa: Comportamento (genérica simples)
├── Pontuação Padrão: 2 pontos
├── Em Ciências: 2 pontos (usa padrão)
├── Em Matemática: 2.5 pontos (customizado)
└── Em Ed. Física: 3 pontos (customizado)
```

### 6.3 Média vs Soma (Visualização)

O sistema deve permitir alternar entre duas visualizações:
- **Padrão:** Média das formativas (valor que vai para AV.3)
- **Alternativa:** Soma total (para métricas internas)

A soma pode passar de 10, mas a média nunca ultrapassa a pontuação máxima.

### 6.4 Recuperação e RPA (6º ano em diante)

No 2º Fundamental, há colunas adicionais:
- `recup01`, `recup02`: Notas de recuperação
- `RPA`: Simulado (opcional)
- Lógica de substituição de nota mais baixa

---

## 7. PALETA DE CORES (SESI)

```css
:root {
  /* Primárias */
  --sesi-blue-dark: #003366;
  --sesi-blue: #0066cc;
  --sesi-blue-light: #4d94ff;
  
  /* Neutras */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f7fa;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  
  /* Status */
  --success: #28a745;  /* ✓ Entregue */
  --danger: #dc3545;   /* ✖ Não entregue / Abaixo da corte */
  --warning: #ffc107;  /* 🟡 Falta */
  --info: #17a2b8;     /* Média OK */
}
```

---

## 8. PRÓXIMOS PASSOS (Roadmap)

### Fase 1: MVP (Web/Dev)
- [ ] Setup projeto (Vite + React + TS + Tailwind)
- [ ] Implementar stores (Zustand)
- [ ] CRUD de Alunos
- [ ] CRUD de Disciplinas
- [ ] CRUD de Formativas
- [ ] Tabela de lançamento de notas
- [ ] Cálculos automáticos
- [ ] Persistência com JSON/IndexedDB

### Fase 2: Funcionalidades Avançadas
- [ ] Importação CSV/XLSX
- [ ] Exportação de backup
- [ ] Formatação condicional completa
- [ ] Planilha de Caligrafia dedicada
- [ ] Resumo Anual

### Fase 3: Desktop (Electron)
- [ ] Migrar para Electron
- [ ] Implementar SQLite
- [ ] Build portável (electron-builder)
- [ ] Detecção de Google Drive/OneDrive

---

## 9. ANEXO: MAPEAMENTO EXCEL → SISTEMA

| Elemento Excel | Equivalente no Sistema |
|----------------|------------------------|
| Aba "Configurações" | Página de Configurações |
| Aba de Disciplina (Ciências, etc.) | Tabela na página Disciplinas |
| Aba "Caligrafia" | Modal/Sub-página de Formativa Composta |
| Célula com fórmula | Valor calculado automaticamente |
| Formatação condicional | Classes CSS dinâmicas |
| Comentário em célula | Botão "info" com modal de detalhes |
| Validação de dados | Input com min/max e validação |

---

*Documento gerado para o projeto SESI System - v1.0*
