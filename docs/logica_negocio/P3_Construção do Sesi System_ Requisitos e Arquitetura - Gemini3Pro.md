

# **Especificação Técnica e Arquitetural do Sesi System: Relatório Abrangente de Engenharia de Software e Lógica de Negócio**

## **1 Visão Estratégica e Contextualização do Ecossistema**

O desenvolvimento do "Sesi System" não constitui apenas a criação de um software de gestão escolar convencional; trata-se da arquitetura de um ecossistema digital que deve suportar a complexidade híbrida da educação básica regular, a educação de jovens e adultos (EJA) e a integração técnica com o SENAI, conforme evidenciado nos documentos normativos e na estrutura organizacional da instituição.1 A análise aprofundada do material de pesquisa revela que o SESI opera sob um modelo de "Rede Federada", onde diretrizes nacionais coexistem com especificidades regionais (Departamentos Regionais \- DRs), exigindo um sistema que seja, simultaneamente, padronizado em sua espinha dorsal de dados e flexível em suas regras de negócio locais.2

A atual infraestrutura tecnológica, conforme indicado pela necessidade de substituição de múltiplos sistemas legados e a integração com ERPs de mercado como TOTVS e soluções de biblioteca como Sophia, aponta para um cenário de fragmentação de dados que o Sesi System deve resolver.5 O objetivo estratégico é centralizar a gestão acadêmica, pedagógica e financeira, garantindo a integridade da informação desde a matrícula até a emissão de certificados, passando pelo complexo motor de avaliação formativa e somativa detalhado nas imagens fornecidas.

### **1.1. O Imperativo da Modernização e Integração**

A transição para um sistema unificado, conforme relatado na implementação do SGE no Amapá e em outras regionais, visa otimizar a jornada de trabalho dos docentes e gestores, reduzindo o retrabalho manual e os custos operacionais.5 O Sesi System deve atuar como o "Master Data Management" (MDM) para o domínio educacional, orquestrando informações que fluem para o ERP corporativo (para faturamento e contratos) e recebendo dados de plataformas de aprendizado (LMS) e governamentais (Censo Escolar). A arquitetura deve prever, portanto, não apenas interfaces de usuário, mas uma camada robusta de interoperabilidade capaz de suportar o volume transacional de matrículas, diários de classe e avaliações em tempo real.7

### **1.2. O Desafio do Novo Ensino Médio e Itinerários Formativos**

Um dos requisitos mais críticos e complexos identificados reside na adequação ao Novo Ensino Médio. Diferente do modelo tradicional seriado, a nova legislação e a proposta pedagógica do SESI/SENAI exigem uma gestão curricular baseada em "Itinerários Formativos" e créditos de horas, muitas vezes cursados em unidades do SENAI ou via EAD.1 O sistema deve abandonar a lógica rígida de "Turma Estanque" para adotar uma lógica de "Matrícula por Componente/Unidade Curricular", onde um aluno pertence a uma turma de referência para a Formação Geral Básica (FGB), mas se mistura com outros estudantes nos itinerários de aprofundamento ou técnicos.

---

## **2 Análise Profunda da Lógica de Negócio e Regras Pedagógicas**

A "alma" do Sesi System reside no seu motor de cálculo de notas e regras de aprovação. A análise das imagens de planilhas de controle (Images 1-7) e dos excertos dos regimentos escolares 2 permite a extração de algoritmos precisos que devem ser codificados no backend da aplicação.

### **2.1. O Motor de Avaliação Multidimensional**

Ao contrário de sistemas simples que registram apenas uma nota final, o modelo pedagógico do SESI, visualizado nas Planilhas Avaliativas (Image 1, Image 5, Image 6), exige uma decomposição granular da avaliação.

**Tabela 1: Decomposição da Lógica de Avaliação Formativa (Baseado na Imagem 1 e 6\)**

| Componente Avaliativo | Peso/Pontos Típicos | Lógica do Sistema |
| :---- | :---- | :---- |
| **Participação** | 2.0 | Input manual do professor, cumulativo ao longo do bimestre. Deve permitir anotações qualitativas (rubricas). |
| **Registro de Atividades** | 2.0 | Vinculado à entrega de tarefas. O sistema deve permitir check-in de tarefas (Entregue/Não Entregue) que calcula a nota proporcional. |
| **Disciplina** | 2.0 | Calculado inversamente ou diretamente baseado em ocorrências disciplinares registradas no módulo de comportamento. |
| **Caligrafia/Tarefas** | 4.0 | Avaliação específica de competência. Requer interface de rubrica (ex: Legibilidade, Ortografia) conforme Image 5\. |
| **Avaliações Somativas** | Variável (ex: 10.0) | Provas mensais ou bimestrais. Geralmente possuem peso maior na composição da média final. |

**Implicação Arquitetural:** O banco de dados não pode ter uma coluna fixa nota\_participacao. É necessário uma estrutura de **"Critérios de Avaliação Dinâmicos"**, onde a coordenação define a matriz de avaliação (ex: 1º Bimestre \= 30% Formativa \+ 70% Somativa) e o sistema gera as colunas correspondentes no Diário de Classe Digital do professor.

### **2.2. Algoritmos de Recuperação e Consolidação de Notas**

A regra de negócio mais complexa, fonte frequente de erros em sistemas manuais, é a lógica de **Substituição Condicional de Notas** (Recuperação), detalhada nos regimentos 2 e visível na comparação de colunas das planilhas (Image 2, Image 3).

#### **2.2.1. Recuperação Paralela (Trimestral/Bimestral)**

A recuperação paralela ocorre *dentro* do período letivo. O sistema deve identificar automaticamente alunos com rendimento inferior ao limiar (ex: 7,0 ou 70%) e abrir a pauta de recuperação para o professor.

* Lógica de Substituição ($L\_{subst}$):  
  O regimento define que a nota da recuperação substitui a nota anterior se e somente se for maior.2  
  Seja $N\_{per}$ a nota do período e $N\_{rec}$ a nota da recuperação.

  $$N\_{final\\\_per} \= \\max(N\_{per}, N\_{rec})$$

  Nuance: Em algumas configurações regionais, a recuperação pode não substituir a nota integralmente, mas compor uma nova média. O Sesi System deve possuir uma "Flag de Configuração de Cálculo" por Unidade Escolar para alternar entre Substituição Total, Média Aritmética ou Substituição Parcial.

#### **2.2.2. Recuperação Final e Aprovação Anual**

A recuperação final (Image 4\) é um evento pós-calendário regular. O cálculo da Média Anual ($M\_{anual}$) e a decisão de aprovação envolvem múltiplas etapas verificadas nas imagens de "Resumo Anual".

* Cálculo da Média Anual ($M\_{anual}$):  
  Geralmente uma média ponderada dos bimestres/trimestres.

  $$M\_{anual} \= \\frac{\\sum (N\_{bimestre\\\_i} \\times Peso\_i)}{\\sum Peso\_i}$$

  A Imagem 2 sugere pesos diferenciados ou soma simples dependendo da configuração da série (ex: 1º, 2º, 3º e 4º Bimestres podem ter pesos 1, 1, 2, 2 ou uniformes).  
* **Lógica do Status Final:**  
  1. Se $M\_{anual} \\geq 7.0$ (e Frequência $\\geq$ 75%) $\\rightarrow$ **APROVADO**.  
  2. Se $M\_{anual} \< 7.0$ $\\rightarrow$ **EXAME/RECUPERAÇÃO FINAL**.  
  3. Após Exame ($N\_{exame}$):

     $$M\_{pos\\\_exame} \= \\text{RegraDeNegocio}(M\_{anual}, N\_{exame})$$

     Nota: A regra visualizada na Imagem 4 sugere que a nota do exame precisa garantir uma média combinada ou superar um teto. O sistema deve calcular o "Quanto falta?" (Pontos Necessários) e exibir isso no portal do aluno e do professor.11

### **2.3. Controle de Frequência e Evasão**

A legislação exige 75% de frequência para aprovação.2 O sistema não deve apenas contar "Presenças". Ele deve distinguir:

* **Faltas Não Justificadas:** Impactam o percentual de frequência.  
* **Faltas Justificadas (Atestado):** Podem ou não abater do cálculo dependendo da interpretação legal da regional, mas devem ficar registradas para fins de amparo legal.  
* **Abono de Faltas:** Casos específicos (ex: serviço militar, representação esportiva oficial) que efetivamente anulam a falta.

**Requisito de Alerta:** O sistema deve implementar "Gatilhos de Evasão". Se a frequência do aluno cair abaixo de 80% em um mês, um alerta deve ser enviado à Equipe de Orientação Educacional para acionar a "Busca Ativa", integrando com o módulo de comunicação com a família.12

### **2.4. Gestão Curricular do Novo Ensino Médio**

A complexidade aumenta exponencialmente no Ensino Médio devido à integração SESI/SENAI.3 O sistema deve gerenciar:

* **Dupla Matrícula:** O aluno pode ter um vínculo no SESI (Educação Básica) e outro no SENAI (Técnico), ou um vínculo único integrado. O sistema deve saber importar notas do sistema do SENAI ou permitir o lançamento unificado.  
* **Cômputo de Horas:** A aprovação não é apenas por nota, mas pelo cumprimento de cargas horárias específicas nos itinerários (ex: 1.200h de formação técnica). O "Histórico Escolar" gerado deve refletir essa segregação de horas por eixo temático.9

---

## **3. Levantamento Exaustivo de Requisitos do Sistema**

Com base na análise documental e nas necessidades implícitas de um sistema dessa envergadura, os requisitos foram categorizados por módulos funcionais.

### **3.1. Módulo Secretaria Acadêmica (Core)**

* **REQ-SEC-001 (Gestão de Enturmação Flexível):** O sistema deve permitir vincular alunos a turmas baseadas em disciplinas individuais, suportando a mistura de alunos de diferentes turmas de origem em disciplinas eletivas ou itinerários.  
* **REQ-SEC-002 (Matrícula e Rematrícula Online):** Capacidade de upload de documentos (OCR para leitura de RG/CPF), aceite digital de contrato (integração com assinatura eletrônica) e verificação automática de pendências financeiras no ERP.5  
* **REQ-SEC-003 (Geração de Documentos Oficiais):** Motor de relatórios capaz de gerar PDFs assinados digitalmente (ICP-Brasil) para Históricos Escolares, Declarações de Vaga e Boletins, seguindo layouts customizáveis por Regional.13  
* **REQ-SEC-004 (Controle de Vagas e Filas):** Gestão de capacidade física das salas versus capacidade pedagógica, com gestão automatizada de lista de espera.

### **3.2. Módulo Pedagógico (Portal do Professor)**

* **REQ-PED-001 (Diário de Classe Offline-First):** O aplicativo mobile do professor deve permitir o lançamento de frequência e notas mesmo sem internet, sincronizando quando houver conexão, devido à infraestrutura variável nas escolas.14  
* **REQ-PED-002 (Planejamento de Aulas \- BNCC):** Interface para criação de planos de aula (semanais/mensais) com seleção de habilidades e competências da BNCC pré-carregadas. O sistema deve sugerir códigos BNCC baseados no conteúdo digitado (via busca semântica simples).10  
* **REQ-PED-003 (Mapa de Sala Visual):** Interface gráfica para tomada de frequência baseada no layout das carteiras na sala de aula, facilitando a identificação visual dos alunos.  
* **REQ-PED-004 (Dashboard de Desempenho):** Visualização gráfica para o professor identificar rapidamente alunos em risco de retenção (farol vermelho/amarelo/verde) com base nas notas parciais lançadas.16

### **3.3. Módulo de Avaliação e Resultados**

* **REQ-AVAL-001 (Conversão Automática de Conceitos):** O sistema deve possuir tabelas de equivalência configuráveis (ex: Conceito "Plenamente Satisfatório" \= 10.0 para fins de média) para lidar com a transição entre ciclos de ensino que usam escalas diferentes.17  
* **REQ-AVAL-002 (Auditoria de Notas):** Todo lançamento ou alteração de nota após o fechamento do bimestre deve exigir justificativa obrigatória e gerar log de auditoria (quem alterou, quando, valor anterior, valor novo).18  
* **REQ-AVAL-003 (Cálculo de Médias Ponderadas Complexas):** Suporte nativo para fórmulas customizáveis de média (ex: $(N1 \\times 2 \+ N2 \\times 3\) / 5$) definidas no nível da disciplina ou série.11

### **3.4. Módulo Financeiro e Integração ERP**

* **REQ-FIN-001 (Espelho Financeiro):** O Sesi System não gere o dinheiro, mas deve exibir o status financeiro. Deve consumir APIs do TOTVS/SAP para mostrar "Adimplente/Inadimplente" e bloquear serviços não-essenciais (como renovação de matrícula, resguardando direitos legais).5  
* **REQ-FIN-002 (Emissão de Boletos via Portal):** Integração para visualização e impressão de boletos bancários gerados pelo ERP diretamente no Portal do Responsável.

### **3.5. Módulo de Comunicação e Família**

* **REQ-COM-001 (Agenda Digital):** Substituição da agenda física. Envio de comunicados, deveres de casa e ocorrências comportamentais com notificação push para o App dos Pais.12  
* **REQ-COM-002 (Autorizações Digitais):** Solicitação de autorização para passeios e eventos com "Aceite" digital pelo responsável.

### **3.6. Requisitos Não-Funcionais (RNF)**

* **RNF-SEG-001 (LGPD e Privacidade):** Mascaramento de dados sensíveis em ambientes de teste. Criptografia de ponta a ponta para dados de saúde e pedagógicos. Controle rígido de acesso baseado em papéis (RBAC).  
* **RNF-DES-001 (Escalabilidade Sazonal):** A arquitetura deve suportar picos de carga de 50x o tráfego normal durante dias de divulgação de resultados e abertura de matrículas.  
* **RNF-INT-001 (Interoperabilidade):** Uso obrigatório de APIs RESTful documentadas (Swagger/OpenAPI) para todas as transações, permitindo futura integração com IA ou novos frontends.

---

## **4\. Arquitetura de Solução e Design de Sistema**

A arquitetura proposta para o Sesi System é baseada em **Microsserviços Estruturados** (ou um Monolito Modular bem definido em sua fase inicial), priorizando a desacoplação entre os domínios Acadêmico, Financeiro e Pedagógico. A escolha tecnológica visa robustez, suporte de longo prazo e facilidade de contratação de mão de obra.

### **4.1. Diagrama Lógico da Arquitetura**

A estrutura divide-se em quatro camadas principais:

1. **Camada de Apresentação (Frontend/Client-Side):**  
   * *Portais Web (SPA):* React.js com Next.js. O Server-Side Rendering (SSR) do Next.js é crucial para SEO dos portais públicos e performance inicial dos dashboards complexos.  
   * *Aplicações Móveis:* React Native ou Flutter. Código único para Android/iOS, focando na experiência do professor (chamada rápida) e do aluno (consulta de notas).  
2. **Camada de Gateway e Segurança:**  
   * *API Gateway (Kong ou AWS API Gateway):* Ponto único de entrada. Gerencia rate limiting, roteamento e terminação SSL.  
   * *Identity Provider (IdP):* Keycloak ou Auth0. Gerencia autenticação (OIDC/OAuth2), SSO com Microsoft/Google e Federação de identidades (necessário para integrar bases do SESI e SENAI).  
3. **Camada de Serviços de Negócio (Backend):**  
   * *Core Acadêmico (Service):* Node.js (NestJS) ou Java (Spring Boot). Responsável pela "máquina de estados" do aluno (Ativo, Formado, Evadido) e estrutura de turmas.  
   * *Motor de Avaliação (Service):* Serviço isolado em Python ou Java, otimizado para cálculos matemáticos pesados e processamento em lote das médias de milhares de alunos.  
   * *Serviço de Integração (Adapter):* Responsável por traduzir chamadas do Sesi System para o "dialeto" do TOTVS (Protheus/RM) e Sophia.6  
   * *Gerador de Documentos:* Serviço baseado em filas (RabbitMQ) que processa a geração assíncrona de PDFs pesados (Boletins em lote) para não travar a requisição do usuário.  
4. **Camada de Dados e Persistência:**  
   * *Banco Relacional (PostgreSQL):* Dados estruturados, transacionais e relacionais (Alunos, Notas, Turmas). O uso de JSONB no Postgres permite flexibilidade para armazenar as estruturas variáveis de critérios de avaliação sem quebrar o schema.  
   * *Cache (Redis):* Armazenamento de sessões de usuário e cache de consultas frequentes (ex: Matriz Curricular, Dados da Turma) para aliviar o banco relacional.  
   * *Data Lake / Analytics:* Réplica de leitura ou envio de eventos para um Data Warehouse (Snowflake/BigQuery) para geração de dashboards gerenciais de BI.

### **4.2. Modelagem de Dados (Entidades Principais)**

A modelagem deve refletir a complexidade das regras de negócio. Abaixo, uma representação textual das principais tabelas e seus relacionamentos críticos.

**Tabela 2: Dicionário de Dados Críticos e Relacionamentos**

| Entidade | Atributos Chave | Relacionamentos e Lógica |
| :---- | :---- | :---- |
| Student | id (UUID), registry\_number (Matrícula), person\_id (FK) | Vinculado a uma Person para evitar duplicidade se o aluno virar funcionário ou pai. |
| CurriculumMatrix | id, name, regulatory\_code, year\_validity | Define a estrutura do curso. Fundamental para o histórico. |
| EvaluationCriteria | id, discipline\_id, period\_id, name (ex: Tarefa), weight, max\_score | Tabela que flexibiliza a avaliação. Permite que Matemática tenha critérios diferentes de Artes. |
| GradeEntry | id, student\_id, criteria\_id, value\_numeric, value\_conceptual, audit\_log (JSON) | Armazena a nota. O campo audit\_log é crucial para rastreabilidade de alterações. |
| ClassEnrollment | id, student\_id, class\_id, status | Permite que o aluno tenha múltiplos vínculos de turma (ex: Turma A para FGB, Turma Robótica para Itinerário). |
| RecoveryLog | id, original\_grade\_id, recovery\_grade, applied\_rule (Substituição/Média) | Rastreia o histórico de recuperações para explicar como a nota final foi atingida. |

### **4.3. Estratégia de Integração e Interoperabilidade**

A integração não é um acessório, é um requisito funcional.

1. **Sincronização com ERP (Financeiro/RH):**  
   * *Padrão:* Event-Driven Architecture (EDA).  
   * *Fluxo:* Quando uma matrícula é assinada no Sesi System $\\rightarrow$ Publica evento StudentEnrolled no Kafka $\\rightarrow$ ERP consome e gera contrato financeiro.  
   * *Fluxo Reverso:* ERP confirma pagamento $\\rightarrow$ Publica PaymentConfirmed $\\rightarrow$ Sesi System libera rematrícula.  
2. **Integração com Bibliotecas (Sophia):**  
   * *Padrão:* API REST síncrona.  
   * *Uso:* O sistema Sophia consulta a API do Sesi System (GET /api/v1/students/{id}/status) para verificar se o aluno está ativo antes de emprestar um livro.6  
3. **Exportação para Censo Escolar (Educacenso):**  
   * *Implementação:* Job noturno (Batch) que extrai dados do PostgreSQL, valida contra as regras do INEP e gera o arquivo de texto ou XML para importação no sistema do governo.

## **5\. Roteiro de Implementação e Mitigação de Riscos**

A substituição de sistemas legados 5 exige uma estratégia de "Strangler Fig" (substituição gradual).

1. **Fase 1: Core Acadêmico e Migração de Dados:** Migrar cadastros de alunos e histórico. Implementar matrícula online. Manter o diário de classe no legado por um semestre enquanto o novo é testado em piloto.  
2. **Fase 2: Motor de Avaliação e Diário Digital:** Virada de chave para o uso do Sesi System pelos professores. Treinamento intensivo sobre a nova lógica de lançamento de rubricas e recuperação.  
3. **Fase 3: Integração Total e Novo Ensino Médio:** Implementação completa da lógica de itinerários e integração profunda com o SENAI e ERP.

**Riscos Críticos:**

* *Qualidade dos Dados Legados:* Nomes duplicados, históricos incompletos. Necessário criar scripts de saneamento (Sanitization) antes da importação.  
* *Resistência do Usuário:* Professores acostumados com o sistema antigo. A UX do novo Portal do Professor deve ser radicalmente superior (mais rápida e intuitiva) para garantir adoção.

## **6\. Conclusão**

A especificação técnica do Sesi System apresentada neste relatório desenha uma solução robusta, capaz de atender não apenas às demandas operacionais de registro de notas e faltas, mas também aos imperativos estratégicos de modernização pedagógica e eficiência de gestão do SESI. Ao incorporar a lógica complexa de avaliação formativa e recuperação diretamente na arquitetura de dados, e ao prever a flexibilidade necessária para o Novo Ensino Médio, o sistema se posiciona como uma ferramenta habilitadora da excelência educacional. A arquitetura de microsserviços e a estratégia de integração orientada a eventos garantem que o Sesi System não será uma ilha de dados, mas o coração pulsante de um ecossistema conectado, transparente e eficiente.

#### **Referências citadas**

1. Ensino Médio \- Escola SESI \- Infantil, Fundamental e Médio, acessado em novembro 30, 2025, [https://www.escolasesisc.com.br/ensino-medio/](https://www.escolasesisc.com.br/ensino-medio/)  
2. REGIMENTO ESCOLAR \- Rede Sesi-DF de Educação, acessado em novembro 30, 2025, [https://sesidf.org.br/wp-content/uploads/2022/08/regimento-escolar-rede-sesi-df-de-educacao.pdf](https://sesidf.org.br/wp-content/uploads/2022/08/regimento-escolar-rede-sesi-df-de-educacao.pdf)  
3. PROPOSTA PEDAGÓGICA, acessado em novembro 30, 2025, [https://cronos-media.sesisenaisp.org.br/api/media/1-0/files?file=arq\_125\_231011\_ac7c20dd-0f7c-417f-bf2a-98f86161a301.pdf\&disposition=false](https://cronos-media.sesisenaisp.org.br/api/media/1-0/files?file=arq_125_231011_ac7c20dd-0f7c-417f-bf2a-98f86161a301.pdf&disposition=false)  
4. Regimento Comum das Unidades Escolares do SESI SENAI, acessado em novembro 30, 2025, [https://sesigoias.com.br/repositoriosites/repositorio/sesi/editor/Image/regimentoescolas\_sesisenai.pdf](https://sesigoias.com.br/repositoriosites/repositorio/sesi/editor/Image/regimentoescolas_sesisenai.pdf)  
5. Sistema de Gestão Escolar é apresentado aos técnicos de educação do SESI e do SENAI Amapá, acessado em novembro 30, 2025, [https://www.ap.sesi.org.br/noticias/sistema-de-gestao-escolar-e-apresentado-aos-tecnicos-de-educacao-do-sesi-e-do-senai-amapa.html](https://www.ap.sesi.org.br/noticias/sistema-de-gestao-escolar-e-apresentado-aos-tecnicos-de-educacao-do-sesi-e-do-senai-amapa.html)  
6. Sophia: Home, acessado em novembro 30, 2025, [https://sophia.com.br/](https://sophia.com.br/)  
7. ERP educacional: benefícios e principais módulos \- TOTVS, acessado em novembro 30, 2025, [https://www.totvs.com/blog/instituicao-de-ensino/erp-educacional/](https://www.totvs.com/blog/instituicao-de-ensino/erp-educacional/)  
8. Transforme a sua instituição de ensino com nosso sistema de gestão educacional \- TOTVS, acessado em novembro 30, 2025, [https://www.totvs.com/educacional/totvs-educacional/](https://www.totvs.com/educacional/totvs-educacional/)  
9. Proposta Pedagógica 2023/ 2024, acessado em novembro 30, 2025, [https://cronos-media.sesisenaisp.org.br/api/media/1-0/files?file=arq\_85\_230814\_25ef99d8-ca70-46a4-a90d-b88991eeaecf.pdf\&disposition=false](https://cronos-media.sesisenaisp.org.br/api/media/1-0/files?file=arq_85_230814_25ef99d8-ca70-46a4-a90d-b88991eeaecf.pdf&disposition=false)  
10. Proposta Pedagógica | Rede Sesi-DF de Educação, acessado em novembro 30, 2025, [https://sesidf.org.br/wp-content/uploads/2022/08/proposta-pedagogica-rede-sesi-df-de-educacao.pdf](https://sesidf.org.br/wp-content/uploads/2022/08/proposta-pedagogica-rede-sesi-df-de-educacao.pdf)  
11. Calculation of final school grades \- YouTube, acessado em novembro 30, 2025, [https://www.youtube.com/watch?v=kv-dJMyu1zo](https://www.youtube.com/watch?v=kv-dJMyu1zo)  
12. Bem-vindos ao ano letivo de 2022\! Rede Sesi de Educação Missão Promover ensino de qualidade ao trabalhador da indústria e se, acessado em novembro 30, 2025, [https://www.sesies.com.br/wp-content/uploads/2021/09/Guia-de-Pais-e-Alunos-2022.pdf](https://www.sesies.com.br/wp-content/uploads/2021/09/Guia-de-Pais-e-Alunos-2022.pdf)  
13. Manual-do-Aluno-2024.pdf \- Sesi ES, acessado em novembro 30, 2025, [https://sesies.com.br/wp-content/uploads/2024/01/Manual-do-Aluno-2024.pdf](https://sesies.com.br/wp-content/uploads/2024/01/Manual-do-Aluno-2024.pdf)  
14. PORTAL DO PROFESSOR : \- jacad, acessado em novembro 30, 2025, [https://ajuda.jacad.com.br/support/solutions/articles/151000184461-portal-do-professor](https://ajuda.jacad.com.br/support/solutions/articles/151000184461-portal-do-professor)  
15. Modelo de Plano de Aula Sesi.docx | PDF \- Scribd, acessado em novembro 30, 2025, [https://pt.scribd.com/document/934831547/Modelo-de-Plano-de-Aula-Sesi-docx](https://pt.scribd.com/document/934831547/Modelo-de-Plano-de-Aula-Sesi-docx)  
16. Portal do Docente \- Lançamento de Notas \- IFAL \- Instituto Federal de Alagoas, acessado em novembro 30, 2025, [https://www2.ifal.edu.br/o-ifal/tecnologia-da-informacao/manuais/sigaa/7-lancamento-de-notas.pdf](https://www2.ifal.edu.br/o-ifal/tecnologia-da-informacao/manuais/sigaa/7-lancamento-de-notas.pdf)  
17. 1\. sobre as notas, acessado em novembro 30, 2025, [https://cronos-media.sesisenaisp.org.br/api/media/1-0/files?file=arq\_165\_230925\_c5daaa15-2618-4884-b364-8a3bae4ca09b.pdf](https://cronos-media.sesisenaisp.org.br/api/media/1-0/files?file=arq_165_230925_c5daaa15-2618-4884-b364-8a3bae4ca09b.pdf)  
18. Portal do Professor | Lançar notas \- Activesoft, acessado em novembro 30, 2025, [https://ajuda.activesoft.com.br/hc/pt-br/articles/33629698719124-Portal-do-Professor-Lan%C3%A7ar-notas](https://ajuda.activesoft.com.br/hc/pt-br/articles/33629698719124-Portal-do-Professor-Lan%C3%A7ar-notas)