# Guia de marca: Acácia

Status: **rascunho para revisão** (T07). Data: 2026-10-19.
Direção: **A · Restinga** (ver [brand/directions.md](brand/directions.md)). Decisões de marca: [CLAUDE.md](../CLAUDE.md). Regras de design do projeto: [claude.md](../claude.md).

Este é o guia de referência para os agentes de conteúdo (T17 a T20), design (T21, T25) e tokens (T08). Os números de contraste são os da T05, calculados com [brand/directions/contrast.py](brand/directions/contrast.py).

Resumo em uma linha: **Acácia é a marca de quem conhece o lugar e descreve com calma, com um fato concreto em toda frase.** Verde-restinga sobre fundo claro, serifa macia nos títulos, fotos grandes e a régua dos 50 m como assinatura.

---

## 1. Princípios

1. **Fato antes de adjetivo.** "A 50 m da praia" vale mais que "pertinho do mar".
2. **Calma.** Frases completas, muito respiro, nada gritando. A foto é a protagonista, a marca fica quieta.
3. **De quem conhece o lugar.** Um "nós" discreto, sem nomes. A família não aparece no site, nem por nome nem por foto.
4. **Pé na areia, sem ostentação.** Posicionamento intermediário. Nunca luxo, nunca festa, nunca genérico.
5. **Cada idioma é escrito para o seu público.** Sem tradução literal. O espanhol é rioplatense, com "vos".

Adjetivos que a marca transmite: acolhedora, direta, tranquila. Que não pode transmitir: ostentosa, genérica, festeira.

---

## 2. Cores

Poucas cores, todas tiradas do lugar: a restinga, a água clara e esverdeada da baía, a flor de acácia.

| Nome | Hex | Papel |
|---|---|---|
| **Concha** | `#EEF1EA` | Fundo principal. Claro e puxado pro verde, não creme. |
| **Restinga** | `#1F3B2D` | Texto e títulos; fundo da faixa escura do CTA; disco do símbolo. |
| **Folha** | `#4A6450` | Texto secundário: legendas, rótulos, breadcrumb. |
| **Mar raso** | `#D3E5DD` | Superfície de destaque (bloco de regras); texto claro sobre Restinga. |
| **Acácia** | `#E8B42C` | Acento: flores do símbolo, botão do WhatsApp, ponto "areia" da régua, anel de foco sobre Restinga. |

Proporção aproximada de uso em uma página: Concha 70%, Restinga 20%, Mar raso 6%, Folha (só texto), Acácia 4% ou menos. O amarelo é raro de propósito: quando aparece, é o botão ou a flor.

### Pares de texto aprovados (WCAG 2.2 AA)

| Texto | Fundo | Razão | Resultado | Onde aparece |
|---|---|---|---|---|
| Restinga | Concha | **10,69:1** | AA e AAA | Títulos e texto corrido |
| Folha | Concha | **5,70:1** | AA | Rótulos, legendas, breadcrumb |
| Restinga | Mar raso | **9,31:1** | AA e AAA | Bloco "Antes de reservar" |
| Folha | Mar raso | **4,96:1** | AA | Texto secundário no bloco |
| Concha | Restinga | **10,69:1** | AA e AAA | Título da faixa do CTA |
| Mar raso | Restinga | **9,31:1** | AA e AAA | Nota sob o botão |
| Acácia | Restinga | **6,39:1** | AA | Anel de foco na faixa escura |
| Restinga | Acácia | **6,39:1** | AA | Texto do botão do WhatsApp |

### Pares proibidos para texto

| Texto | Fundo | Razão | Regra |
|---|---|---|---|
| Acácia | Concha | 1,67:1 | Só decoração (flor, ponto da régua). Nunca texto nem ícone informativo. |
| Acácia | Mar raso | 1,46:1 | Idem. |

Regra prática: **texto amarelo só sobre Restinga; texto sobre amarelo é sempre Restinga.** O foco de teclado usa anel de 3 px: Restinga sobre Concha e Mar raso, Acácia sobre Restinga.

Os tokens finais (nomes CSS, escala, espaçamento) saem na T08; os hex acima são a fonte.

---

## 3. Tipografia

| Papel | Família | Pesos | Uso |
|---|---|---|---|
| Títulos | **Young Serif** | 400 (peso único) | H1 a H3, wordmark, números de destaque ("50 m"), frase do CTA |
| Texto | **Hanken Grotesk** | 400, 500, 600 | Texto corrido, rótulos, botões, menu, legendas |

Ambas SIL OFL 1.1, uso livre no site. Cobrem acentos do português e ñ, ¿ e ¡ do espanhol.

**A Young Serif só tem um peso.** A hierarquia dos títulos vem do tamanho e do espaço, nunca de negrito. Não aplicar `font-weight: 700` nem usar itálico sintético nos títulos (o navegador fabricaria um falso). Na Hanken Grotesk: 400 para o texto, 500 para rótulos e menu, 600 para botões e ênfase curta.

### Escala (mobile first)

Os valores abaixo partem do celular de 390 px e crescem com `clamp()`. Texto corrido nunca abaixo de 16 px; o menor texto do site (legenda) é 14 px.

| Estilo | Fonte | Mobile | Desktop (máx.) | Entrelinha | Observação |
|---|---|---|---|---|---|
| H1 | Young Serif | 40 px | 76 px | 1,02 | `clamp(40px, 7vw, 76px)`; um por página |
| H2 | Young Serif | 28 px | 44 px | 1,1 | `clamp(28px, 4.5vw, 44px)` |
| H3 | Young Serif | 22 px | 28 px | 1,2 | |
| Frase do CTA | Young Serif | 26 px | 40 px | 1,15 | `clamp(26px, 4vw, 40px)`, até 22 caracteres por linha |
| Lede (abertura) | Hanken Grotesk 400 | 19 px | 21 px | 1,45 | Até 34 caracteres por linha no hero |
| Texto corrido | Hanken Grotesk 400 | 16 px | 18 px | 1,6 | Até 65 caracteres por linha |
| Rótulo / menu | Hanken Grotesk 500 | 15 px | 15 px | 1,4 | Em caixa alta só na régua, com espaçamento de .06em |
| Botão | Hanken Grotesk 600 | 17 px | 17 px | 1 | Altura mínima 48 px |
| Legenda | Hanken Grotesk 400 | 14 px | 14 px | 1,4 | Cor Folha, até 30 caracteres por linha |

Regras: títulos em caixa normal (sem caixa alta); espaçamento de letra de -0.01em só no H1; nada de texto justificado; alvos de toque de pelo menos 44 px.

### Hospedagem das fontes

- **Local, em woff2, nunca pelo CDN do Google.** O CDN enviaria o IP do visitante ao Google antes do consentimento (LGPD; decisão T05/T20). Os mocks da T05 usam o CDN só por conveniência e não valem como referência nisso.
- Arquivos em `public/fonts/` (ou onde a T22 definir): `young-serif-400.woff2` e `hanken-grotesk-var.woff2` (variável, eixo de peso 400 a 600). Se a variável pesar demais, usar 3 estáticos (400, 500, 600).
- Subconjunto **latin + latin-ext** só se houver caractere fora do latin; para pt, en e es o subconjunto `latin` basta.
- `@font-face` com `font-display: swap`; `<link rel="preload" as="font" type="font/woff2" crossorigin>` só para a Young Serif e a Hanken 400 (as que aparecem acima da dobra).
- Fallback ajustado para reduzir o salto de layout: `Georgia, serif` nos títulos e `system-ui, sans-serif` no texto, com `size-adjust` calibrado na T25.
- Guardar o texto da licença OFL junto das fontes (`public/fonts/OFL.txt`).

---

## 4. Logo

> **Os arquivos finais vêm da T06 em `assets/brand/logo/`** (`logo-horizontal-{light,dark}.svg`, `logo-square-{light,dark}.svg`, `favicon.svg` e PNGs 32/180/512). Os rascunhos atuais estão em [brand/directions/a-restinga/](brand/directions/a-restinga/) e **não devem ir para o site**. As medidas abaixo são propostas e devem ser conferidas e ajustadas quando a T06 terminar.

**O logo é só "Acácia"**, sem descritor. O descritor ("apartamentos a 50 m da praia") vai no title e no Open Graph, nunca no logo.

### Versões

| Versão | Composição | Uso |
|---|---|---|
| Horizontal | Símbolo (sem disco) + "Acácia" em Young Serif | Cabeçalho, rodapé, Open Graph |
| Quadrada / ícone | Ramo com 3 flores-pompom amarelas em disco Restinga | Avatar do WhatsApp e do Instagram, favicon, apple-touch-icon |
| Clara / escura | Duas cores de cada versão | Escura (texto Restinga) sobre fundo claro; clara (texto Concha) sobre Restinga ou foto escurecida |

### Área de respiro

Proposta: **x = altura da letra "A" do wordmark**. Manter uma margem livre de **x em todos os lados**, nada de texto, borda ou foto invadindo. No ícone quadrado, a margem é de **metade do diâmetro do disco** quando ele está sobre foto.

### Tamanho mínimo

| Versão | Digital | Impressão |
|---|---|---|
| Horizontal | 96 px de largura | 24 mm |
| Ícone | 32 px (favicon em 16 px aceito: lê como três pontos amarelos sobre verde) | 12 mm (testar em adesivo de 2 cm antes de imprimir placa) |

Para o avatar do WhatsApp, usar o ícone quadrado sem recorte próprio: a plataforma corta em círculo, e o símbolo precisa ficar legível em ~40 px.

### Fundos permitidos

- Versão escura sobre **Concha**, **Mar raso** e **fotos claras e calmas** (céu, areia, parede).
- Versão clara sobre **Restinga** e sobre foto escurecida com sobreposição Restinga a 40% ou mais.
- Contraste do wordmark com o fundo de pelo menos 4,5:1; se não der, trocar de versão ou de fundo.

### O que não fazer

- Não esticar, girar, inclinar nem mudar as proporções.
- Não recolorir fora das duas versões (nada de logo roxo, azul, rosa ou degradê).
- Não colocar sobre fundo com muito detalhe ou com cor próxima (amarelo sobre Acácia, verde sobre Folha).
- Não pôr sombra, contorno, brilho, efeito de vidro nem animação de rotação.
- Não separar o ramo do wordmark na versão horizontal nem trocar a fonte do nome.
- Não acrescentar descritor, slogan ou "Jurerê" ao logo.
- Não redesenhar o símbolo (flores a mais, cores de flor diferentes de Acácia).
- Não usar o ícone quadrado dentro de outro círculo ou moldura.

---

## 5. Elemento-assinatura: a régua dos 50 m

Uma linha fina com marcações, do **portão** até a **areia**, passando pelo "50 m". É a distância mais importante do imóvel virada em imagem, e as marcações repetem os folíolos do ramo do símbolo.

**Composição:** linha Restinga de 2 px; marcações curtas a cada intervalo igual; rótulos em Hanken 500, 15 px, caixa alta, Folha ("PORTÃO", "50 m", "AREIA"); o ponto final "areia" é o único elemento Acácia da régua. No carregamento a linha se desenha da esquerda para a direita; com `prefers-reduced-motion`, aparece pronta e parada.

**Quando usar**
- No topo da página de cada apartamento, abaixo do H1 (uma vez por página).
- Uma vez na home, perto do hero, como prova do diferencial.
- No bloco "como chegar à praia" da página do bairro, se o número for verdadeiro.
- Em peças da marca (Open Graph, cartão de apresentação, post), no máximo uma por peça.

**Quando não usar**
- Como divisor de seção ou enfeite repetido em todas as páginas.
- No cabeçalho, no rodapé ou como borda de cartão.
- Quando a distância não for verdadeira ou não estiver confirmada: o número muda por imóvel, mas **só entra um número que a família confirmou**. Hoje, 50 m para os dois aptos.
- Como barra de progresso ou carregamento.
- Em tamanho tão pequeno que o rótulo fique abaixo de 14 px.
- Duas vezes na mesma tela.

Texto sempre "a 50 m da praia" (en: "50 m from the beach"; es: "a 50 m de la playa"). Nunca "beira-mar", "frente al mar" nem "beachfront".

---

## 6. Fotografia

As 45 fotos do Booking em `assets/booking/photos/` são **provisórias**. Vamos fazer fotos novas.

### Princípios

- **Luz natural.** Sem flash, sem luz fria de lâmpada misturada com a do sol. Ligar as luzes só quando a cena escurecer e for a luz quente que existe de fato.
- **Sem pessoas.** Nem rosto, nem mão, nem sombra reconhecível. Isso também mantém a família fora do site.
- **Detalhes e lugar.** Mostrar o que o hóspede vai ver: a cama feita, o sofá-cama, a varanda, o caminho de lajotas, a cerca viva, a praia. Pouca decoração fotográfica de revista.
- **Honestidade.** Lente que não deforme o ambiente (sem grande-angular extrema), sem retoque que mude cor, tamanho ou vista. A foto tem que bater com o que o hóspede encontra.
- **Verde e água como pano de fundo.** Evitar cores saturadas soltas no quadro (almofadas estampadas, cadeiras vermelhas), pois competem com a paleta. Se existirem, tirar do quadro ou aceitar como pontos de cor.
- **Sem banco de imagem.** Nada de foto genérica de praia, sem texto sobreposto dentro da foto.
- **`<img>` de verdade**, com `alt` descritivo nos 3 idiomas (o texto do `alt` fala do que se vê, não do que se quer vender).

### Especificações

| Item | Valor |
|---|---|
| Captura | Câmera ou celular em RAW/JPEG alta qualidade; lado maior de pelo menos 3000 px |
| Entrega | JPEG sem compressão agressiva; o pipeline (T26) gera AVIF/WebP e tamanhos |
| Orientação | Vertical para hero e destaques (a direção A usa foto vertical grande); horizontal nos planos largos e no Open Graph. **Fazer os planos-chave nas duas orientações.** |
| Open Graph | **1200×630, JPEG abaixo de 300 KB**, uma por imóvel e por idioma. Área segura central de 1000×500; deixar o terço esquerdo calmo para o título ("Apto 4 · Acácia") |
| Mínimo | **8 fotos por imóvel**, cobrindo quarto, banheiro e área comum (exigência do schema `VacationRental`). Meta: 14 para o Apto 4 e 12 para o Apto 6 |
| Nomes | Em inglês, minúsculas, com hífen (`apto-4-bedroom-01.jpg`), por causa do código |

### Luz e horário

A praia de Jurerê abre para o norte. Antes de cada sessão, conferir a posição do sol no local (app de bússola ou de trajetória solar) e ajustar.

| Cena | Horário sugerido | Observação |
|---|---|---|
| Quartos e salas | Manhã (cerca de 9h às 11h) ou fim de tarde, com cortinas abertas | Luz que entra pela janela, sem sol batendo direto na cama |
| Varanda do Apto 4 e vista | Última hora e meia antes do pôr do sol | Mar com a luz lateral; cuidado com contraluz forte |
| Banheiros | Dia nublado ou luz difusa | Sem reflexo do flash no vidro do box |
| Fachada, portão, rua de lajotas | Primeira hora depois do nascer do sol | Rua vazia, sem carro estacionado na cena |
| Praia | Hora dourada (primeira ou última) | Areia limpa, sem guarda-sol de terceiros em destaque |
| Pôr do sol | Ao entardecer | Uma foto horizontal do pôr do sol serve de reserva para o Open Graph |

### Roteiro: planos por apartamento

Legenda de orientação: **V** = vertical, **H** = horizontal, **V+H** = fazer nas duas.

**Apto 4 (varanda, andar de cima, vista para o mar)**

| # | Plano | Orientação | Luz |
|---|---|---|---|
| 1 | Varanda com mesa e cadeiras, mar ao fundo (hero) | V+H | Fim de tarde |
| 2 | Vista do mar vista da varanda, sem móveis | H | Fim de tarde |
| 3 | Quarto: cama de casal inteira, de frente | V+H | Manhã |
| 4 | Quarto: detalhe da roupa de cama e da janela | V | Manhã |
| 5 | Sala: sofá-cama (aberto e fechado em fotos separadas) | V+H | Manhã |
| 6 | Sala com porta de correr abrindo para a varanda | V+H | Manhã ou tarde |
| 7 | Cozinha e mesa de jantar | V+H | Manhã |
| 8 | Detalhe da cozinha: cafeteira, forno ou micro-ondas | V | Manhã |
| 9 | Mesa de trabalho com Wi-Fi à vista (sem notebook de pessoas) | V | Manhã |
| 10 | Banheiro: visão geral com box | V | Difusa |
| 11 | Banheiro: cuba e detalhe de toalhas | V | Difusa |
| 12 | Escada de acesso ao andar de cima | V | Manhã |
| 13 | Ar split quente/frio no ambiente | H | Qualquer |
| 14 | Entrada do apartamento (porta e acesso) | V | Manhã |

**Apto 6 (térreo, sem degraus da rua até dentro)**

| # | Plano | Orientação | Luz |
|---|---|---|---|
| 1 | Entrada térrea do portão até a porta, sem degraus (hero) | V+H | Manhã |
| 2 | Quarto: cama de casal inteira, de frente | V+H | Manhã |
| 3 | Quarto: detalhe da roupa de cama e da janela | V | Manhã |
| 4 | Sala: sofá-cama (aberto e fechado em fotos separadas) | V+H | Manhã |
| 5 | Cozinha completa e mesa de granito | V+H | Manhã |
| 6 | Detalhe da cozinha: cafeteira, forno ou micro-ondas | V | Manhã |
| 7 | Mesa de trabalho | V | Manhã |
| 8 | Banheiro: visão geral com box | V | Difusa |
| 9 | Banheiro: cuba e detalhe de toalhas | V | Difusa |
| 10 | Pátio interno visto da janela | H | Tarde |
| 11 | Ar split quente/frio no ambiente | H | Qualquer |
| 12 | Porta de entrada vista de dentro, sem degrau | V | Manhã |

**Áreas comuns (compartilhadas pelos dois aptos)**

| # | Plano | Orientação | Luz |
|---|---|---|---|
| 1 | Portão do residencial | V+H | Manhã cedo |
| 2 | Fachada com jardim de capim | V+H | Manhã cedo |
| 3 | Rua de lajotas até a praia, vista do portão (fotografar o trajeto de 50 m) | V+H | Manhã cedo |
| 4 | Garagem privativa | H | Dia |
| 5 | Praia de Jurerê, frente ao caminho | H | Hora dourada |
| 6 | Pôr do sol na baía | H | Entardecer |
| 7 | Detalhes do bairro: cerca viva, muro, lajota | V | Manhã cedo |

**Imagem Open Graph:** uma por imóvel e por idioma, 1200×630. Sugestão: foto horizontal da varanda (Apto 4) ou da entrada térrea (Apto 6), com o terço esquerdo calmo para o título. A da home e a do bairro usam a rua de lajotas ou o pôr do sol.

---

## 7. Tom de voz

### Como escrever

1. **Fato em toda frase.** Distância, quantidade, tempo, equipamento. Se não dá para provar, não entra.
2. **Frases completas e calmas.** Descrevem o que a pessoa vai ver e fazer. Frases curtas só nos pontos de decisão (regras, CTA).
3. **"Nós" discreto, sem nomes.** "Mandamos as instruções pelo WhatsApp." Nunca "a família Fulano", nunca foto ou nome de quem atende.
4. **Tratamento direto.** pt: "você". en: "you". es: **"vos"** (e as formas rioplatenses: "querés", "podés", "mandanos").
5. **Específico e local.** Nomes e distâncias reais, não "um lugar encantador".
6. **Sem promessa que não dá para cumprir.** Nada de velocidade de Wi-Fi, tempo de resposta ou horário de atendimento.
7. **Cada idioma é escrito do zero para o seu público**, não traduzido palavra por palavra.

### Regras fixas de vocabulário

- Distância: sempre **"a 50 m da praia"** (en: "50 m from the beach"; es: "a 50 m de la playa"). Nunca "beira-mar", "frente al mar", "beachfront".
- Títulos dos imóveis: **"Apto 4"** e **"Apto 6"** (en "Apt 4" / "Apt 6"; es "Depto 4" / "Depto 6"); o tipo (varanda/térreo) vem como detalhe.
- Espanhol: **"depto"** e **"cochera"**; "vos", não "tú".
- Apto 6: "sem escada" / "sin escalones" / "step-free" é permitido. Apto 4: acesso por escada.
- "Jurerê Internacional" só aparece na seção "Tradicional × Internacional" da página do bairro, nunca em title ou H1 da home e dos aptos.
- Capacidade: **até 3 pessoas** por apto. Estadia mínima: **4 noites o ano todo**. Proibido fumar em todo o imóvel.
- Wi-Fi: dizer que tem Wi-Fi e mesa de trabalho. Nunca "Wi-Fi rápido" nem Mbps.
- Pagamento e cancelamento: "combinamos pelo WhatsApp", sem política escrita.
- Não mostrar nota nem link do Booking. Não mostrar horário nem tempo de resposta perto do botão do WhatsApp.

### Tabela "diga / evite"

Exemplos com fatos reais dos aptos. A coluna "evite" mostra o erro típico: o genérico, o não verificável ou o proibido.

#### Português (pt-BR)

| Diga | Evite |
|---|---|
| A areia fica a 50 m, no fim da rua de lajotas. | Descubra o paraíso a poucos passos do mar. |
| Da varanda do Apto 4 dá pra ver o mar. | Vista deslumbrante de tirar o fôlego. |
| Apto 6: térreo, sem escada da rua até dentro. | Totalmente acessível e inclusivo. (promessa maior que o fato) |
| Garagem privativa, sem custo. | Estacionamento exclusivo e seguro para o seu conforto. |
| Wi-Fi nos dois aptos e mesa de trabalho. Dá pra passar umas semanas trabalhando daqui. | Internet ultrarrápida, ideal para nômades digitais. |
| Cozinha completa, com forno, micro-ondas e cafeteira: o café da manhã sai em casa. | Cozinha gourmet de alto padrão. |
| Ar split quente e frio, também no inverno. | Climatização premium para todas as estações. |
| Mínimo de 4 noites, o ano todo. | Condições especiais de estadia. |
| Cama de casal e sofá-cama: até 3 pessoas. | Perfeito para toda a família e os amigos! |
| Quer saber se tem vaga nas suas datas? Mande as datas e quantas pessoas. | Reserve já e viva uma experiência inesquecível! |
| Aqui não se fuma, em nenhum cômodo. | Ambiente livre de fumo para o seu bem-estar. |
| Mandamos as instruções do self check-in pelo WhatsApp. | Nossa equipe de atendimento 24h está pronta para você. |

#### Inglês (en)

| Say | Avoid |
|---|---|
| The sand is 50 m away, at the end of the paved lane. | Discover paradise steps from the ocean. |
| You can see the sea from the Apt 4 balcony. | Breathtaking panoramic ocean views. |
| Apt 6 is on the ground floor, step-free from the street to the door. | Fully accessible and inclusive for everyone. |
| Private parking, free. | Exclusive secure parking for your comfort. |
| Wi-Fi in both apartments and a work table. It suits a few weeks of remote work. | Blazing-fast internet for digital nomads. |
| Full kitchen with an oven, microwave and coffee maker, so breakfast happens at home. | Gourmet kitchen with premium finishes. |
| Split air conditioning that heats and cools, in winter too. | Climate control for every season. |
| 4-night minimum, all year. | Flexible stays tailored to you. |
| One double bed and one sofa bed: sleeps 3. | Perfect for the whole family and friends! |
| Free on your dates? Send your dates and how many of you. | Book now for an unforgettable experience! |
| No smoking anywhere in the apartment. | A smoke-free sanctuary for your wellbeing. |
| We send the self check-in instructions on WhatsApp. | Our 24/7 concierge team is at your service. |

#### Espanhol rioplatense (es)

| Decí | Evitá |
|---|---|
| La arena está a 50 m, al final del pasaje de adoquines. | Descubrí el paraíso a pasos del mar. |
| Desde el balcón del depto 4 ves el mar. | Vistas impresionantes que te quitan el aliento. |
| Depto 6: planta baja, sin escalones desde la calle hasta adentro. | Totalmente accesible para todos. |
| Cochera propia, sin cargo. | Estacionamiento exclusivo y seguro para tu comodidad. |
| Wi-Fi en los dos deptos y mesa para trabajar. Te sirve si venís unas semanas a trabajar a distancia. | Internet ultrarrápido, ideal para nómadas digitales. |
| Cocina completa, con horno, microondas y cafetera: el desayuno lo armás en casa. | Cocina gourmet de primer nivel. |
| Aire split frío y calor, también en invierno. | Climatización premium todo el año. |
| Mínimo 4 noches, todo el año. | Condiciones especiales de estadía. |
| Cama matrimonial y sofá cama: hasta 3 personas. | ¡Ideal para toda la familia y los amigos! |
| ¿Querés saber si hay lugar en tus fechas? Mandanos las fechas y cuántos son. | ¡Reservá ya y viví una experiencia inolvidable! |
| No se puede fumar en ningún ambiente. | Espacio libre de humo para tu bienestar. |
| Te mandamos las instrucciones del self check-in por WhatsApp. | Nuestro equipo de atención 24 horas está a tu disposición. |

Notas do espanhol: "depto" é o termo argentino mais comum (o uruguaio entende, e "apartamento" pode aparecer no texto longo); "cochera" para garagem; "pasaje" ou "calle de adoquines" para a rua de lajotas; "sofá cama" sem hífen; "microondas" numa palavra.

---

## 8. Lista de proibições

Valem para a identidade, o site e todos os materiais (regras do [claude.md](../claude.md) e decisões do [CLAUDE.md](../CLAUDE.md)).

### Visual
- Gradiente roxo/azul (e qualquer degradê decorativo).
- Glassmorphism: vidro fosco, blur translúcido.
- Emojis em títulos (e emojis decorativos em geral).
- Ícone genérico em todo bloco. O único ícone fixo é o do WhatsApp, no botão.
- Grade de 3 cards iguais. Usar lista rótulo/valor, faixa de fotos com larguras diferentes ou blocos de tamanhos distintos.
- Sombras exageradas. Preferir nenhuma sombra.
- Layout monótono: o ritmo muda entre as seções.
- Fotos de banco de imagem ou placeholder no lugar de fotos reais.
- Muitas cores: a paleta tem cinco e o amarelo é raro.
- Fundo creme com serifa contrastada e acento terracota; fundo quase preto com acento neon; layout de jornal com filetes finos (os três visuais que denunciam site feito por IA).
- Negrito falso na Young Serif; texto amarelo sobre fundo claro.

### Texto
- Frases genéricas: "Descubra o paraíso", "Experiência inesquecível" e similares.
- Palavras: paraíso, inesquecível, exclusivo, luxo, sofisticado, "experiência", "o melhor de Jurerê", "dos sonhos", "refúgio", "sanctuary", "breathtaking", "imperdible" e equivalentes nos 3 idiomas.
- Adjetivo sem prova: trocar por fato (distância, tempo, quantidade).
- Tradução literal entre idiomas.
- "Beira-mar", "frente al mar", "beachfront": é sempre "a 50 m da praia".
- "Jurerê Internacional" fora da seção "Tradicional × Internacional".
- Promessa não verificável: velocidade do Wi-Fi, tempo ou horário de resposta, número de vagas.
- Espanhol com "tú" ou "apartamento" no lugar de "depto" e "cochera" nas chamadas curtas.

### Conteúdo e marca
- Nome, foto, sobrenome ou voz pessoal da família no site.
- Nota, estrelas ou link do Booking; textos de avaliações copiados sem autorização.
- Horário de atendimento e tempo de resposta perto do botão do WhatsApp.
- Política de pagamento ou cancelamento escrita no site (fica no WhatsApp).
- Palavra-chave ou nome de bairro no nome da marca; descritor no logo.
- Um Perfil do Google por imóvel; criar Perfil da Empresa antes de ter CNPJ e atendimento elegível (T13).
- Fontes pelo CDN do Google; scripts de terceiros carregados antes do "Aceitar".
- Pessoas nas fotos.

---

## Notas para outras tarefas

- **T06 (logo):** quando os arquivos finais saírem em `assets/brand/logo/`, conferir a seção 4 (área de respiro, tamanhos mínimos, fundos) contra os SVGs e ajustar os valores propostos aqui. Registrar o resultado do teste do avatar em círculo de 40 px.
- **T08 (tokens):** usar os hex, a escala e as regras de foco desta página como fonte. A Young Serif não tem pesos além do 400, então o token de peso de título é fixo.
- **T18, T19, T17:** usar a tabela da seção 7 como referência de tom. Os exemplos são ponto de partida; os textos finais são escritos em cada tarefa.
- **T26 (imagens):** o roteiro de fotos (seção 6) define orientação e nomes; o Open Graph é 1200×630 abaixo de 300 KB.
