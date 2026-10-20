# Direções de layout do site: Acácia (T21)

Status: **aguardando escolha do usuário**. Data: 2026-10-20.
Base: [claude.md](../../claude.md) ("Design: não pode parecer feito por IA" e Requisitos), [CLAUDE.md](../../CLAUDE.md) (decisões), [identidade A · Restinga](../brand/directions.md), [mapa de páginas](../plan/page-map.md), [project-info.md](../project-info.md), [booking-data.md](../booking-data.md).

As duas direções usam **a mesma identidade A** (Concha, Restinga, Folha, Mar raso, Acácia; Young Serif + Hanken Grotesk; símbolo do ramo; régua dos 50 m). O que muda entre elas é a **estrutura**: como a página se organiza, como se navega e como as fotos aparecem.

| | **1 · Sequência** | **2 · Régua** |
|---|---|---|
| Ideia | Ensaio fotográfico: a página se lê de cima pra baixo, foto a foto | A página é o caminho de 50 m: a régua é o índice e leva até o WhatsApp |
| Navegação | Rolagem livre; só o cabeçalho | Régua fixa (lateral no desktop, barra inferior no celular) com as seções como marcações |
| Fotos | Em sequência, com tamanhos e alinhamentos diferentes e legendas | Mosaicos em grade: capa grande + fotos menores, tudo visível de uma vez |
| Abertura da home | Página dupla: texto, foto grande da varanda, foto menor da rua | "50 m" gigante + foto da rua de lajotas com uma régua desenhada por cima |
| Os dois aptos | Um de cada vez, alternando lados | Lado a lado, com uma tabela "Apto 4 × Apto 6" |
| Botão fixo do WhatsApp | Pílula amarela no canto, some quando um botão do texto está na tela | Fim da régua: bolinha amarela "areia" (desktop) ou botão dentro da barra (celular) |
| Ritmo | Lento, contemplativo, muito respiro | Denso e escaneável, tudo a um toque |
| Melhor para | Quem decide pela sensação do lugar | Quem compara e quer achar a informação rápido |

## Arquivos

Protótipos HTML/CSS estáticos e descartáveis (não são código do projeto). Abra no navegador; precisa de internet só para as fontes.

- Direção 1: [1-sequencia/index.html](directions/1-sequencia/index.html) (home) · [1-sequencia/apto-4.html](directions/1-sequencia/apto-4.html)
- Direção 2: [2-regua/index.html](directions/2-regua/index.html) (home) · [2-regua/apto-4.html](directions/2-regua/apto-4.html)
- Base comum: [shared.css](directions/shared.css) (tokens da identidade A, cabeçalho, seletor de idioma, botão, rodapé) e [wa-toggle.js](directions/wa-toggle.js)
- Fotos: [fotos/](directions/fotos/), cópias em WebP (600 e 1200 px) das fotos **provisórias** do Booking

### Screenshots (Playwright + Chromium headless, 390 × 844 @2x e 1440 × 900)

`-dobra` = só a primeira tela (mostra o botão fixo); sem sufixo = página inteira (o botão fixo e a régua ficam escondidos nessa captura porque apareceriam num ponto aleatório da imagem).

| | Celular 390 | Desktop 1440 |
|---|---|---|
| 1 · home | [dobra](directions/1-sequencia/screens/index-mobile-dobra.jpg) · [inteira](directions/1-sequencia/screens/index-mobile.jpg) | [dobra](directions/1-sequencia/screens/index-desktop-dobra.jpg) · [inteira](directions/1-sequencia/screens/index-desktop.jpg) |
| 1 · Apto 4 | [dobra](directions/1-sequencia/screens/apto-4-mobile-dobra.jpg) · [inteira](directions/1-sequencia/screens/apto-4-mobile.jpg) | [dobra](directions/1-sequencia/screens/apto-4-desktop-dobra.jpg) · [inteira](directions/1-sequencia/screens/apto-4-desktop.jpg) |
| 2 · home | [dobra](directions/2-regua/screens/index-mobile-dobra.jpg) · [inteira](directions/2-regua/screens/index-mobile.jpg) | [dobra](directions/2-regua/screens/index-desktop-dobra.jpg) · [inteira](directions/2-regua/screens/index-desktop.jpg) |
| 2 · Apto 4 | [dobra](directions/2-regua/screens/apto-4-mobile-dobra.jpg) · [inteira](directions/2-regua/screens/apto-4-mobile.jpg) | [dobra](directions/2-regua/screens/apto-4-desktop-dobra.jpg) · [inteira](directions/2-regua/screens/apto-4-desktop.jpg) |

---

## Direção 1 · Sequência (editorial vertical)

**Conceito:** um ensaio de fotos com texto curto entre elas, como uma matéria de revista sobre o lugar. Cada foto tem um tamanho e uma posição diferentes (sangrando a tela, recuada à esquerda, recuada à direita, em par desencontrado), sempre com legenda que diz o que se vê. O ritmo variado vem da alternância entre foto grande, foto pequena e frase em serifa grande.

**Home**
1. **Abertura em página dupla** (desktop): à esquerda o título "Dois apartamentos a 50 m da praia." com o botão do WhatsApp; no meio a foto da varanda com o mar (capa, LCP) ocupando a altura da tela; à direita uma foto menor da rua de lajotas, com legenda. No celular: foto quadrada, título, texto e botão, tudo na primeira tela.
2. **Apto 4 e Apto 6**, um de cada vez e alternando o lado: número enorme em Young Serif, o tipo como detalhe ("Andar de cima · com varanda"), uma frase concreta e o link.
3. **"Nos dois"**: uma frase só, em serifa grande, com o que os dois têm (garagem, Wi-Fi e mesa, split, cozinha, cadeiras de praia) e o mínimo de 4 noites. Sem ícones, sem cards.
4. **"Do portão até a areia"**: a régua dos 50 m (pequena, como legenda) e três fotos em escada (portão → rua → areia), cada uma descendo um pouco mais na página, como quem anda.
5. **O bairro**: foto do pôr do sol + texto curto + link para o guia.
6. **Faixa verde** com a pergunta e o botão amarelo.

**Apto 4** (ordem pedida: fotos → destaques → detalhes/camas → regras → CTA)
1. **Fotos**: abre com a mesma página dupla (capa da varanda = LCP, "Apto 4" enorme, breadcrumb, botão) e segue a sequência: sala em faixa panorâmica, quarto e pia em par desencontrado, mesa recuada à direita, botão "Ver as 33 fotos".
2. **Destaques**: quatro frases em serifa grande, com um ponto amarelo (o "areia" da régua) e recuo alternado.
3. **Camas e o que tem**: camas primeiro e em destaque (quarto · casal / sala · sofá-cama / até 3 pessoas), depois a lista rótulo/valor.
4. **Antes de reservar**: regras em texto corrido no bloco Mar raso.
5. **Faixa verde** "Quer saber se o Apto 4 está livre nas suas datas?" e link para o Apto 6.

**Botão fixo:** pílula amarela "WhatsApp" no canto inferior direito, a 16 px + `env(safe-area-inset-bottom)` da borda, com um anel Concha de 2 px para se destacar sobre foto (sem sombra). Some enquanto um botão do texto estiver na tela, para não haver dois botões iguais competindo. O `body` tem espaço embaixo para o botão nunca cobrir o rodapé.

**Prós:** as fotos são as protagonistas de verdade; é a direção mais calma e mais fiel ao tom "quem descreve com cuidado"; envelhece bem.
**Contras:** depende muito das fotos novas (com as provisórias, a sequência mostra os defeitos delas); páginas longas no celular (~5.800 px na home); informação prática fica mais abaixo.

---

## Direção 2 · Régua (a régua dos 50 m guia a navegação)

**Conceito:** a página inteira é o caminho do portão até a areia. A régua da marca vira o índice: as seções são marcações ao longo dela, um traço preenche a régua conforme você desce, e o fim da régua (o ponto amarelo "areia") é o botão do WhatsApp. As fotos aparecem em **mosaicos** (uma grande e várias menores), para ver muito de uma vez.

**Home**
1. **Abertura**: "50 m" enorme em Young Serif + "da praia de Jurerê." e o botão. Ao lado (embaixo, no celular), a foto da rua de lajotas (capa, LCP) com uma régua vertical desenhada por cima: "0 · portão" embaixo, "50 m · areia" no alto, onde o mar aparece.
2. **"0 m · Os dois apartamentos"**: os dois lado a lado, cada um com um mosaico de 3 fotos (espelhados, e o Apto 6 mais baixo, para não virar dois cards iguais), e embaixo uma **tabela de comparação** Apto 4 × Apto 6 (andar, vista, camas, o que é igual nos dois).
3. **"Do portão · O que fica perto"**: os lugares próximos numa régua vertical, com a distância de cada um (areia 50 m, Toca do Jurerê 100 m, Paulista 200 m...). Ao lado, a fachada do prédio.
4. **"50 m · A praia"**: mosaico das fotos da praia + link para o guia do bairro.
5. **Faixa verde** onde a linha tracejada termina no botão ("areia → WhatsApp").

**Apto 4**
1. **Título** ("Apto 4" grande + tipo + fatos em uma linha + botão no desktop) e logo abaixo o **mosaico de fotos**: capa da varanda grande (LCP) + 6 fotos + bloco "Ver as 33 fotos".
2. **Destaques** pendurados numa régua horizontal (desktop) ou vertical (celular), cada um com título e uma linha de explicação.
3. **Camas e o que tem**: "3" enorme ("pessoas, no máximo") com as camas, e a lista rótulo/valor em 2 colunas.
4. **Antes de reservar**: regras em linhas rótulo/valor no bloco Mar raso (mais escaneável que na 1).
5. **Faixa verde** com a régua chegando no botão, e link para o Apto 6.

**Botão fixo e navegação:**
- **Desktop:** régua vertical fixa à esquerda (128 px): "0 m portão" no topo, as seções como marcações clicáveis (posicionadas proporcionalmente à altura de cada seção), o traço preenchido conforme a rolagem e, no fim, "50 m areia" + **bolinha amarela com o ícone do WhatsApp**.
- **Celular:** uma **barra inferior** verde só: à esquerda a régua (nome da seção atual + marcações tocáveis com 44 px de altura), à direita o botão "WhatsApp". Respeita `env(safe-area-inset-bottom)` e sobe junto com o banner de cookies (`--cookie-banner-offset`, decisão da T08). É o único elemento fixo da página.

**Prós:** transforma o diferencial (50 m) em navegação, não só em enfeite; a tabela Apto 4 × Apto 6 ajuda a decidir; a barra inferior deixa o WhatsApp sempre a um toque; funciona bem mesmo com as fotos provisórias (os mosaicos escondem defeitos).
**Contras:** mais elementos fixos e um pouco de JavaScript (posição das marcações e preenchimento); mais "interface", menos calma que a 1; a barra inferior ocupa ~64 px da tela no celular; a régua lateral tira 128 px de largura no desktop.

---

## O que vale para as duas

- **WhatsApp:** `wa.me/5548999442015` com a mensagem pré-preenchida citando o imóvel ("Quero saber se o Apto 4 da Acácia está livre nas datas: "). Nenhum horário ou tempo de resposta perto do botão. CTA **acima da dobra e no fim** em todas as páginas (conferido no Playwright, ver abaixo).
- **Seletor de idioma** visível no cabeçalho (pt · en · es, com o atual sublinhado) e repetido no rodapé.
- **Capa como LCP:** `<link rel="preload" as="image" imagesrcset … fetchpriority="high">` + `<img fetchpriority="high">` sem `loading="lazy"`, com `width`/`height` (sem salto de layout) e `srcset` 600/1200 px; o resto das fotos tem `loading="lazy"` e `decoding="async"`. O Chromium confirmou a foto de capa como elemento LCP nas 8 capturas.
- **Ordem da página do imóvel:** fotos → destaques → camas/detalhes → regras → CTA, nas duas.
- **Textos:** títulos pelo número ("Apto 4", "Apto 6"), "a 50 m da praia" (nunca "beira-mar"), sem preços, sem nota nem link do Booking, sem família, "nós" discreto ("mandamos as instruções pelo WhatsApp"), "Jurerê Internacional" ausente. Os textos são **rascunho de layout**; o texto final é da T18/T19.
- **Lista proibida** (conferida com grep nos HTML/CSS): sem gradiente, sem glassmorphism/blur, sem emoji, sem ícone por bloco (o único ícone é o do WhatsApp), sem grade de 3 cards iguais, sem sombra com desfoque (só anéis sólidos de 1,5–2 px), sem frases genéricas.
- **Acessibilidade:** contrastes da identidade A (todos AA), foco visível de 3 px (amarelo sobre o verde), alvos de toque ≥ 44 px, `alt` descritivo em todas as fotos, breadcrumb com `aria-current`, `prefers-reduced-motion` respeitado.
- **Verificação (Playwright do `@playwright/cli` global + Chromium headless já baixado em `~/.cache/ms-playwright`; nada foi instalado):** nas 8 combinações (2 direções × 2 páginas × 2 larguras): `scrollWidth` = 390/1440 (sem rolagem horizontal), seletor de idioma visível, pelo menos um link do WhatsApp na primeira tela, botão fixo não cobre o rodapé no fim da página, LCP = foto de capa, **zero erros no console**.

## Notas e pendências

- **Fotos:** as do Booking são provisórias e quase todas verticais. A direção 1 depende mais das fotos novas (sequência com legendas expõe foto fraca); a 2 tolera melhor. Para a capa da home, as duas pedem uma foto que mostre o mar: na 1, da varanda; na 2, da rua de lajotas com o mar no fim.
- **"O que fica perto" (direção 2):** nomes e distâncias vêm da lista do Booking e precisam ser checados antes de publicar (decisão da T17). Não sei o que é cada lugar (restaurante, mercado...); a T17 completa.
- **Fontes:** os protótipos usam o CDN do Google Fonts só por conveniência; o site hospeda as fontes localmente (decisão T05/T20).
- **Skills usadas:** `frontend-design` (processo e autocrítica) e `ui-ux-pro-max` (só a checklist de UX: alvos de toque, elementos fixos com safe area, lazy loading). Ignorei as sugestões de estilo/paleta dela, como mandado.

## Notas para outras tarefas

- **T25 (layout/tokens):** a escolha define os componentes: na 1, `PhotoSequence` + pílula flutuante com o script que a esconde perto de um CTA; na 2, `RulerNav` (rail + barra inferior), `Mosaic` e `CompareTable`. Nas duas, o botão fixo usa `--cookie-banner-offset` (T08).
- **T26 (imagens):** `srcset` 600/1200 já testado; a capa precisa de recorte que funcione em 1:1 (celular) e vertical alto (desktop) na 1, ou 4:5 e vertical na 2.
- **T28 (página do imóvel):** a ordem de seções é a mesma nas duas; só o tratamento muda.
- **T31 (WhatsApp):** na direção 2, a barra inferior já é o "botão fixo"; não somar outra pílula.

---

## Perguntas abertas

Responda embaixo de cada uma, na linha "Resposta:". Se a sugestão servir, basta escrever "ok".

**1. Qual direção de layout você escolhe: 1 · Sequência ou 2 · Régua?**
- Sugestão: **2 · Régua**, com um ajuste da 1 (ver pergunta 2). Ela transforma os 50 m em navegação de verdade, deixa o WhatsApp sempre a um toque no celular (a barra é o único elemento fixo) e a comparação Apto 4 × Apto 6 ajuda quem está escolhendo. Também aguenta melhor as fotos provisórias até as novas ficarem prontas. Escolha a 1 se você quer a página mais calma possível e as fotos novas vão ser fortes.
- Resposta:

**2. Quer levar algum elemento de uma direção para a outra?**
- Sugestão: se escolher a 2, levar da 1 as **legendas nas fotos** (no mosaico, ao abrir a galeria) e a **sequência "portão → rua → areia"** na seção da praia. Se escolher a 1, levar da 2 a **tabela Apto 4 × Apto 6** na home e as **regras em linhas rótulo/valor**.
- Resposta:

**3. No celular, o botão fixo do WhatsApp deve ficar sempre visível, ou sumir enquanto outro botão de WhatsApp estiver na tela?**
- Sugestão: na 2, sempre visível (faz parte da barra da régua). Na 1, sumir perto dos outros botões, como no protótipo, para nunca aparecerem dois botões iguais lado a lado.
- Resposta:
