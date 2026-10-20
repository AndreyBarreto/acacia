# Brief de marca

Status: **rascunho**. Aguardando as respostas do bloco 1 (ver `tasks/T03-brand-questions.md`).
Última atualização: 2026-10-19.
Fontes: `claude.md` (regras do projeto) e `docs/research/phase-1.md` (pesquisa da Fase 1).

Legenda: **[confirmado]** = decidido pelo usuário · **[pesquisa]** = vem da Fase 1, falta confirmar · **[pendente]** = ainda não respondido.

---

## 1. Contexto

- Imóveis de aluguel por temporada da família em Jurerê Internacional (Florianópolis/SC). **[confirmado]**
- Objetivo: reservas diretas, sem as taxas de Airbnb/Booking. O contato é só por WhatsApp, sem preço nem calendário no site por enquanto. **[confirmado]**
- Começa só com Jurerê, mas a marca deve servir para outros bairros e cidades depois. **[confirmado]**
- Site em 3 idiomas: pt-BR (padrão), en, es. As traduções devem ser naturais para cada público. **[confirmado]**

## 2. Nome

- Nome existente: **[pendente]**. A pasta do projeto se chama "acacia"; falta confirmar se é o nome da marca.
- Se precisar de sugestões: 2–3 propostas na T04, com checagem de .com.br, .com e @ no Instagram. **[pendente]**
- Restrições já conhecidas:
  - Sem palavras-chave no nome ("aluguel", "temporada", "Jurerê"). O Google suspende perfis da empresa com nome assim, e o nome precisa ser o nome real da marca. **[pesquisa]**
  - Sem nome de bairro, porque a marca vai se expandir. **[confirmado — regra do claude.md]**
  - Fácil de falar e de escrever em pt, en e es. **[pesquisa]**

## 3. Posicionamento

- Público principal: **[pendente]**. Hipótese: famílias brasileiras e argentinas/uruguaias, com casais como segundo público.
- Faixa de preço: **[pendente]**. Hipótese: intermediária a alto padrão, sem ostentação.
- Diferenciais já identificados **[pesquisa]**:
  - **Atendimento direto pelos donos**. Nenhum concorrente local mostra quem está por trás nem avaliações. "Imóvel da família, atendido pelos donos" é um diferencial real.
  - **Espanhol de verdade para argentinos e uruguaios**. Não há site de aluguel direto em Jurerê bem posicionado em espanhol, e os concorrentes têm "en" falso ou só português. É a maior lacuna de SEO.
  - **Conteúdo local útil** (distâncias, tempos, nomes de lugares), em vez de "Miami brasileira".
  - **Cuidado e qualidade**: os concorrentes têm erros de digitação e de encoding, fotos placeholder e venda misturada com aluguel. Um site pequeno, cuidadoso e rápido se destaca.
  - **Página por imóvel com detalhe** (distância a pé da praia, camas por quarto, vagas).
- Diferenciais concretos dos imóveis (fatos verificáveis): **[pendente]**
- Família aparece no site (nome/foto de quem atende): **[pendente]**

## 4. Personalidade e tom de voz

- 3 adjetivos que a marca deve transmitir: **[pendente]**. Hipótese: acolhedora, direta, tranquila/praiana.
- 3 adjetivos que ela não pode transmitir: **[pendente]**. Hipótese: ostentosa, genérica, festeira.
- Regras de texto já definidas **[confirmado — claude.md]**:
  - Direto e específico, com cara de família que conhece o lugar. Ex.: "3 minutos a pé da praia, garagem pra 2 carros".
  - Proibido usar frases genéricas: "Descubra o paraíso", "Experiência inesquecível" e similares.
- Tratamento por idioma ("você"; "vos" ou "tú" em espanhol; público do inglês): **[pendente]**

## 5. Referências

- Gosta (e por quê): **[pendente]**
- Não gosta (e por quê): **[pendente]**
- Consenso da pesquisa sobre bons sites de aluguel direto **[pesquisa]**: fotos grandes primeiro; na página do imóvel, a ordem fotos → destaques → detalhes/camas → regras → CTA; mobile first; pouca fricção até o contato.

## 6. Logo

- Tipo (wordmark, símbolo + texto, monograma): **[pendente]**
- Onde será usado: **[pendente]**. Já se sabe que o logo vai para o site, o favicon, o avatar do WhatsApp Business **[confirmado — entregáveis do claude.md]** e a imagem Open Graph.
- Requisitos técnicos já conhecidos:
  - Versões horizontal, quadrada/ícone (avatar do WhatsApp e favicon), clara e escura, em SVG. **[confirmado]**
  - O avatar do WhatsApp é um círculo pequeno, então o ícone precisa ser legível em ~40 px. **[pesquisa]**
  - Se houver placa física, ela ajuda na verificação por vídeo do Perfil da Empresa no Google (fachada/placa). **[pesquisa]**

## 7. Cores e tipografia

- Cor obrigatória: **[pendente]**
- Cor proibida: **[pendente]**. Já está proibido o gradiente roxo/azul.
- Tipografia (serifada, sem serifa, mista): **[pendente]**
- Diretrizes já definidas **[confirmado — claude.md]**:
  - Paleta inspirada no lugar: areia, mar, restinga. Poucas cores.
  - Tipografia com personalidade, Google Fonts ou licença livre.
  - Contraste WCAG AA em todas as combinações de texto.

## 8. Fotografia

- Estilo (luz natural, com/sem pessoas, detalhes vs. ambientes): **[pendente]**
- Fotos disponíveis e se vamos precisar de novas: **[pendente]**
- Diretrizes já definidas:
  - Fotos reais e grandes como protagonistas. **[confirmado — claude.md]**
  - Mínimo de 8 fotos por imóvel, cobrindo quarto, banheiro e área comum (campos do schema `VacationRental`). **[pesquisa]**
  - Imagem de preview para WhatsApp/Open Graph: 1200×630, JPEG < 300 KB, uma por imóvel e por idioma. **[pesquisa]**
  - Usar `<img>` de verdade, sem `background-image`, para as fotos serem indexadas. **[pesquisa]**

## 9. O que evitar (lista explícita)

Regras do `claude.md` ("Design: não pode parecer feito por IA"). Valem para a identidade, o site e todos os materiais.

**Visual**
- Gradiente roxo/azul.
- Glassmorphism (vidro fosco, blur translúcido).
- Emojis em títulos.
- Ícone genérico em todo bloco.
- Grade de 3 cards iguais.
- Sombras exageradas.
- Layout monótono: o ritmo tem que variar entre as seções.
- Fotos de banco de imagem ou placeholder no lugar de fotos reais.
- Muitas cores: a paleta é curta.

**Texto**
- Frases genéricas: "Descubra o paraíso", "Experiência inesquecível" e afins.
- Tradução literal entre idiomas.
- Adjetivos sem prova: trocar por fato concreto (distância, tempo, quantidade).

**Marca e Google**
- Palavra-chave no nome da marca ("Aluguel Temporada Jurerê…").
- Um perfil do Google por imóvel (não é permitido e leva à suspensão).
- Copiar textos de avaliações do Booking/Airbnb sem confirmar a permissão.

## 10. Próximos passos

1. Respostas do bloco 1 → atualizar as seções 2, 3 e 4.
2. Blocos 2 (referências e logo), 3 (cores, tipografia e fotografia) e 4 (voz nos 3 idiomas e ajustes), conforme o rascunho em `tasks/T03-brand-questions.md`.
3. Brief completo e aprovado → libera a T04 (nomes, se necessário) e a T05 (2 direções de identidade).
