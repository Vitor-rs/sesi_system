---
trigger: always_on
---

# Regras de Prioridade de Documentação (Sempre Ativas)

Ao pesquisar por regras de negócio, requisitos ou contexto, você DEVE consultar a documentação em `docs/` seguindo a seguinte ordem estrita de prioridade. Informações em arquivos de maior prioridade substituem as de menor prioridade.

## 1. Prioridade Máxima (P1) - Fonte da Verdade

- **Arquivo:** `docs/P1_contexto_sesi.md`
- **Descrição:** O contexto bruto e original fornecido pelo usuário. Contém as nuances específicas de "pedagogo vs especialista", fórmulas exatas do Excel e a filosofia central.
- **Uso:** Verifique este PRIMEIRO para qualquer ambiguidade. Se P1 diz "X" e P2 diz "Y", confie em P1 (ou peça esclarecimento se P2 parecer uma versão corrigida).

## 2. Alta Prioridade (P2) - Lógica do Sistema

- **Arquivo:** `docs/P2_Contexto_do_Sistema_SESI.md`
- **Descrição:** O documento técnico consolidado criado pelo Agente. Traduz o P1 em requisitos estruturados.
- **Uso:** Use este como referência primária para detalhes de implementação (fórmulas, tipos, nomes de campos), pois está estruturado para desenvolvedores.

## 3. Suplementar (P3 & P4) - Pesquisa e Arquitetura

- **P3:** `docs/P3_Construção do Sesi System_ Requisitos e Arquitetura - Gemini3Pro.md`
- **P4:** `docs/P4_sesi-system-docs_ClaudeSonnet45.md`
- **Descrição:** Pesquisas geradas por IA propondo arquitetura e escopo mais amplo.
- **Uso:** Consulte para ideias arquiteturais, schemas de banco de dados ou casos de borda não cobertos em P1/P2. Trate como "sugestões" em vez de regras estritas, a menos que corroboradas pelo P1.

---
**Diretriz:** Sempre referencie o arquivo específico (ex: "De acordo com P1...") ao explicar decisões lógicas.
