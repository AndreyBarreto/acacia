Você vai me ajudar a construir o site de aluguel por temporada dos imóveis da minha família em Jurerê Internacional (Florianópolis/SC). Objetivo: reservas diretas, sem taxas de Airbnb/Booking. Começamos só com Jurerê, mas a estrutura deve permitir adicionar outros bairros/cidades depois sem refazer nada.

## Regras de trabalho
- Não escreva código antes de terminar a pesquisa, as perguntas e eu aprovar o plano.
- Sempre que faltar informação ou houver mais de um caminho razoável, pergunte. Blocos de no máximo 5 perguntas, com sua sugestão de resposta quando fizer sentido.
- Eu sou programador. Antes de qualquer decisão técnica (framework, bibliotecas, estrutura de pastas, modelagem de dados, padrões de código, build, deploy, hospedagem), me pergunte: apresente as opções com prós e contras e sua recomendação. Não decida sozinho, nem em detalhes de implementação que mudem a arquitetura.
- Skills: no início de cada fase/etapa, verifique quais skills instaladas se aplicam (pesquisa, design, frontend, SEO, review, segurança) e use-as. Pesquise também as skills mais usadas pela comunidade para a stack escolhida (ex.: via find-skills / skills.sh) e me sugira as que valem instalar, com o motivo. Não instale nada sem minha aprovação.
- Mantenha um CLAUDE.md com o contexto do projeto e as decisões tomadas (decisão + motivo).
- Trabalhe em etapas pequenas, com commits claros, e me mostre cada etapa antes de seguir.
- Converse comigo em português.
- Todo o código em inglês: nomes de variáveis, funções, arquivos, pastas, comentários e mensagens de commit.

## Testes (obrigatório)
- TDD sempre: escreva o teste antes do código, veja falhar, implemente até passar, depois refatore. Nenhuma funcionalidade entra sem teste.
- Cobrir todas as camadas que existirem no projeto:
  - Frontend: testes unitários de componentes/funções e testes end-to-end dos fluxos principais (navegação, troca de idioma, clique no WhatsApp com a mensagem certa, aviso de cookies).
  - Backend e banco (quando existirem): testes unitários, de integração com banco real/isolado e de contrato das APIs.
  - Integrações: Analytics/eventos, WhatsApp (links e mensagens), sitemap, hreflang, schema.org, Open Graph.
  - Conteúdo e qualidade: validação dos arquivos de imóveis (campos obrigatórios nos 3 idiomas), links quebrados, acessibilidade e orçamento de performance (Core Web Vitals).
- Os testes rodam a cada commit (local e CI); commit com teste falhando não entra.
- Cada etapa que eu mostrar vem com os testes escritos e o resultado da execução.
- As ferramentas de teste são decisão técnica: me apresente opções, prós e contras antes de escolher.

### Frontend com Playwright (decidido)
- `@playwright/cli` (playwright-cli) para abrir o site, explorar, observar o comportamento e gerar/depurar os testes; `@playwright/test` como runner dos testes versionados.
- Boas práticas:
  - Localizadores voltados ao usuário (`getByRole`, `getByLabel`, `getByText`); `data-testid` só quando não houver alternativa; nada de seletores CSS/XPath frágeis.
  - Asserções web-first (`await expect(locator).toBeVisible()`), sem `waitForTimeout` nem sleeps fixos.
  - Testes isolados e independentes (contexto novo por teste, sem depender de ordem).
  - Projetos para Chromium, Firefox e WebKit, mais viewports mobile (iPhone e Android), já que o site é mobile first.
  - Cada fluxo testado nos 3 idiomas (pt, en, es) quando o texto ou a URL mudarem.
  - Acessibilidade com `@axe-core/playwright` nas páginas principais.
  - Trace e screenshot na falha (`trace: 'on-first-retry'`), retries só no CI.
  - Testes rodando contra o build de produção (site estático servido localmente), não contra o dev server.
  - Fixtures/helpers para o que se repete; Page Objects só se a duplicação justificar.

## Idiomas
- O site terá 3 idiomas: português (pt-BR, padrão), inglês (en) e espanhol (es).
- URLs por idioma (ex.: /pt/..., /en/..., /es/...), com hreflang correto, seletor de idioma visível e textos fora do código (arquivos de tradução).
- Cada imóvel tem descrição nos 3 idiomas; a mensagem pré-preenchida do WhatsApp segue o idioma da página.
- Traduções naturais, escritas para cada público (argentinos, por exemplo), não tradução literal.

## Fase 1 — Pesquisa
Traga um resumo curto, com fontes:
1. Quem aparece hoje no Google para "aluguel temporada Jurerê", "alquiler Jurerê", "Jurerê vacation rental" e bons sites de aluguel direto em geral: o que fazem bem e onde dá pra superar.
2. Boas práticas atuais de SEO para hospedagem: schema.org (VacationRental/LodgingBusiness), hreflang, Core Web Vitals, imagens.
3. Regras atuais do Google Perfil da Empresa (Google Maps) para aluguel por temporada: o que é permitido, verificação, o que evitar pra não ter suspensão, e se cada imóvel pode ter perfil próprio.
4. Boas práticas de conversão via WhatsApp.
Termine com recomendações e o que precisa saber de mim.

## Fase 2 — Perguntas
Vou fornecer a(s) URL(s) do(s) anúncio(s) no Booking. Antes de perguntar, extraia de lá tudo o que der: nome do imóvel, endereço/localização, capacidade, quartos, camas, banheiros, comodidades, regras da casa, horários de check-in/out, políticas de cancelamento, descrição e nota/quantidade de avaliações. Salve em `docs/booking-data.md` (com a URL e a data da coleta), me mostre um resumo e só pergunte o que faltar ou estiver ambíguo. Se o Booking bloquear o acesso, me avise e eu colo o conteúdo. Use a descrição só como base (reescreva no nosso tom) e não copie textos de avaliações para o site sem eu confirmar que é permitido.
No mínimo: imóveis (quantidade, capacidade, quartos, diferenciais), avaliações existentes no Airbnb/Booking, número(s) e horário do WhatsApp, CNPJ/endereço para o Google, domínio e hospedagem, fotos disponíveis, regras da casa e política de pagamento/cancelamento.

## Fase 3 — Plano
Mapa de páginas, stack recomendada (com justificativa e custo mensal), estrutura de dados dos imóveis, palavras-chave por página nos 3 idiomas e passo a passo do Google Maps. Espere minha aprovação.

## Requisitos
- Contato só por WhatsApp: botão fixo + CTA por imóvel, com mensagem pré-preenchida citando o imóvel.
- Escopo inicial: sem preços, calendário de disponibilidade ou reserva online; tudo é negociado no WhatsApp. A estrutura não deve impedir adicionar isso depois (ex.: sincronização via iCal com Booking/Airbnb), mas não implemente agora.
- Páginas: home, uma por imóvel (ex.: /pt/jurere/casa-nome), página do bairro Jurerê com conteúdo útil de verdade (praias, como chegar, onde comer, melhor época) e privacidade.
- Site estático, rápido e mobile first.
- Adicionar imóvel novo editando um arquivo simples (markdown/JSON), sem mexer em código.
- SEO técnico: title/description por página, Open Graph (preview bonito no WhatsApp), schema, sitemap, imagens otimizadas.
- Google Analytics + Search Console, com evento de clique no WhatsApp por imóvel; aviso de cookies simples (LGPD).

## Design: não pode parecer feito por IA
- Evite: gradiente roxo/azul, glassmorphism, emojis em títulos, ícone genérico em todo bloco, grade de 3 cards iguais, sombras exageradas.
- Evite frases genéricas ("Descubra o paraíso", "Experiência inesquecível"). Texto direto e específico, com cara de família que conhece o lugar (ex.: "3 minutos a pé da praia, garagem pra 2 carros").
- Fotos reais e grandes como protagonistas, tipografia com personalidade, paleta inspirada no lugar (areia, mar, restinga), poucas cores, layout com ritmo variado.
- Antes de implementar, me mostre 2 direções visuais diferentes pra eu escolher.

## Identidade visual (vamos construir do zero)
Antes das direções visuais, me faça perguntas sobre a marca (em blocos de até 5, com sua sugestão). No mínimo:
- Nome: já existe algum nome/marca? Se não, quer sugestões (com checagem de domínio .com.br/.com e @ no Instagram livres)?
- Posicionamento: público principal (famílias, casais, grupos, argentinos/uruguaios), faixa de preço, o que diferencia nossos imóveis.
- Personalidade e tom de voz: 3 adjetivos que a marca deve transmitir e 3 que ela não pode transmitir.
- Referências: sites, marcas, pousadas ou hotéis de que eu gosto e de que não gosto (e por quê).
- Logo: preferência por wordmark (só texto), símbolo + texto ou monograma; onde será usado (site, WhatsApp, Instagram, placa).
- Cores e tipografia: alguma cor obrigatória ou proibida; preferência entre serifada, sem serifa ou mista.
- Fotografia: estilo das fotos (luz natural, pessoas ou não, detalhes vs. ambientes) e se precisaremos de novas fotos.

Entregáveis (mostre cada um e espere aprovação):
1. 2–3 propostas de nome (se necessário) com justificativa.
2. 2 direções de identidade: paleta (com hex e contraste WCAG AA), par tipográfico (Google Fonts ou licença livre), conceito de logo, exemplos de tom de voz.
3. Logo final em SVG (versões horizontal, quadrada/ícone para avatar do WhatsApp e favicon, clara e escura).
4. Mini guia de marca em `docs/brand.md`: cores, tipos, uso do logo, tom de voz com exemplos do que dizer e do que evitar.
5. Tokens de design (cores, tipografia, espaçamentos) prontos para usar no código.

Comece pela Fase 1.