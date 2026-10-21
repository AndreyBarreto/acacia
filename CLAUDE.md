# CLAUDE.md — Acácia (aluguel por temporada em Jurerê)

O brief original e as regras de trabalho estão em [`claude.md`](claude.md) (minúsculo) e **continuam valendo**. Este arquivo guarda o contexto atual e as decisões tomadas. Quando houver conflito, vale a decisão registrada aqui.

Tarefas e protocolo para agentes: [`tasks/README.md`](tasks/README.md).

## Regra principal: simplicidade
- **Sempre a versão mais simples.** Não adicionar seções, conteúdo, funcionalidades nem ferramentas que o usuário não pediu.
- **Toda decisão é perguntada**, inclusive de conteúdo (o que entra numa página), não só as técnicas. Extras viram pergunta ("quer também X?"), nunca entram direto.
- Exemplo do que evitar: o "Como chegar" virou rotas de carro, ônibus e documentos de viagem, quando bastavam o endereço e um link para o Google Maps (2026-10-20).

## Contexto

- **Marca:** Acácia (o prédio é o "Residencial Acacia").
- **Imóveis no lançamento:** 2 apartamentos na Rua Luiz Rampa, 70, **Jurerê (Tradicional)**, Florianópolis/SC, a 50 m da praia. Apto 4 = com varanda e vista para o mar; apto 6 = térreo. Até 3 pessoas cada (cama de casal + sofá-cama). Dados em [`docs/booking-data.md`](docs/booking-data.md) e [`docs/project-info.md`](docs/project-info.md).
- **Público:** casais, famílias pequenas, argentinos/uruguaios e trabalho remoto/estadias longas.
- **Posicionamento:** intermediário, pé na areia. Marca acolhedora, direta e tranquila; nunca ostentosa, genérica nem festeira.
- **Tem CNPJ, em outro nome** (não "Acácia"); a família vai aos aptos (2026-10-20, T36).

## Decisões

Formato: decisão — motivo (data, tarefa de origem).

### Escopo e conteúdo
- O bairro é **Jurerê (Tradicional)**, não Jurerê Internacional como dizia o brief — é onde ficam os imóveis (2026-10-19, T01/T09).
- O lançamento tem **só os 2 apartamentos** do Booking; outros entram depois, editando arquivos (2026-10-19, T02).
- **Capacidade de 3 pessoas** por apartamento (2026-10-19, T02).
- A distância da praia no site é **50 m**, escrita sempre como "a 50 m da praia" e nunca "beira-mar"/"frente al mar" (2026-10-19, T02/T12).
- O **apto 6 é sem degraus** da rua até dentro, e pode ser citado como "sem escada" (2026-10-19, T12).
- Os **dois aptos têm Wi-Fi e mesa de trabalho**: mencionar para trabalho remoto, sem prometer Mbps (2026-10-19, T12).
- "Jurerê Internacional" aparece só na seção "Tradicional × Internacional" da página do bairro, nunca em title/H1 da home ou dos aptos (sugestão adotada por padrão, 2026-10-19, T12).
- **Não mostrar a nota nem o link do Booking** — o anúncio vai ser desativado e não haveria como comprovar a nota. Avaliações próprias ficam para depois (2026-10-19, T02).
- **Faremos fotos novas.** As do Booking são só provisórias (2026-10-19, T02/T03).
- **Pagamento e cancelamento são negociados no WhatsApp**, sem política escrita no site (2026-10-19, T02).
- **Estadia mínima de 4 noites o ano todo**, informada no site (2026-10-19, T02).
- **Proibido fumar em todo o imóvel** (2026-10-19, T02).
- O aquecimento é o próprio **ar split quente/frio** (2026-10-19, T02).
- **Não há anúncio no Airbnb** (2026-10-19, T01).
- **WhatsApp único: +55 48 99944-2015** (`wa.me/5548999442015`) (2026-10-19, T02).
- **Recomendações locais partem dos pontos próximos listados no Booking**, mas **só entra no site o que for confirmado** (Paulista e Nice Restaurante não foram identificados); a família não tem lista própria (2026-10-19, T17).
- **Textos da interface (T19, 2026-10-20):** o link do menu para o bairro é "Jurerê" nos 3 idiomas; em es, "Cochera sin cargo"; o mini formulário (datas + hóspedes) fica só nas páginas dos aptos, e a home tem CTA direto; a comodidade `amenity.stepFree` ("sem escada") entra na lista controlada; a TV dos aptos é Smart TV.
- **"Pé na areia" é só posicionamento interno, nunca aparece no site** — sugere frente para a praia (2026-10-20, T16).
- **Home (E10, 2026-10-20):** a home é mínima, com foto, título "50 m da praia de Jurerê.", texto curto, os 2 aptos, uma linha sobre trabalho remoto e um link para Jurerê. A régua "portão → 50 m → areia" aparece só na home, sem animação. Ficam fora a tabela Apto 4 × Apto 6, o "O que fica perto" e a faixa de CTA. O texto foi aprovado sem a "rua de lajotas", que não está confirmada.
- Os nomes dos aptos são "Apto 4" / "Depto 4" / "Apt 4" (idem 6).
- **"Como chegar" na página do bairro é só o endereço + link "Abrir no Google Maps"** (link externo, sem mapa embutido): sem rotas de carro, ônibus nem aeroporto (2026-10-20, T17).
- **Endereço: Rua Luiz Rampa, 70, Jurerê Leste**, Florianópolis/SC, CEP 88053-682. O Booking dizia "Rua Acácio Melo, 70", mas o endereço certo foi confirmado pelo usuário; pino do prédio em -27.43779, -48.48270 (2026-10-20, E4).
- **Não mostrar horário nem tempo de resposta** perto do botão do WhatsApp (2026-10-19, T02/T19).

### Marca
- O nome é **Acácia** (2026-10-19, T03).
- ~~O domínio é acaciafloripa.com.br, com acaciafloripa.com redirecionando~~ (2026-10-19, T04) — revisto: **o endereço definitivo é `https://acacia.deyzito.com`**, subdomínio de um domínio que o usuário já tem, com DNS no Route 53 — não precisa registrar domínio novo nem redirecionar `.com` (2026-10-21). O Instagram continua **@acaciafloripa**, e a marca continua sendo só "Acácia".
- **Logo símbolo + texto**: o símbolo sozinho serve de avatar do WhatsApp e de favicon (2026-10-19, T03).
- **Tipografia mista**: serifa nos títulos, sem serifa no texto (2026-10-19, T03).
- **Cores livres, inspiradas no lugar** (areia, mar, restinga). Sem referências do usuário: o agente propõe (2026-10-19, T03).
- **A família não aparece no site**, nem por nome nem por foto. O tom continua de quem conhece o lugar, sem personificar (2026-10-19, T03).
- **Espanhol rioplatense, com "vos"** — o público prioritário é argentino/uruguaio (2026-10-19, T03).
- **Fotos com luz natural, sem pessoas**: detalhes, bairro e praia (2026-10-19, T03).

- **Identidade: direção A · Restinga** ([docs/brand/directions.md](docs/brand/directions.md)): Concha `#EEF1EA`, Restinga `#1F3B2D`, Folha `#4A6450`, Mar raso `#D3E5DD`, Acácia `#E8B42C`; Young Serif nos títulos + Hanken Grotesk no texto; símbolo = ramo com 3 flores-pompom; elemento-assinatura = régua "portão → 50 m → areia". É mais calma e deixa as fotos protagonistas (2026-10-19, T05).
- **Logo final (T06, 2026-10-20)** em `assets/brand/logo/`: o acento do "á" é um folíolo (só no logo); o símbolo é o A1 "Ramo", com folíolos em traços que ecoam a régua dos 50 m; o avatar do WhatsApp/Instagram usa a versão escura (fundo Restinga, 6,39:1 com o amarelo). Tamanho mínimo do logo horizontal: 24 px de altura; abaixo de 32 px, usar o `favicon.svg`.
- **Títulos dos aptos pelo número** ("Apto 4", "Apto 6"), com o tipo (varanda/térreo) como detalhe (2026-10-19, T05).
- **O logo é só "Acácia"**, sem descritor; o descritor vai no title e no Open Graph (2026-10-19, T05).
- **A voz usa um "nós" discreto, sem nomes** (ex.: "mandamos as instruções pelo WhatsApp") (2026-10-19, T05).
- Em espanhol: "depto" e "cochera" (2026-10-19, T05).
- **Fontes hospedadas localmente (woff2), nunca pelo CDN do Google** — o CDN envia o IP do visitante ao Google antes do consentimento (2026-10-19, T05/T20).

### Técnico
- **Astro 7 com saída estática e Node 24 LTS** fixado via `.nvmrc` e no CI — melhor equilíbrio entre performance, i18n, imagens e schema Zod. O Astro 7 e o Vitest exigem Node ≥ 22.12, e o 22 sai de suporte em abril/2027; se algo quebrar na E1, voltamos para o 22 (2026-10-19 T10; revisado em 2026-10-20 T16).
- **Conteúdo só em arquivos no repo** (Markdown/YAML validados com Zod), **sem CMS** por enquanto — quem edita é programador (2026-10-19, T10).
- **CSS puro com custom properties** e estilos com escopo do Astro — zero dependência e menos "cara de template" (2026-10-19, T10).
- **TypeScript strict + pnpm + ESLint/Prettier** — os plugins Astro são maduros; o Biome será reavaliado depois (2026-10-19, T10).
- **Hospedagem na AWS via Terraform** (S3 + CloudFront + Route 53 + ACM) — o usuário já usa AWS; custo de poucos reais por mês: com o subdomínio `acacia.deyzito.com`, só entra um registro na zona do Route 53 que já existe e um certificado ACM, sem domínio novo (2026-10-19 T10; revisto em 2026-10-21).
- **Sem e-mail no domínio** por enquanto (2026-10-19, T10).
- **GitHub + GitHub Actions, com repositório público** e a branch principal protegida exigindo CI verde — no GitHub Free a proteção só vale em repo público, e o CI é ilimitado. Sem segredos no repo: deploy por OIDC (2026-10-19 T14; 2026-10-20 T16).
- **404 por idioma:** uma 404 única (status 404 real) com os 3 textos, e um script inline mínimo mostra o idioma do prefixo da URL (sem JS, aparece o pt) — a CloudFront aceita só uma página de erro por distribuição (2026-10-20, T16).
- **Testes:** Vitest + Zod para unitários e validação de conteúdo; lychee para links (links externos num job semanal que não bloqueia); Lighthouse CI com budgets (limites finais na T34) (2026-10-19, T14).
- **Hooks com lefthook.** Pre-commit: lint, tipos, Vitest dos arquivos afetados e validação de conteúdo. Pre-push: build, Vitest completo, SEO e 1 projeto Playwright. CI: o resto (2026-10-19, T14).

### URLs (T09, 2026-10-19)
- Estrutura `/{lang}/{bairro}/{imovel}/` — curta, e aceita novos bairros sem mudar URLs.
- Os slugs dos imóveis são `apto-4` e `apto-6`, iguais nos 3 idiomas (T12).
- O slug do bairro é `jurere`; guia do bairro e lista de imóveis ficam na mesma página.
- **Slugs nunca traduzidos**, inclusive páginas genéricas (`/en/privacidade/`).
- `/` faz 301 fixo para `/pt/`; `x-default` = pt; um banner discreto sugere en/es, sem redirecionar por IP ou navegador.
- Pacote aprovado: canonical autorreferente e absoluto, barra final (a outra forma faz 301), 404 por idioma, breadcrumb visível + `BreadcrumbList`, e preço/calendário futuros dentro da página do imóvel com reserva em `/{imovel}/reservar/` (noindex).

### Layout (T21, 2026-10-20)
- **Direção 2 · Régua** ([docs/design/directions.md](docs/design/directions.md)): a régua dos 50 m vira a navegação, com galerias em mosaico e comparação Apto 4 × Apto 6 — WhatsApp sempre a um toque, e aguenta melhor as fotos provisórias.
- Trazidos da direção 1: legendas nas fotos e a sequência "portão → rua → areia" na seção da praia.
- No celular, o **botão fixo do WhatsApp fica sempre visível**, como parte da barra da régua (sem pílula extra), e sobe com o banner de cookies.
- No guia em espanhol, **sem a seção de documentos do carro** ("Si venís en auto") — documentos de viagem não são assunto do site.

- **Revisão (2026-10-20, E9):** sem legendas nas fotos (os textos alternativos ficam só no código) e sem a régua como navegação — a régua aparece só na foto da home. Mais simples e sem JavaScript extra.

### Design tokens (T08, 2026-10-19)
- **Um `tokens.css` como fonte da verdade** (custom properties em 2 camadas: primitivos e semânticos), com o contraste testado no Vitest por um parser de CSS — zero build extra e coerente com a decisão de CSS puro. A implementação é na T25, com TDD.
- **`acacia-400` `#F0C24A`** só para o hover/foco do botão do WhatsApp (7,27:1 com o texto Restinga).
- O **banner de cookies fica embaixo e o botão do WhatsApp sobe junto** (`--cookie-banner-offset`), para o botão nunca ficar coberto.
- **Cor de erro `#9B2C1F`** (6,64:1 sobre Concha) no mini formulário, sempre acompanhada do texto da mensagem.

### Modelo de dados (T11, 2026-10-19)
- **YAML** para imóvel, prédio, bairro, cidade e site; **Markdown** só para texto editorial longo (guia do bairro, privacidade) — YAML aceita comentários e textos longos, JSON não.
- **Um arquivo por imóvel**, com `pt`/`en`/`es` dentro de cada campo traduzível: o que não se traduz aparece uma vez, e faltar um idioma vira erro de schema.
- **Cada apto é um imóvel** (com a sua URL e o seu `VacationRental`) que aponta para um **prédio** compartilhado (endereço, geo, garagem, fotos comuns) — sem duplicação, e pronto para mais aptos.
- **Comodidades em lista controlada** (enum + rótulos i18n mapeados para `amenityFeature`), mais `highlights` em texto livre.
- Identifiers fixos `acacia-4` e `acacia-6` (slugs `apto-4`/`apto-6`); endereço público sem o número do apto; WhatsApp global com override opcional por imóvel; `status: draft`; geo como texto com 5 casas decimais.

### Google e privacidade
- ~~Não criar o Perfil da Empresa no Google por enquanto~~ (2026-10-19, T13) — revisto abaixo.
- **Criar o Perfil da Empresa agora, como área de atendimento** (ramo B da T13): nome "Acácia", endereço oculto, área Florianópolis, telefone do WhatsApp, site depois do go-live. Conta Google = e-mail pessoal do usuário. O usuário aceitou o risco de suspensão: o CNPJ está em outro nome e a operação é só dos aptos próprios (2026-10-20, T36). O CNPJ é um MEI com atividade registrada diferente de aluguel e endereço na Lagoa da Conceição; o usuário decidiu criar o perfil mesmo assim (2026-10-21). O número do CNPJ não entra no repositório público (fica em `tasks/T36`, que é local).
- **GA4 só carrega depois do "Aceitar"** — o caminho mais seguro com o guia da ANPD; aceitamos perder parte das métricas (2026-10-19, T20).
- **Privacidade:** o encarregado é a pessoa responsável (placeholder até falar com o contador, 2026-10-21), com menção curta às leis da Argentina e do Uruguai, resposta a pedidos em 15 dias e conversas de WhatsApp guardadas só enquanto necessário, com revisão anual (2026-10-19, T20).

### Skills (T15, 2026-10-19)
- Instalar **só neste projeto** (`.claude/skills`): `astro-seo`, `playwright-skill` (só core + cli) e `terraform-style-guide`, depois de revisar o SKILL.md e os scripts de cada uma. Ficam de fora `accessibility-compliance` (o axe já cobre) e `web-design-guidelines` (baixa instruções remotas a cada uso).
- **Instaladas em 2026-10-19** a partir dos commits revisados (jdevalk/skills `106fc68`, testdino-hq/playwright-skill `178d1cb`, hashicorp/agent-skills `f706481`): `astro-seo`, `playwright-core`, `playwright-cli` e `terraform-style-guide`, em `.claude/skills/`. Não atualizar sem nova revisão.
- **Restrições de uso das skills:**
  - `astro-seo` serve **só para auditar**. Não instalar pacotes por ela (nada de `@jdevalk/astro-seo-graph`, satori, `@astrojs/rss`), não rodar a fase "Improve", não criar `llms.txt` nem endpoints de agentes, e ignorar Plausible e as receitas de `_redirects`/`_headers`/`vercel.json` — a hospedagem é S3 + CloudFront.
  - `playwright-*`: nunca `-g`; usar pnpm `-D`. Não rodar `init-agents`, `trace install-skill`, `run-code` nem `eval` sem pedir. Ignorar a API da TestDino.
  - `terraform-style-guide`: KMS, versões mínimas e tflint/checkov são sugestões, não regras — qualquer ferramenta nova exige aprovação.
- **JSON-LD escrito por nós**, testado com Vitest, sem `@jdevalk/astro-seo-graph` — evita dependência nova.
