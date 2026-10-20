# Direções de identidade: Acácia (T05)

Status: **aguardando escolha do usuário**. Data: 2026-10-19.
Base: [claude.md](../../claude.md) (regras de design e lista proibida), [CLAUDE.md](../../CLAUDE.md) (decisões de marca), [brand-brief.md](../brand-brief.md), [T03](../../tasks/T03-brand-questions.md), [project-info.md](../project-info.md), [booking-data.md](../booking-data.md).

Duas direções bem diferentes, ambas tiradas do próprio lugar. As duas cumprem o que já foi decidido: símbolo + texto, serifa nos títulos com sem serifa no texto, cores do lugar, família fora do site, espanhol com "vos".

| | **A · Restinga** | **B · Sextavado** |
|---|---|---|
| Ideia | O ramo de acácia e os 50 m a pé até a areia | A fachada ocre do prédio e a placa da rua |
| Sensação | Calma, botânica, de quem descreve com cuidado | Ensolarada, gráfica, prática, direto ao ponto |
| Cor dominante | Verde-restinga sobre fundo claro esverdeado | Campo ocre com tinta azul-petróleo |
| Títulos | Young Serif (serifa macia, arredondada) | Zilla Slab (serifa grossa, de placa) |
| Texto | Hanken Grotesk | Libre Franklin |
| Símbolo | Ramo com 3 flores-pompom amarelas | Flor de acácia dentro de um sextavado |
| Elemento-assinatura | Régua "portão → 50 m → areia" | Placa de rua "R. Acácio Melo, 70 · 50 m praia →" |
| Voz | Frases completas e calmas | Frases curtas, número primeiro |

Mocks descartáveis (abra no navegador; as fotos são as provisórias do Booking e as fontes vêm do Google Fonts, então precisa de internet):
- A: [directions/a-restinga/mock.html](directions/a-restinga/mock.html) · prévias: [desktop](directions/a-restinga/preview-desktop.jpg), [celular](directions/a-restinga/preview-mobile.jpg)
- B: [directions/b-sextavado/mock.html](directions/b-sextavado/mock.html) · prévias: [desktop](directions/b-sextavado/preview-desktop.jpg), [celular](directions/b-sextavado/preview-mobile.jpg)

---

## De onde vieram as ideias

Olhando as fotos provisórias, três coisas do lugar se repetem e nenhum concorrente usa:
1. **A fachada do residencial é ocre/amarela**, a mesma família de cor da flor de acácia (varanda/05, terreo/26).
2. **A rua que leva à praia é de lajotas sextavadas**, entre muros e cerca viva (varanda/06, terreo/23).
3. **O verde da restinga** (capim no jardim, cerca viva) e a **água clara e esverdeada** da baía de Jurerê (varanda/01, comum/01).

A direção A pega o verde e o caminho. A B pega o ocre e a rua.

Descartei de propósito a sugestão automática da skill ui-ux-pro-max (ciano + verde-saúde com Lora/Raleway): é a paleta "spa/bem-estar" genérica, que serve para qualquer pousada. Também evitei os três visuais que hoje denunciam site feito por IA: fundo creme com serifa contrastada e acento terracota, fundo quase preto com um acento neon e layout de jornal com filetes finos.

---

## Direção A · Restinga

**Conceito:** a marca de quem mora perto do mar e descreve o lugar com calma. O protagonista é o percurso: do portão até a areia são 50 m, e isso vira um elemento gráfico (uma régua com marcações, que no símbolo vira os folíolos da folha de acácia). Muito respiro, fotos verticais grandes e texto em frases completas.

### Paleta

| Nome | Hex | Papel |
|---|---|---|
| Concha | `#EEF1EA` | Fundo principal (claro, puxado pro verde, não creme) |
| Restinga | `#1F3B2D` | Texto, títulos, faixa escura do CTA |
| Folha | `#4A6450` | Texto secundário (legendas, rótulos) |
| Mar raso | `#D3E5DD` | Superfície de destaque (bloco de regras) |
| Acácia | `#E8B42C` | Acento: flores do símbolo, botão do WhatsApp, ponto "areia" da régua |

**Contraste (WCAG 2.2, calculado com [`directions/contrast.py`](directions/contrast.py))**

| Texto | Fundo | Razão | Resultado | Onde aparece |
|---|---|---|---|---|
| Restinga | Concha | **10,69:1** | AA (e AAA) | Títulos e texto corrido |
| Folha | Concha | **5,70:1** | AA | Rótulos, legendas, breadcrumb |
| Restinga | Mar raso | **9,31:1** | AA (e AAA) | Bloco "Antes de reservar" |
| Folha | Mar raso | **4,96:1** | AA | Texto secundário no bloco |
| Concha | Restinga | **10,69:1** | AA (e AAA) | Título do CTA |
| Mar raso | Restinga | **9,31:1** | AA (e AAA) | Nota sob o botão |
| Acácia | Restinga | **6,39:1** | AA | Anel de foco na faixa escura |
| Restinga | Acácia | **6,39:1** | AA | Texto do botão do WhatsApp |

**Pares proibidos (só decoração, nunca texto):** Acácia sobre Concha (1,67:1) e Acácia sobre Mar raso (1,46:1). O amarelo só leva texto quando é fundo com texto Restinga, ou quando aparece sobre Restinga.

### Tipografia

| Papel | Fonte | Uso | Licença |
|---|---|---|---|
| Títulos | **Young Serif** (peso único 400) | H1 a H3, wordmark, números de destaque ("50 m") | SIL OFL 1.1 · [licença no Google Fonts](https://fonts.google.com/specimen/Young+Serif/license) |
| Texto | **Hanken Grotesk** (400, 500, 600) | Texto corrido, rótulos, botões | SIL OFL 1.1 · [licença no Google Fonts](https://fonts.google.com/specimen/Hanken+Grotesk/license) |

- Por quê: a Young Serif tem terminais redondos e bojo largo, com cara de letreiro antigo pintado à mão. É acolhedora sem ser chique. A Hanken Grotesk é uma grotesca calma e bem legível em 16–17 px no celular, com acentos e ñ/¿/¡ completos.
- Limite: a Young Serif tem um peso só. A hierarquia vem do tamanho e do espaço, não do negrito (combina com a direção).
- Texto oficial da licença: [openfontlicense.org](https://openfontlicense.org/open-font-license-official-text/).

### Logo (rascunho)

- Símbolo/avatar: [directions/a-restinga/symbol.svg](directions/a-restinga/symbol.svg). Um ramo de acácia com uma folha pinada (os folíolos repetem as marcações da régua de 50 m) e três flores-pompom amarelas, num disco verde-restinga. No avatar do WhatsApp lê como "ramo com flores amarelas". Em 16 px vira três pontos amarelos sobre verde, ainda reconhecível.
- Horizontal: [directions/a-restinga/logo.svg](directions/a-restinga/logo.svg). Símbolo sem o disco + "Acácia" em Young Serif + descritor opcional em caixa alta espaçada.
- Para a T06: converter o texto em contornos e testar uma variação em que o acento agudo do "Á" vira um folíolo.

### Tom de voz

Frases completas e calmas, que descrevem o que a pessoa vai ver e fazer. Fato concreto em toda frase. Tratamento "você"; em espanhol, "vos".

| pt-BR | en | es (rioplatense) |
|---|---|---|
| Da varanda dá pra ver o mar. A areia fica a 50 m, no fim da rua de lajotas. | You can see the sea from the balcony. The sand is 50 m away, at the end of the paved lane. | Desde el balcón ves el mar. La arena está a 50 m, al final del pasaje de adoquines. |
| Cozinha completa, com forno e cafeteira: o café da manhã sai em casa. | Full kitchen with an oven and a coffee maker, so breakfast happens at home. | Cocina completa, con horno y cafetera: el desayuno lo armás en casa. |
| Wi-Fi no apartamento todo e mesa pra 4. Dá pra passar umas semanas trabalhando daqui. | Wi-Fi throughout and a table for four. It works for a few weeks of remote work. | Wi-Fi en todo el depto y mesa para cuatro. Te sirve si venís unas semanas a trabajar a distancia. |
| Quer saber se tem vaga nas suas datas? A mensagem já vai com o nome do apartamento. | Want to check your dates? The message already includes the apartment's name. | ¿Querés saber si hay lugar en tus fechas? El mensaje ya sale con el nombre del depto. |

### Mock

[directions/a-restinga/mock.html](directions/a-restinga/mock.html): página do apartamento com varanda. Foto vertical da varanda ocupando a metade esquerda, título grande, a régua dos 50 m (a linha se desenha ao carregar a página; sem animação se o sistema pedir menos movimento), lista "O que tem no apartamento" em rótulo/valor (sem cards), faixa de fotos com larguras diferentes e legendas, bloco de regras em texto corrido e faixa verde com o botão amarelo do WhatsApp.

---

## Direção B · Sextavado

**Conceito:** a marca com cara de rua de praia: o ocre da fachada, a lajota sextavada do caminho até o mar e a placa de rua azul de Florianópolis. É mais gráfica e mais solar. A informação vem em formato de placa e de tabela, com números primeiro. Combina com quem decide rápido e quer os fatos.

### Paleta

| Nome | Hex | Papel |
|---|---|---|
| Cal | `#FAF8F3` | Fundo principal (branco de parede caiada) |
| Ocre | `#D9A441` | Campo de cor do topo (a fachada), botão do WhatsApp |
| Mar fundo | `#0F3A40` | Texto, títulos, placa, faixa do CTA |
| Água | `#A8D6CC` | Superfície de destaque (bloco de regras), texto claro na placa |
| Pedra | `#565C58` | Texto secundário, **só sobre Cal** |

**Contraste (WCAG 2.2, calculado com [`directions/contrast.py`](directions/contrast.py))**

| Texto | Fundo | Razão | Resultado | Onde aparece |
|---|---|---|---|---|
| Mar fundo | Cal | **11,64:1** | AA (e AAA) | Texto corrido, tabela |
| Pedra | Cal | **6,45:1** | AA | Texto secundário |
| Mar fundo | Ocre | **5,49:1** | AA | Título, breadcrumb e menu sobre o ocre; texto do botão |
| Mar fundo | Água | **7,74:1** | AA (e AAA) | Bloco de regras |
| Cal | Mar fundo | **11,64:1** | AA (e AAA) | Placa, título do CTA, idioma ativo |
| Água | Mar fundo | **7,74:1** | AA (e AAA) | Bairro e "praia →" na placa, nota do CTA |
| Ocre | Mar fundo | **5,49:1** | AA | "50 m" na placa, anel de foco na faixa escura |

**Pares proibidos:** Ocre sobre Cal (2,12:1) e Água sobre Cal (1,50:1), reprovados. Pedra sobre Água (4,29:1) e Pedra sobre Ocre (3,04:1) só passariam como texto grande, então ficam fora. Regra simples: **sobre Ocre e sobre Água, o texto é sempre Mar fundo**.

### Tipografia

| Papel | Fonte | Uso | Licença |
|---|---|---|---|
| Títulos | **Zilla Slab** (500, 700) | H1 a H3, wordmark, rótulos da tabela, placa, botões | SIL OFL 1.1 · [licença no Google Fonts](https://fonts.google.com/specimen/Zilla+Slab/license) |
| Texto | **Libre Franklin** (400, 500, 600) | Texto corrido, legendas, menu | SIL OFL 1.1 · [licença no Google Fonts](https://fonts.google.com/specimen/Libre+Franklin/license) |

- Por quê: a Zilla Slab é uma serifa egípcia (serifas grossas e retas), a família das placas de rua e dos letreiros de comércio. Passa franqueza e preço justo, nada de luxo. A Libre Franklin é uma grotesca clássica, firme e muito legível, que segura bem a tabela de fatos.
- Texto oficial da licença: [openfontlicense.org](https://openfontlicense.org/open-font-license-official-text/).

### Logo (rascunho)

- Símbolo/avatar: [directions/b-sextavado/symbol.svg](directions/b-sextavado/symbol.svg). Um sextavado ocre (a lajota do caminho) com a flor-pompom da acácia desenhada como 12 estames em volta de um miolo, num disco azul-petróleo. O sextavado é uma forma forte em círculo pequeno: em 40 px continua nítido, e em 16 px vira um hexágono amarelo com um ponto.
- Horizontal: [directions/b-sextavado/logo.svg](directions/b-sextavado/logo.svg). Sextavado + "ACÁCIA" em Zilla Slab 700, caixa alta com espaçamento largo, como placa.
- Risco a avaliar: a flor de estames pode ser lida como "sol". Para Jurerê não é ruim, mas a T06 pode deixar os estames irregulares (comprimentos alternados) para puxar mais para flor.

### Tom de voz

Curto, tipo placa. Número antes do adjetivo. Frases nominais quando der. Tratamento "você"; em espanhol, "vos".

| pt-BR | en | es (rioplatense) |
|---|---|---|
| 50 m até a areia. Garagem privativa, sem custo. | 50 m to the sand. Private parking, free. | 50 m a la arena. Cochera propia, sin cargo. |
| Apto 4: andar de cima, varanda, vista pro mar. Até 3 pessoas. | Apt 4: upstairs, balcony, sea view. Sleeps 3. | Depto 4: planta alta, balcón con vista al mar. Hasta 3 personas. |
| Mínimo de 4 noites. O ano todo. | 4-night minimum, all year. | Mínimo 4 noches, todo el año. |
| Tem vaga nas suas datas? Mande as datas e quantas pessoas. | Free on your dates? Send your dates and how many of you. | ¿Hay lugar en tus fechas? Mandanos las fechas y cuántos son. |

### Mock

[directions/b-sextavado/mock.html](directions/b-sextavado/mock.html): mesma página, outra lógica. Topo inteiro em ocre com "Apto 4" grande em slab e a placa de rua azul (endereço + "50 m praia →"). A foto da varanda sai do bloco ocre e invade a seção de baixo. Depois vêm a tabela de fatos com filetes grossos, as regras num bloco verde-água, um mosaico de fotos com tamanhos diferentes e a faixa azul-petróleo com o botão ocre do WhatsApp.

---

## O que vale para as duas

- **Espanhol:** "depto" ou "departamento" para os argentinos ("apartamento" é mais uruguaio) e "cochera" para garagem. Os dois países entendem as duas formas. Detalhe para a T18/T19.
- **Palavras que nunca entram:** paraíso, inesquecível, exclusivo, luxo, sofisticado, "experiência", "o melhor de Jurerê". Também nada que a gente não possa provar (velocidade do Wi-Fi, tempo de resposta, número de vagas).
- **Lista proibida do claude.md, conferida nos dois mocks:** sem gradiente roxo/azul, sem glassmorphism, sem emoji, sem ícone decorativo por bloco (o único ícone é o do WhatsApp, no botão), sem grade de 3 cards iguais (A usa lista rótulo/valor e faixa de fotos; B usa tabela e mosaico irregular), sem sombra (B tem só o filete duplo da placa).
- **Acessibilidade nos mocks:** contraste AA em todos os pares de texto, foco visível (3 px), alvos de toque ≥ 44 px (exceto o link de texto do breadcrumb, que a WCAG 2.5.8 dispensa por estar no meio do texto), `alt` descritivo em todas as fotos, `prefers-reduced-motion` respeitado e nenhuma rolagem horizontal da página em 390 px (verificado com Playwright no Chromium: `scrollWidth` = 390 e 1440, sem erros no console).

## Minha recomendação

**A · Restinga**, por três motivos:
1. Bate mais com "acolhedora e tranquila". A B é mais "direta", mas o ocre em tela cheia grita um pouco, e o risco é ficar com cara de comércio.
2. As fotos provisórias têm muita cor misturada (almofadas estampadas, cadeiras vermelhas, fachada amarela). O fundo claro e quieto da A deixa as fotos protagonistas. O campo ocre da B compete com elas.
3. A régua dos 50 m transforma o maior diferencial (a distância da praia) no elemento visual da marca, e ela funciona igual para imóveis futuros (só muda o número).

Se você gostar da franqueza da B, dá para levar só a **voz curta** dela para a A nos pontos de decisão (fatos, regras, CTA). Eu não misturaria as paletas.

---

## Perguntas abertas

Responda embaixo de cada uma, na linha "Resposta:". Se a sugestão servir, basta escrever "ok".

**1. Qual direção você escolhe: A (Restinga) ou B (Sextavado)?**
- Sugestão: A, pelos motivos acima.
- Resposta:

**2. O que ajustar na direção escolhida (cor, fonte, símbolo, régua/placa)?**
- Sugestão: na A, testar na T06 o acento do "Á" como folíolo e conferir o símbolo impresso em 2 cm (placa/adesivo). Se escolher a B, deixar os estames irregulares para não parecer sol.
- Resposta:

**3. Como chamar os imóveis nos títulos: pelo tipo ("Apartamento com varanda" / "Apartamento térreo") ou pelo número ("Apto 4" / "Apto 6")?**
- Sugestão: pelo tipo no título e o número como detalhe ("Apto 4"), porque o tipo diz algo ao hóspede e o número não. Isso afeta a T11 (modelo de dados) e a T18 (textos).
- Resposta:

**4. O logo leva descritor fixo embaixo do nome ("apartamentos pé na areia", "apartamentos de praia") ou só "Acácia"?**
- Sugestão: só "Acácia" no logo, com o descritor no título da página e no Open Graph. Se a marca crescer para outros bairros e algum imóvel não for pé na areia, o logo não precisa mudar.
- Resposta:

**5. A voz pode usar "nós" sem nomes ("mandamos as instruções pelo WhatsApp")?**
- Sugestão: sim. A família não aparece, mas um "nós" discreto soa como gente de verdade, sem personificar ninguém. A alternativa é a voz impessoal ("as instruções chegam pelo WhatsApp"), mais fria.
- Resposta:

## Notas para outras tarefas

- **T06 (logo):** converter o texto dos SVGs em contornos (hoje eles usam texto com fonte do Google). Gerar versões clara e escura e testar o avatar do WhatsApp no recorte circular real.
- **T08 (tokens) / T20 (privacidade):** nos mocks as fontes vêm do CDN do Google Fonts só por conveniência. No site, **hospedar as fontes localmente** (`@font-face` com woff2): é mais rápido e não envia o IP do visitante ao Google antes do consentimento (LGPD).
- **T21 (direções visuais do site):** a régua dos 50 m (A) ou a placa de rua (B) é o componente-assinatura. As outras seções ficam quietas.
- **T26 (imagens):** quase todas as fotos são verticais. As duas direções foram desenhadas para foto vertical no hero; a horizontal (Open Graph 1200×630) vai depender das fotos novas.
- **CLAUDE.md:** registrar a direção escolhida em "Decisões › Marca" depois da resposta (critério de aceite da T05; não editei o CLAUDE.md porque não está nos `outputs` desta tarefa).
