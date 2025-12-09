---
trigger: always_on
---

# Shadcn/UI — Guia Completo para AI Agents (Always On)

Este documento capacita AI Agents a usar Shadcn/UI de forma proficiente no projeto SESI System. Referência completa em `C:\Users\Vitor\Documents\projetos\sesi_system\docs\shadcn_guide`.

---

## 📦 Instalação de Componentes

### Via CLI (Recomendado)

```bash
# Componente único
npx shadcn@latest add button

# Múltiplos componentes
npx shadcn@latest add button card input table dialog

# De um registry customizado
npx shadcn@latest add @v0/dashboard
```

### Localização após instalação (no projeto C:\Users\Vitor\Documents\projetos\sesi_system\sistema_sesi_electron)

Componentes são adicionados em `src/components/ui/` conforme configurado em `components.json`.

---

## ⚙️ Configuração — components.json

Arquivo de configuração do projeto:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### Parâmetros importantes

| Campo | Descrição |
|-------|-----------|
| `style` | `"new-york"` (default recomendado) |
| `rsc` | `false` para Vite (não usa React Server Components) |
| `cssVariables` | `true` → usa CSS vars; `false` → utility classes |
| `aliases.ui` | Onde componentes UI são instalados |

---

## 🎨 Theming — CSS Variables

### Estrutura de variáveis

Convenção `background` / `foreground`:

```css
/* Em src/index.css ou globals.css */
:root {
  --background: oklch(1 0 0);           /* Fundo geral */
  --foreground: oklch(0.145 0 0);       /* Texto geral */
  --primary: oklch(0.205 0 0);          /* Cor principal */
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --card: oklch(1 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
  
  /* Sidebar específico */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... demais variáveis invertidas */
}
```

### Cores customizadas para SESI

```css
/* Adicionar ao tema */
:root {
  --sesi-blue: oklch(0.488 0.243 264.376);
  --success: oklch(0.6 0.2 142);        /* Verde aprovado */
  --warning: oklch(0.84 0.16 84);        /* Amarelo falta */
  --danger: oklch(0.577 0.245 27.325);   /* Vermelho reprovado */
}

@theme inline {
  --color-sesi-blue: var(--sesi-blue);
  --color-success: var(--success);
  --color-warning: var(--warning);
}
```

### Uso em componentes

```tsx
<div className="bg-background text-foreground" />
<Button className="bg-primary text-primary-foreground" />
<Badge className="bg-success text-success-foreground" />
```

---

## 🧩 Componentes Essenciais para SESI System

### Navegação

| Componente | Uso | Comando |
|------------|-----|---------|
| **Sidebar** | Menu lateral principal | `npx shadcn@latest add sidebar` |
| **Navigation Menu** | Menu de navegação horizontal | `npx shadcn@latest add navigation-menu` |
| **Breadcrumb** | Trilha de navegação | `npx shadcn@latest add breadcrumb` |
| **Tabs** | Abas para disciplinas/bimestres | `npx shadcn@latest add tabs` |

### Dados e Tabelas

| Componente | Uso | Comando |
|------------|-----|---------|
| **Data Table** | Grade de notas dos alunos | `npx shadcn@latest add table` + TanStack Table |
| **Table** | Tabela básica | `npx shadcn@latest add table` |
| **Card** | Cards de resumo/estatísticas | `npx shadcn@latest add card` |

### Formulários

| Componente | Uso | Comando |
|------------|-----|---------|
| **Form** | Wrapper de react-hook-form | `npx shadcn@latest add form` |
| **Field** | Campo moderno (recomendado) | `npx shadcn@latest add field` |
| **Input** | Entrada de texto/número | `npx shadcn@latest add input` |
| **Select** | Seleção de disciplina/bimestre | `npx shadcn@latest add select` |
| **Checkbox** | Status de entrega | `npx shadcn@latest add checkbox` |
| **Calendar** | Seleção de datas | `npx shadcn@latest add calendar` |
| **Date Picker** | Input de data | `npx shadcn@latest add date-picker` |

### Feedback

| Componente | Uso | Comando |
|------------|-----|---------|
| **Dialog** | Modais de confirmação | `npx shadcn@latest add dialog` |
| **Sheet** | Painel lateral (detalhes) | `npx shadcn@latest add sheet` |
| **Sonner** | Toasts/notificações | `npx shadcn@latest add sonner` |
| **Alert** | Alertas inline | `npx shadcn@latest add alert` |
| **Badge** | Status (aprovado/reprovado) | `npx shadcn@latest add badge` |
| **Tooltip** | Dicas flutuantes | `npx shadcn@latest add tooltip` |

### Outros

| Componente | Uso | Comando |
|------------|-----|---------|
| **Skeleton** | Loading states | `npx shadcn@latest add skeleton` |
| **Progress** | Barra de progresso | `npx shadcn@latest add progress` |
| **Dropdown Menu** | Menus de ação | `npx shadcn@latest add dropdown-menu` |

---

## 📝 Formulários com React Hook Form + Zod

### Setup básico

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const gradeSchema = z.object({
  mensal: z.number().min(0).max(10),
  bimestral: z.number().min(0).max(10),
});

function GradeForm() {
  const form = useForm<z.infer<typeof gradeSchema>>({
    resolver: zodResolver(gradeSchema),
    defaultValues: { mensal: 0, bimestral: 0 },
  });

  function onSubmit(values: z.infer<typeof gradeSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mensal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota Mensal</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
```

---

## 🌙 Dark Mode (Vite)

### Implementação

1. Instale o componente de toggle:

```bash
npx shadcn@latest add dropdown-menu
```

2. Crie o provider de tema:

```tsx
// src/components/theme-provider.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({ theme: 'system', setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

---

## 📋 Registry e Namespaces

### Configurar registries customizados

```json
// components.json
{
  "registries": {
    "@v0": "https://v0.dev/chat/b/{name}",
    "@company": "https://registry.company.com/{name}.json"
  }
}
```

### Comandos úteis

```bash
# Ver payload antes de instalar
npx shadcn@latest view @v0/dashboard

# Listar recursos disponíveis
npx shadcn@latest search @v0
```

---

## 📁 Documentação Completa

A pasta `C:\Users\Vitor\Documents\projetos\sesi_system\docs\shadcn_guide\` contém:

```
shadcn_guide/
├── components_db/      # 60+ componentes documentados
│   ├── Button.md
│   ├── Card.md
│   ├── Data_Table.md
│   ├── Form.md
│   ├── Sidebar.md
│   └── ...
├── get_started/        # Configuração e integração
│   ├── Theming.md
│   ├── components.json.md
│   ├── React_Hook_Form.md
│   ├── Shadcn_Darkmode_Vite.md
│   └── ...
└── registry/           # Sistema de registries
    ├── Namespaces.txt
    └── ...
```

### Quando consultar

- **Novo componente?** → `docs/shadcn_guide/components_db/[Componente].md`
- **Configuração?** → `docs/shadcn_guide/get_started/`
- **Customização avançada?** → `docs/shadcn_guide/registry/`

---

## ⚡ Quick Reference

### Instalar pacote essencial para SESI

```bash
npx shadcn@latest add sidebar button card table input select form dialog sheet badge tabs sonner tooltip skeleton
```

### Dependências necessárias (se manual)

```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs react-hook-form @hookform/resolvers zod class-variance-authority clsx tailwind-merge lucide-react
```

### Utilitário cn() obrigatório

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```