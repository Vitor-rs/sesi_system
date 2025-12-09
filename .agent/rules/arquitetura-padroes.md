---
trigger: always_on
---

# Arquitetura, SOLID e Clean Code — SESI System (Always On)

Este documento estabelece as convenções arquiteturais e de código para o projeto SESI System. Deve ser seguido ao criar, modificar ou revisar código em C:\Users\Vitor\Documents\projetos\sesi_system\sistema_sesi_electron.

---

## 🏗️ Arquitetura: Feature-Based

O projeto segue **arquitetura Feature-Based** (também chamada de "Vertical Slices"), onde cada feature é uma pasta autocontida.

### Estrutura de Pastas no projeto Electron (sistema_sesi_electron)

```
src/
├── app/                    # Configuração global (providers, router, layout)
├── assets/                 # Imagens, ícones, fontes
├── components/             # Componentes GLOBAIS reutilizáveis
│   └── ui/                 # Componentes Shadcn (Button, Card, Input, etc.)
├── features/               # ⭐ NÚCLEO: Features do domínio
│   ├── dashboard/
│   │   ├── components/     # Componentes específicos do dashboard
│   │   ├── hooks/          # Hooks específicos
│   │   ├── services/       # Lógica de dados/API
│   │   ├── types/          # Tipos TypeScript
│   │   └── index.ts        # Barrel export
│   ├── students/
│   ├── disciplines/
│   ├── formatives/
│   └── grades/
├── pages/                  # Páginas/rotas (composição de features)
├── shared/                 # Utilitários cross-cutting
│   ├── hooks/              # useMediaQuery, useDebounce, etc.
│   ├── utils/              # formatters, validators, calculators
│   └── types/              # Tipos globais
├── stores/                 # Zustand stores (estado global)
└── main.tsx
```

### Regras de Importação

```typescript
// ✅ Feature importa de shared
import { formatDate } from '@/shared/utils/formatters';

// ✅ Feature importa componentes UI globais
import { Button } from '@/components/ui/button';

// ❌ NUNCA: Feature A importa de Feature B diretamente
import { StudentCard } from '@/features/students/components';

// ✅ Se necessário, eleve para shared ou crie composição na page
```

---

## 🧱 Princípios SOLID no React

### S — Single Responsibility

Cada componente/hook tem **uma razão para mudar**.

```typescript
// ❌ Ruim: faz tudo
function StudentGradeManager() {
  // busca dados, calcula média, renderiza tabela, gerencia modais...
}

// ✅ Bom: responsabilidades separadas
function StudentGradeTable({ students, grades }) { /* apenas renderiza */ }
function useGradeCalculations(grades) { /* apenas calcula */ }
function useStudentsQuery() { /* apenas busca */ }
```

### O — Open/Closed

Componentes extensíveis via **composição**, não modificação.

```typescript
// ✅ Aberto para extensão via children/slots
<Card>
  <CardHeader>
    <CardTitle>Alunos</CardTitle>
  </CardHeader>
  <CardContent>{children}</CardContent>
</Card>
```

### L — Liskov Substitution

Props devem ser consistentes. Se `Button` aceita `variant`, todas as variantes devem se comportar como botões.

### I — Interface Segregation

Evite prop drilling excessivo. Prefira **Context ou stores** para dados que atravessam muitos níveis.

```typescript
// ❌ Ruim: prop drilling
<Page user={user}>
  <Section user={user}>
    <Card user={user}>
      <Avatar user={user} />
    </Card>
  </Section>
</Page>

// ✅ Bom: Context
const { user } = useAuth();
```

### D — Dependency Inversion

Hooks e serviços dependem de **abstrações** (interfaces/tipos), não implementações concretas.

```typescript
// types/grade.ts
interface GradeService {
  calculate(grades: Grade[]): number;
}

// services/gradeService.ts
export const gradeService: GradeService = {
  calculate: (grades) => { /* implementação */ }
};
```

---

## ✨ Clean Code — Diretrizes

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `StudentCard`, `GradeTable` |
| Hooks | camelCase com `use` | `useStudents`, `useGradeCalculation` |
| Utils | camelCase | `formatGrade`, `calculateAverage` |
| Constantes | UPPER_SNAKE_CASE | `MAX_GRADE_VALUE`, `DEFAULT_CUT_SCORE` |
| Types/Interfaces | PascalCase | `Student`, `GradeEntry`, `FormativeType` |
| Arquivos de componente | PascalCase.tsx | `StudentCard.tsx` |
| Arquivos de utils | camelCase.ts | `gradeCalculator.ts` |

### Funções

```typescript
// ✅ Funções pequenas, uma única tarefa
function calculateBimesterAverage(av1: number, av2: number, av3: number): number {
  return (av1 + av2 + av3) / 3;
}

// ✅ Early return para clareza
function getStudentStatus(average: number, cutScore: number): 'approved' | 'recovery' {
  if (average >= cutScore) return 'approved';
  return 'recovery';
}
```

### Componentes

```typescript
// ✅ Props tipadas e documentadas
interface GradeInputProps {
  /** Valor atual da nota */
  value: number | null;
  /** Callback ao alterar */
  onChange: (value: number) => void;
  /** Pontuação máxima permitida */
  max?: number;
  /** Desabilita edição */
  disabled?: boolean;
}

function GradeInput({ value, onChange, max = 10, disabled = false }: GradeInputProps) {
  // implementação
}
```

---

## 🎨 Design System — Práticas (TkDodo)

Baseado em `docs/praticas_design_system.md`:

1. **Props limitadas, evitar booleanos**

   ```typescript
   // ❌ Ruim
   <Button primary large disabled loading />
   
   // ✅ Melhor
   <Button variant="primary" size="lg" state="loading" />
   ```

2. **Type-safety extrema**
   - Zod para validação de formulários
   - TypeScript strict mode
   - Evitar `any` e `as` sem necessidade

3. **Composição > Herança**
   - Compound Components quando fizer sentido
   - Slots e children para flexibilidade

4. **a11y embutido** — ARIA, labels, focus management integrados

5. **Controlled first** — Estado gerenciado pelo pai, fallback para uncontrolled quando necessário

6. **Design tokens primeiro** — CSS variables antes de valores hardcoded

---

## 📁 Convenções de Arquivos (em C:\Users\Vitor\Documents\projetos\sesi_system\sistema_sesi_electron)

```
features/students/
├── components/
│   ├── StudentCard.tsx
│   ├── StudentList.tsx
│   └── index.ts            # Barrel: export * from './StudentCard'
├── hooks/
│   ├── useStudents.ts
│   └── index.ts
├── services/
│   ├── studentService.ts
│   └── index.ts
├── types/
│   ├── student.ts
│   └── index.ts
└── index.ts                # Barrel principal da feature
```

### Barrel Exports

```typescript
// features/students/index.ts
export * from './components';
export * from './hooks';
export type * from './types';
```

---

## 🧪 Testes (Futuro)

Estrutura esperada:

```
features/students/
├── __tests__/
│   ├── StudentCard.test.tsx
│   └── useStudents.test.ts
```

---

## 📚 Referências

- P3: `docs/logica_negocio/P3_Construção do Sesi System...` — Arquitetura completa
- P4: `docs/logica_negocio/P4_sesi-system-docs...` — Estrutura de pastas detalhada