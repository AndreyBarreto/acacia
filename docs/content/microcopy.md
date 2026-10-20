# Microcopy da interface e mensagens do WhatsApp (T19)

Status: **rascunho para aprovação do usuário**. Data: 2026-10-19.
Fontes: [CLAUDE.md](../../CLAUDE.md) (decisões), [brand.md](../brand.md) (tom de voz, seção 7), [page-map.md](../plan/page-map.md), [keywords.md](../plan/keywords.md) (titles e descriptions), [data-model.md](../plan/data-model.md) (§6 comodidades, §4.5 regras), [privacy.md](privacy.md) (§5, texto do banner de cookies) e [phase-1.md](../research/phase-1.md) §4.

Este arquivo é a fonte dos arquivos de tradução (`src/i18n/{pt,en,es}.json`, T23). Nada aqui é código: as chaves são em inglês, os valores são o texto final.

---

## 0. Convenções

### Idiomas e voz
- **pt-BR**: "você". **en**: "you". **es**: rioplatense com **vos** (querés, podés, escribinos, mandanos). Nada de "tú".
- Nos exemplos de deptos: "depto" e "cochera" (nunca "apartamento"/"estacionamiento" nos textos curtos).
- "Nós" discreto, sem nomes. Nenhum texto fala de horário de atendimento ou tempo de resposta.
- Distância sempre "a 50 m da praia" / "50 m from the beach" / "a 50 m de la playa". Nunca "beira-mar", "frente al mar", "beachfront".
- Sem emojis, sem exclamação em título, sem "experiência", "paraíso" etc. (lista de proibições do brand.md, seção 8). A única exclamação do arquivo é o "Olá!" / "Hi!" / "¡Hola!" que abre as mensagens do WhatsApp, onde é a forma natural de começar uma conversa.

### Placeholders
Chaves entre `{}`. O código substitui; o texto não muda. Todos são strings já formatadas, exceto os numéricos.

| Placeholder | O que é | Exemplo | Origem |
|---|---|---|---|
| `{name}` | Nome curto do imóvel, **já no idioma da página**: "Apto 4" / "Apt 4" / "Depto 4" | `Depto 4` | `property.label` (§7) com o número do apto |
| `{code}` | Identifier fixo do imóvel, igual nos 3 idiomas | `acacia-4` | `property.identifier` |
| `{checkIn}` | Data de entrada, formatada para o idioma (§0 "Formatos") | `12/11/2026` · `12 Nov 2026` | mini formulário |
| `{checkOut}` | Data de saída, idem | `16/11/2026` | mini formulário |
| `{guests}` | Número de pessoas (inteiro) | `2` | mini formulário |
| `{nights}` | Número de noites calculado | `4` | mini formulário |
| `{minNights}` | Estadia mínima do imóvel | `4` | `rules.minNights` |
| `{maxGuests}` | Capacidade do imóvel | `3` | `capacity.maxGuests` |
| `{earliest}` | Primeira data de saída válida (entrada + `minNights`), formatada | `16/11/2026` | mini formulário |
| `{count}` | Quantidade numérica em rótulos de detalhe | `1` | campos do imóvel |
| `{number}` | Número do apto | `4` | `unitLabel` |
| `{meters}` | Distância até a praia | `50` | `beachDistanceMeters` |
| `{from}`, `{until}` | Horários, formatados (§0 "Formatos") | `14h`, `18h` | `rules.checkIn` / `rules.checkOut` |
| `{m2}` | Área em m² | `44` | `floorSizeM2` |
| `{year}` | Ano corrente | `2026` | build |
| `{privacyUrl}` | URL absoluta da política no idioma da página | `/es/privacidade/` | rota |
| `{current}`, `{total}` | Posição em galeria | `3`, `12` | galeria |
| `{language}` | Nome do idioma no próprio idioma | `English` | tabela de idiomas |

### Plural
Chaves com sufixo `_one` / `_other` têm duas formas (regra do `Intl.PluralRules`: 1 = `one`, o resto = `other`; 0 usa `other`). O formato do arquivo (i18next, ICU etc.) é decisão da T23; o conteúdo vale para qualquer um.

### Formatos de data e hora (para `{checkIn}`, `{checkOut}`, `{from}`, `{until}`)

| | pt | en | es |
|---|---|---|---|
| Data | `12/11/2026` (dd/mm/aaaa) | `12 Nov 2026` (por extenso, sem ambiguidade com mm/dd) | `12/11/2026` (dd/mm/aaaa) |
| Hora cheia | `14h` | `2 pm` | `14 h` |
| Hora com minutos | `10h30` | `10:30 am` | `10:30 h` |

A mensagem do WhatsApp usa sempre estes formatos fixos, independentemente da configuração do navegador, para quem atende ler a mesma data que o visitante escolheu. Os campos `<input type="date">` mostram a data no formato do navegador.

### Número do WhatsApp
- Exibido (3 idiomas, igual): **`+55 48 99944-2015`**
- Link: `https://wa.me/5548999442015?text={mensagem URL-encoded}`
- Override por imóvel: `property.contact.whatsapp ?? site.contact.whatsapp` (data-model §7).
- Nunca aparece horário nem tempo de resposta perto do número ou do botão.

---

## 1. Navegação e estrutura

### 1.1 Cabeçalho

| Chave | pt | en | es |
|---|---|---|---|
| `nav.home` | Início | Home | Inicio |
| `nav.neighborhood` | Jurerê | Jurerê | Jurerê |
| `nav.properties` | Apartamentos | Apartments | Deptos |
| `nav.destinations` | Destinos | Destinations | Destinos |
| `nav.menu.open` | Abrir menu | Open menu | Abrir menú |
| `nav.menu.close` | Fechar menu | Close menu | Cerrar menú |
| `nav.main.aria` | Navegação principal | Main navigation | Navegación principal |
| `nav.skipToContent` | Pular para o conteúdo | Skip to content | Saltar al contenido |
| `nav.logo.aria` | Acácia, página inicial | Acácia, home page | Acácia, página de inicio |

Notas: `nav.neighborhood` é o link do bairro enquanto houver só um; quando houver mais, vira o menu `nav.destinations` (page-map §1). `nav.properties` é a âncora da lista de aptos na home e é opcional.

### 1.2 Seletor de idioma

| Chave | pt | en | es |
|---|---|---|---|
| `lang.label` | Idioma | Language | Idioma |
| `lang.switch.aria` | Mudar o idioma do site | Change the site language | Cambiar el idioma del sitio |
| `lang.name.pt` | Português | Português | Português |
| `lang.name.en` | English | English | English |
| `lang.name.es` | Español | Español | Español |
| `lang.short.pt` | PT | PT | PT |
| `lang.short.en` | EN | EN | EN |
| `lang.short.es` | ES | ES | ES |
| `lang.current.aria` | Idioma atual: {language} | Current language: {language} | Idioma actual: {language} |
| `lang.switchTo.aria` | Ver esta página em {language} | View this page in {language} | Ver esta página en {language} |

Os nomes dos idiomas ficam **sempre no próprio idioma** (não traduzir), e o seletor leva à página equivalente, não à home (page-map §1).

### 1.3 Rodapé

| Chave | pt | en | es |
|---|---|---|---|
| `footer.tagline` | Dois apartamentos a 50 m da praia, em Jurerê, Florianópolis. | Two apartments 50 m from the beach, in Jurerê, Florianópolis. | Dos deptos a 50 m de la playa, en Jurerê, Florianópolis. |
| `footer.nav.heading` | Navegar | Explore | Explorar |
| `footer.contact.heading` | Contato | Contact | Contacto |
| `footer.contact.whatsapp` | WhatsApp: {phone} | WhatsApp: {phone} | WhatsApp: {phone} |
| `footer.address.label` | Endereço | Address | Dirección |
| `footer.address.value` | Rua Acácio Melo, 70 · Jurerê, Florianópolis/SC | Rua Acácio Melo, 70 · Jurerê, Florianópolis/SC | Rua Acácio Melo, 70 · Jurerê, Florianópolis/SC |
| `footer.privacy` | Política de privacidade | Privacy policy | Política de privacidad |
| `footer.cookiePreferences` | Preferências de cookies | Cookie preferences | Preferencias de cookies |
| `footer.language.heading` | Idioma | Language | Idioma |
| `footer.rights` | © {year} Acácia | © {year} Acácia | © {year} Acácia |
| `footer.backToTop` | Voltar ao topo | Back to top | Volver arriba |

`{phone}` = `+55 48 99944-2015`. O endereço público não leva o número do apto (data-model §4.5, `showUnitPublicly: false`). Os textos de "Preferências de cookies" são os do privacy.md §5.

### 1.4 Breadcrumbs

| Chave | pt | en | es |
|---|---|---|---|
| `breadcrumb.aria` | Você está aqui | You are here | Estás acá |
| `breadcrumb.home` | Início | Home | Inicio |
| `breadcrumb.neighborhood` | Jurerê | Jurerê | Jurerê |
| `breadcrumb.privacy` | Privacidade | Privacy | Privacidad |
| `breadcrumb.notFound` | Página não encontrada | Page not found | Página no encontrada |

O último item (o imóvel) usa `{name}` do próprio imóvel e não é link. O `BreadcrumbList` do schema usa os mesmos textos.

---

## 2. Botão fixo, CTAs e WhatsApp (rótulos)

Regra: nada de horário, tempo de resposta ou "reserve já". O CTA diz o que a pessoa vai fazer (perguntar pelas datas) e o que acontece depois (abre o WhatsApp com a mensagem pronta).

| Chave | pt | en | es |
|---|---|---|---|
| `whatsapp.brand` | WhatsApp | WhatsApp | WhatsApp |
| `whatsapp.fab.label` | WhatsApp | WhatsApp | WhatsApp |
| `whatsapp.fab.aria` | Falar com a Acácia no WhatsApp | Chat with Acácia on WhatsApp | Escribirle a Acácia por WhatsApp |
| `whatsapp.fab.aria.property` | Perguntar sobre o {name} no WhatsApp | Ask about {name} on WhatsApp | Consultar por el {name} en WhatsApp |
| `whatsapp.cta.generic` | Chamar no WhatsApp | Message us on WhatsApp | Escribinos por WhatsApp |
| `whatsapp.cta.property` | Consultar minhas datas no WhatsApp | Check my dates on WhatsApp | Consultar mis fechas por WhatsApp |
| `whatsapp.cta.neighborhood` | Perguntar sobre os apartamentos | Ask about the apartments | Consultar por los deptos |
| `whatsapp.cta.card` | Perguntar pelo {name} | Ask about {name} | Consultar por el {name} |
| `whatsapp.cta.opensNote` | Abre o WhatsApp com a mensagem pronta. | Opens WhatsApp with the message ready. | Abre WhatsApp con el mensaje listo. |
| `whatsapp.cta.negotiateNote` | Valores, pagamento e cancelamento: combinamos pelo WhatsApp. | Prices, payment and cancellation: we sort them out on WhatsApp. | Precios, pago y cancelación: lo arreglamos por WhatsApp. |
| `whatsapp.number.label` | Número do WhatsApp | WhatsApp number | Número de WhatsApp |
| `whatsapp.number.display` | +55 48 99944-2015 | +55 48 99944-2015 | +55 48 99944-2015 |
| `whatsapp.link.newTab` | abre o WhatsApp em outra aba | opens WhatsApp in a new tab | abre WhatsApp en otra pestaña |

### Faixa de CTA (fim das páginas, fundo Restinga)

| Chave | pt | en | es |
|---|---|---|---|
| `cta.band.title` | Quer saber se tem vaga nas suas datas? | Free on your dates? | ¿Querés saber si hay lugar en tus fechas? |
| `cta.band.text` | Mande as datas e quantas pessoas. | Send us your dates and how many of you. | Mandanos las fechas y cuántos son. |
| `cta.band.property.title` | O {name} está livre nas suas datas? | Is {name} free on your dates? | ¿El {name} está libre en tus fechas? |
| `cta.band.property.text` | Mande as datas e quantas pessoas. | Send us your dates and how many of you. | Mandanos las fechas y cuántos son. |

### Cartões da home e do bairro

| Chave | pt | en | es |
|---|---|---|---|
| `card.viewProperty` | Ver o {name} | See {name} | Ver el {name} |
| `card.upTo` | Até {count} pessoas | Up to {count} guests | Hasta {count} personas |
| `card.minNights_other` | Mínimo de {count} noites | {count}-night minimum | Mínimo {count} noches |
| `card.minNights_one` | Mínimo de {count} noite | {count}-night minimum | Mínimo {count} noche |

---

## 3. Rótulos de detalhes do imóvel

### 3.1 Títulos de seção

| Chave | pt | en | es |
|---|---|---|---|
| `property.label` | Apto {number} | Apt {number} | Depto {number} |
| `property.section.details` | O apartamento | The apartment | El depto |
| `property.section.amenities` | Comodidades | Amenities | Comodidades |
| `property.section.beds` | Camas | Beds | Camas |
| `property.section.rules` | Antes de reservar | Before you book | Antes de reservar |
| `property.section.location` | Onde fica | Where it is | Dónde queda |
| `property.section.gallery` | Fotos | Photos | Fotos |
| `ruler.gate` | Portão | Gate | Portón |
| `ruler.distance` | {meters} m | {meters} m | {meters} m |
| `ruler.sand` | Areia | Sand | Arena |
| `ruler.aria` | Do portão à areia: {meters} m | From the gate to the sand: {meters} m | Del portón a la arena: {meters} m |
| `property.beachDistance` | a {meters} m da praia | {meters} m from the beach | a {meters} m de la playa |

`ruler.*`: a régua dos 50 m da marca (brand.md §5). Só entra com número confirmado.

### 3.2 Capacidade, quartos, camas, banheiro

| Chave | pt | en | es |
|---|---|---|---|
| `detail.capacity.label` | Capacidade | Sleeps | Capacidad |
| `detail.capacity.value_one` | {count} pessoa | {count} guest | {count} persona |
| `detail.capacity.value_other` | Até {count} pessoas | Up to {count} guests | Hasta {count} personas |
| `detail.bedrooms.label` | Quartos | Bedrooms | Dormitorios |
| `detail.bedrooms.value_one` | {count} quarto | {count} bedroom | {count} dormitorio |
| `detail.bedrooms.value_other` | {count} quartos | {count} bedrooms | {count} dormitorios |
| `detail.bedrooms.studio` | Studio | Studio | Monoambiente |
| `detail.beds.label` | Camas | Beds | Camas |
| `detail.bathrooms.label` | Banheiro | Bathroom | Baño |
| `detail.bathrooms.value_one` | {count} banheiro | {count} bathroom | {count} baño |
| `detail.bathrooms.value_other` | {count} banheiros | {count} bathrooms | {count} baños |
| `detail.size.label` | Área | Size | Superficie |
| `detail.size.value` | {m2} m² | {m2} m² | {m2} m² |
| `detail.floor.label` | Andar | Floor | Piso |
| `detail.floor.ground` | Térreo | Ground floor | Planta baja |
| `detail.floor.upper` | Andar de cima | Upper floor | Planta alta |
| `detail.view.label` | Vista | View | Vista |
| `detail.view.sea` | Mar | Sea | Mar |
| `detail.view.mountain` | Morros | Hills | Cerros |
| `detail.view.garden` | Jardim | Garden | Jardín |
| `detail.view.courtyard` | Pátio | Courtyard | Patio |
| `detail.view.street` | Rua | Street | Calle |

Os nomes das camas são os da lista `BedType` (data-model §4.5). A soma "1 cama de casal + 1 sofá-cama" é montada juntando os itens com " + ".

| Chave | pt | en | es |
|---|---|---|---|
| `bed.double_one` | {count} cama de casal | {count} double bed | {count} cama matrimonial |
| `bed.double_other` | {count} camas de casal | {count} double beds | {count} camas matrimoniales |
| `bed.queen_one` | {count} cama queen | {count} queen bed | {count} cama queen |
| `bed.queen_other` | {count} camas queen | {count} queen beds | {count} camas queen |
| `bed.king_one` | {count} cama king | {count} king bed | {count} cama king |
| `bed.king_other` | {count} camas king | {count} king beds | {count} camas king |
| `bed.single_one` | {count} cama de solteiro | {count} single bed | {count} cama individual |
| `bed.single_other` | {count} camas de solteiro | {count} single beds | {count} camas individuales |
| `bed.sofaBed_one` | {count} sofá-cama | {count} sofa bed | {count} sofá cama |
| `bed.sofaBed_other` | {count} sofás-cama | {count} sofa beds | {count} sofás cama |
| `bed.bunkBed_one` | {count} beliche | {count} bunk bed | {count} cucheta |
| `bed.bunkBed_other` | {count} beliches | {count} bunk beds | {count} cuchetas |
| `bed.room.bedroom` | No quarto | In the bedroom | En el dormitorio |
| `bed.room.livingRoom` | Na sala | In the living room | En el living |
| `bed.room.other` | Em outro ambiente | Elsewhere | En otro ambiente |

### 3.3 Check-in, check-out, mínimo de noites e regras

| Chave | pt | en | es |
|---|---|---|---|
| `rules.checkIn.label` | Check-in | Check-in | Check-in |
| `rules.checkIn.range` | das {from} às {until} | {from} to {until} | de {from} a {until} |
| `rules.checkIn.from` | a partir das {from} | from {from} | desde las {from} |
| `rules.checkOut.label` | Check-out | Check-out | Check-out |
| `rules.checkOut.until` | até as {until} | by {until} | hasta las {until} |
| `rules.selfCheckIn` | Self check-in: mandamos as instruções pelo WhatsApp. | Self check-in: we send the instructions on WhatsApp. | Self check-in: te mandamos las instrucciones por WhatsApp. |
| `rules.arrivalNote` | Avise o horário de chegada pelo WhatsApp. | Tell us your arrival time on WhatsApp. | Avisanos por WhatsApp a qué hora llegás. |
| `rules.minNights.label` | Mínimo de noites | Minimum stay | Mínimo de noches |
| `rules.minNights.value_one` | {count} noite | {count} night | {count} noche |
| `rules.minNights.value_other` | {count} noites, o ano todo | {count} nights, all year | {count} noches, todo el año |
| `rules.smoking.no` | Aqui não se fuma, em nenhum cômodo. | No smoking anywhere in the apartment. | No se puede fumar en ningún ambiente. |
| `rules.smoking.yes` | Pode fumar. | Smoking allowed. | Se puede fumar. |
| `rules.pets.no` | Não aceitamos pets. | No pets. | No se aceptan mascotas. |
| `rules.pets.yes` | Aceitamos pets. | Pets welcome. | Se aceptan mascotas. |
| `rules.children.yes` | Crianças são bem-vindas. | Children are welcome. | Los chicos son bienvenidos. |
| `rules.children.no` | Não é indicado para crianças. | Not suitable for children. | No es apto para chicos. |
| `rules.crib.yes` | Berço disponível. | Crib available. | Cuna disponible. |
| `rules.crib.no` | Não temos berço. | No crib available. | No tenemos cuna. |
| `rules.payment` | Valores, pagamento e cancelamento: combinamos pelo WhatsApp. | Prices, payment and cancellation: we sort them out on WhatsApp. | Precios, pago y cancelación: lo arreglamos por WhatsApp. |

Notas:
- `rules.minNights.value_*` mostra o "o ano todo" porque a estadia mínima é de 4 noites o ano todo (CLAUDE.md). Se um imóvel futuro tiver mínimo sazonal, esta chave muda (ver "Notas para outras tarefas").
- `rules.payment` é o único texto sobre pagamento no site; não há política escrita (CLAUDE.md).
- Estas chaves vêm dos campos estruturados; só `rules.notes` é texto livre do arquivo do imóvel.

### 3.4 Galeria

| Chave | pt | en | es |
|---|---|---|---|
| `gallery.open` | Ver foto em tela cheia | View photo full screen | Ver foto en pantalla completa |
| `gallery.close` | Fechar | Close | Cerrar |
| `gallery.previous` | Foto anterior | Previous photo | Foto anterior |
| `gallery.next` | Próxima foto | Next photo | Foto siguiente |
| `gallery.counter` | Foto {current} de {total} | Photo {current} of {total} | Foto {current} de {total} |

---

## 4. Comodidades (`amenity.*`)

Chaves = `AmenityKey` do data-model §6, uma linha por item. Esta tabela **substitui** os rascunhos de rótulos daquele documento (a V51 testa a cobertura nos 3 idiomas). Mudanças em relação ao rascunho: ver "Notas para outras tarefas".

### 4.1 Rótulos

| Chave | pt | en | es |
|---|---|---|---|
| `amenity.wifi` | Wi-Fi grátis | Free Wi-Fi | Wi-Fi gratis |
| `amenity.freeParking` | Garagem grátis | Free parking | Cochera sin cargo |
| `amenity.airConditioning` | Ar-condicionado split | Split air conditioning | Aire acondicionado split |
| `amenity.heating` | Aquecimento (split quente/frio) | Heating (reverse-cycle split) | Calefacción (split frío/calor) |
| `amenity.fan` | Ventilador | Fan | Ventilador |
| `amenity.kitchen` | Cozinha completa | Full kitchen | Cocina completa |
| `amenity.ovenStove` | Fogão e forno | Stovetop and oven | Anafe y horno |
| `amenity.microwave` | Micro-ondas | Microwave | Microondas |
| `amenity.refrigerator` | Geladeira | Fridge | Heladera |
| `amenity.minibar` | Frigobar | Minibar | Frigobar |
| `amenity.coffeeMaker` | Cafeteira e chaleira | Coffee maker and kettle | Cafetera y pava eléctrica |
| `amenity.kitchenware` | Louças e utensílios | Dishes and cookware | Vajilla y utensilios |
| `amenity.diningTable` | Mesa de jantar | Dining table | Mesa de comedor |
| `amenity.tv` | Smart TV de tela plana | Smart TV (flat-screen) | Smart TV de pantalla plana |
| `amenity.streaming` | Streaming (tipo Netflix) | Streaming services | Streaming (tipo Netflix) |
| `amenity.desk` | Mesa para trabalhar | Work desk | Mesa para trabajar |
| `amenity.bedLinen` | Roupa de cama | Bed linen | Ropa de cama |
| `amenity.towels` | Toalhas | Towels | Toallas |
| `amenity.hairDryer` | Secador de cabelo | Hair dryer | Secador de pelo |
| `amenity.wardrobe` | Guarda-roupa | Wardrobe | Placard |
| `amenity.iron` | Ferro de passar | Iron | Plancha |
| `amenity.ironingBoard` | Tábua de passar | Ironing board | Tabla de planchar |
| `amenity.washer` | Máquina de lavar roupa | Washing machine | Lavarropas |
| `amenity.dryingRack` | Varal de chão | Drying rack | Tendedero |
| `amenity.balcony` | Varanda | Balcony | Balcón |
| `amenity.patio` | Pátio | Patio | Patio |
| `amenity.outdoorFurniture` | Mesa e cadeiras na varanda | Balcony table and chairs | Mesa y sillas en el balcón |
| `amenity.grill` | Churrasqueira | Barbecue grill | Parrilla |
| `amenity.beachGear` | Cadeiras e guarda-sol de praia | Beach chairs and umbrella | Reposeras y sombrilla de playa |
| `amenity.privateEntrance` | Entrada independente | Private entrance | Entrada independiente |
| `amenity.wheelchairAccessible` | Acessível para cadeira de rodas | Wheelchair accessible | Accesible en silla de ruedas |
| `amenity.stairsOnly` | Acesso por escada, sem elevador | Stairs only, no elevator | Acceso por escalera, sin ascensor |
| `amenity.elevator` | Elevador | Elevator | Ascensor |
| `amenity.fireExtinguisher` | Extintor de incêndio | Fire extinguisher | Matafuegos |
| `amenity.pool` | Piscina | Pool | Pileta |
| `amenity.stepFree` | Sem escada da rua até dentro | Step-free from the street to the door | Sin escalones desde la calle hasta adentro |

Observações de tradução:
- **es**: "cochera" (não "garaje" nem "estacionamiento"), "heladera", "lavarropas", "anafe", "pava eléctrica", "placard", "reposeras", "matafuegos", "pileta", "parrilla", "balcón" são rioplatenses. "Cuna", "cucheta", "chicos" idem.
- **`amenity.tv`**: a TV é smart (confirmado pelo usuário); rótulo "Smart TV" nos 3 idiomas.
- **es `amenity.freeParking`**: "sin cargo" lê melhor que "gratis" para cochera e combina com "Cochera propia, sin cargo" do brand.md.
- **`amenity.wheelchairAccessible`**: existe na lista, mas **não está confirmado** para nenhum apto; só usar se a família confirmar. Para o apto 6 o texto aprovado é "sem escada" (ver `amenity.stepFree`).
- **`amenity.wifi`**: nunca Mbps nem "rápido". **`amenity.desk`** acompanha o Wi-Fi no texto de trabalho remoto.
- **`amenity.heating`**: o aquecimento é o próprio ar split quente/frio (CLAUDE.md).

### 4.2 Grupos (categorias da §6 do data-model)

| Chave | pt | en | es |
|---|---|---|---|
| `amenity.group.essentials` | Essenciais | The basics | Lo básico |
| `amenity.group.kitchen` | Cozinha | Kitchen | Cocina |
| `amenity.group.leisure` | Lazer | Leisure | Entretenimiento |
| `amenity.group.work` | Trabalho | Work | Trabajo |
| `amenity.group.bedBath` | Quarto e banho | Bedroom and bathroom | Dormitorio y baño |
| `amenity.group.services` | Serviços | Services | Servicios |
| `amenity.group.outdoor` | Área externa | Outdoors | Espacios al aire libre |
| `amenity.group.beach` | Praia | Beach | Playa |
| `amenity.group.access` | Acesso | Access | Acceso |
| `amenity.group.safety` | Segurança | Safety | Seguridad |

---

## 5. Páginas de erro e avisos

### 5.1 404 (uma por idioma)

Título da página (`<title>`) e H1; a página é `noindex`, fora do sitemap e do hreflang. Links para home, bairro e aptos, e o botão de WhatsApp (page-map §8).

| Chave | pt | en | es |
|---|---|---|---|
| `notFound.title` | Página não encontrada | Page not found | Página no encontrada |
| `notFound.meta.title` | Página não encontrada | Page not found | Página no encontrada |
| `notFound.heading` | Não achamos essa página | We couldn't find that page | No encontramos esa página |
| `notFound.text` | O endereço pode ter mudado ou ter um erro de digitação. Por aqui você chega aonde queria: | The address may have changed or have a typo. From here you can get where you were going: | La dirección puede haber cambiado o tener un error de tipeo. Desde acá llegás adonde querías: |
| `notFound.link.home` | Voltar ao início | Back to the home page | Volver al inicio |
| `notFound.link.neighborhood` | Conhecer Jurerê | Explore Jurerê | Conocer Jurerê |
| `notFound.link.property` | Ver o {name} | See {name} | Ver el {name} |
| `notFound.cta` | Ou pergunte direto no WhatsApp | Or just ask us on WhatsApp | O consultanos directo por WhatsApp |

### 5.2 Banner de sugestão de idioma

Aparece só quando o idioma do navegador (`navigator.language`) difere do da página e é um dos nossos três. **Não redireciona** (decisão T09). O texto aparece **no idioma sugerido**, que é o que o visitante lê melhor. Ex.: numa página em pt, um navegador em espanhol vê o banner `langSuggest.es.*`.

Textos por idioma sugerido (cada texto já está no idioma que ele sugere):

| Chave | Texto |
|---|---|
| `langSuggest.pt.message` | Este site também está em português. |
| `langSuggest.pt.accept` | Ver em português |
| `langSuggest.pt.dismiss` | Agora não |
| `langSuggest.en.message` | This site is also available in English. |
| `langSuggest.en.accept` | View in English |
| `langSuggest.en.dismiss` | Not now |
| `langSuggest.es.message` | ¿Querés ver el sitio en español? |
| `langSuggest.es.accept` | Ver en español |
| `langSuggest.es.dismiss` | Ahora no |

| Chave | pt | en | es |
|---|---|---|---|
| `langSuggest.aria` | Sugestão de idioma | Language suggestion | Sugerencia de idioma |
| `langSuggest.close.aria` | Fechar a sugestão de idioma | Close the language suggestion | Cerrar la sugerencia de idioma |

Regras:
- O banner é um texto discreto no topo ou no rodapé do conteúdo, sem bloquear a página e sem modal.
- "Ver em…" leva à **página equivalente** no outro idioma (mesmo mapa do seletor).
- Se o visitante dispensar, lembrar **só durante a sessão** (`sessionStorage`). Isso evita um item de armazenamento novo que a política de privacidade teria que listar (a tabela de cookies do privacy.md §4 só tem `cookie_consent`).
- O banner de idioma e o de cookies não aparecem ao mesmo tempo: primeiro o de cookies (privacy.md §5), o de idioma depois que o de cookies for resolvido.

---

## 6. Aviso de cookies e "Preferências de cookies"

Reaproveitado **palavra por palavra** do [privacy.md §5](privacy.md) (T20). Regras da T20: "Aceitar" e "Recusar" com mesmo formato e destaque, lado a lado, nada pré-marcado, GA4 só carrega depois do "Aceitar", link do rodapé reabre o aviso.

| Chave | pt | en | es |
|---|---|---|---|
| `cookies.title` | Cookies | Cookies | Cookies |
| `cookies.body` | Usamos um cookie necessário para lembrar a sua escolha. Com a sua permissão, também usamos o Google Analytics para saber quais páginas e imóveis interessam. Recusar não muda nada no site, e você pode mudar de ideia quando quiser em "Preferências de cookies", no rodapé. | We use one necessary cookie to remember your choice. If you allow it, we also use Google Analytics to see which pages and apartments people look at. Declining changes nothing on the site, and you can change your mind any time in "Cookie preferences" in the footer. | Usamos una cookie necesaria para recordar tu elección. Si nos das permiso, también usamos Google Analytics para saber qué páginas y departamentos interesan. Rechazar no cambia nada en el sitio, y podés cambiar de opinión cuando quieras en "Preferencias de cookies", en el pie de página. |
| `cookies.privacyLink` | Política de privacidade | Privacy policy | Política de privacidad |
| `cookies.accept` | Aceitar | Accept | Aceptar |
| `cookies.decline` | Recusar | Decline | Rechazar |
| `cookies.region.aria` | Aviso de cookies | Cookie notice | Aviso de cookies |
| `cookies.preferences` | Preferências de cookies | Cookie preferences | Preferencias de cookies |

Notas:
- `cookies.body` é exatamente o texto do privacy.md. O es mantém "departamentos" (o texto da T20), enquanto a UI usa "deptos"; é uma palavra por extenso num texto jurídico-informativo, e a T20 já está aprovada nesse ponto. Se o usuário preferir "deptos" aqui também, mudar nos dois arquivos.
- `cookies.preferences` é o mesmo texto de `footer.cookiePreferences` (§1.3); no código, uma chave só.
- O link `cookies.privacyLink` aponta para `{privacyUrl}` do idioma da página.
- Quando o aviso é reaberto pelo rodapé, mostra o mesmo texto; o botão da escolha atual não vem pré-selecionado.

---

## 7. Mensagens pré-preenchidas do WhatsApp

### 7.1 Como a mensagem é montada

Mensagem = **abertura do contexto** + espaço + **pergunta**. A abertura diz de onde a pessoa veio (e, no imóvel, cita nome e código, porque o WhatsApp não passa UTM; phase-1 §4). A pergunta já pede as datas e o número de pessoas.

Há **duas versões da pergunta**:
- **em branco** (`whatsapp.ask.blank`): botão fixo e CTAs sem formulário. A pessoa completa os espaços `__/__` e `__` no próprio WhatsApp.
- **preenchida** (`whatsapp.ask.filled_*`): o mini formulário (§8) preenche `{checkIn}`, `{checkOut}` e `{guests}`.

### 7.2 Chaves

| Chave | pt | en | es |
|---|---|---|---|
| `whatsapp.intro.home` | Olá! Vi o site da Acácia e quero saber dos apartamentos em Jurerê. | Hi! I saw the Acácia website and I'd like to ask about the apartments in Jurerê. | ¡Hola! Vi el sitio de Acácia y quiero consultar por los deptos en Jurerê. |
| `whatsapp.intro.property` | Olá! Vi o {name} (código {code}) no site da Acácia. | Hi! I saw {name} (code {code}) on the Acácia website. | ¡Hola! Vi el {name} (código {code}) en el sitio de Acácia. |
| `whatsapp.intro.neighborhood` | Olá! Estava lendo o guia de Jurerê no site da Acácia e quero saber dos apartamentos. | Hi! I was reading the Jurerê guide on the Acácia website and I'd like to ask about the apartments. | ¡Hola! Estaba leyendo la guía de Jurerê en el sitio de Acácia y quiero consultar por los deptos. |
| `whatsapp.intro.generic` | Olá! Vim pelo site da Acácia e quero saber dos apartamentos. | Hi! I came through the Acácia website and I'd like to ask about the apartments. | ¡Hola! Vengo del sitio de Acácia y quiero consultar por los deptos. |
| `whatsapp.ask.blank` | Tem vaga de __/__ a __/__ para __ pessoas? | Are you free from __/__ to __/__ for __ guests? | ¿Tienen lugar del __/__ al __/__ para __ personas? |
| `whatsapp.ask.filled_one` | Tem vaga de {checkIn} a {checkOut} para {guests} pessoa? | Are you free from {checkIn} to {checkOut} for {guests} guest? | ¿Tienen lugar del {checkIn} al {checkOut} para {guests} persona? |
| `whatsapp.ask.filled_other` | Tem vaga de {checkIn} a {checkOut} para {guests} pessoas? | Are you free from {checkIn} to {checkOut} for {guests} guests? | ¿Tienen lugar del {checkIn} al {checkOut} para {guests} personas? |

`generic` é o fallback para páginas sem contexto (404, privacidade).

### 7.3 Mensagens montadas (como o visitante vê)

Cada linha é `intro` + espaço + `ask`. Exemplos com `{name}` = Apto 4 / Apt 4 / Depto 4 e `{code}` = `acacia-4`.

#### Imóvel (as 3 mensagens principais), versão em branco

- **pt**: `Olá! Vi o Apto 4 (código acacia-4) no site da Acácia. Tem vaga de __/__ a __/__ para __ pessoas?`
- **en**: `Hi! I saw Apt 4 (code acacia-4) on the Acácia website. Are you free from __/__ to __/__ for __ guests?`
- **es**: `¡Hola! Vi el Depto 4 (código acacia-4) en el sitio de Acácia. ¿Tienen lugar del __/__ al __/__ para __ personas?`

#### Imóvel, versão preenchida pelo mini formulário (3 pessoas, 12 a 16 de novembro)

- **pt**: `Olá! Vi o Apto 4 (código acacia-4) no site da Acácia. Tem vaga de 12/11/2026 a 16/11/2026 para 3 pessoas?`
- **en**: `Hi! I saw Apt 4 (code acacia-4) on the Acácia website. Are you free from 12 Nov 2026 to 16 Nov 2026 for 3 guests?`
- **es**: `¡Hola! Vi el Depto 4 (código acacia-4) en el sitio de Acácia. ¿Tienen lugar del 12/11/2026 al 16/11/2026 para 3 personas?`

#### Home, em branco

- **pt**: `Olá! Vi o site da Acácia e quero saber dos apartamentos em Jurerê. Tem vaga de __/__ a __/__ para __ pessoas?`
- **en**: `Hi! I saw the Acácia website and I'd like to ask about the apartments in Jurerê. Are you free from __/__ to __/__ for __ guests?`
- **es**: `¡Hola! Vi el sitio de Acácia y quiero consultar por los deptos en Jurerê. ¿Tienen lugar del __/__ al __/__ para __ personas?`

#### Bairro, em branco

- **pt**: `Olá! Estava lendo o guia de Jurerê no site da Acácia e quero saber dos apartamentos. Tem vaga de __/__ a __/__ para __ pessoas?`
- **en**: `Hi! I was reading the Jurerê guide on the Acácia website and I'd like to ask about the apartments. Are you free from __/__ to __/__ for __ guests?`
- **es**: `¡Hola! Estaba leyendo la guía de Jurerê en el sitio de Acácia y quiero consultar por los deptos. ¿Tienen lugar del __/__ al __/__ para __ personas?`

### 7.4 Regras de montagem (para a T31 e os testes)

1. A mensagem sai **no idioma da página**, mesmo que o navegador esteja em outro idioma.
2. Para URL: `encodeURIComponent` na mensagem inteira. Os acentos, `¡`, `¿`, `(`, `)` e `/` passam pelo encode. Os `__` ficam como `__`.
3. `{name}` vem de `property.label` com `{number}`; `{code}` vem do `identifier`. Nenhum dos dois pode ficar vazio: se faltar, o build falha (teste de contrato).
4. Sem `{name}`/`{code}` em home, bairro e genérico.
5. O mini formulário só gera a versão preenchida com os 3 campos válidos (§8). Sem formulário, vale a versão em branco.
6. Número do WhatsApp: ver §0. O evento `whatsapp_click` do GA4 leva `property_id` = `{code}` (ou "home"/"neighborhood") e `language`; o texto da mensagem não entra no evento.
7. Os testes (T31) comparam a URL final byte a byte com os exemplos de 7.3 (substituindo os placeholders).

---

## 8. Mini formulário (datas + hóspedes)

Aparece **só nas páginas dos aptos**; a home tem apenas o CTA direto (versão em branco, §7). **Não é reserva** nem consulta de calendário: só monta a mensagem. Sem preço e sem disponibilidade (CLAUDE.md). `{minNights}` e `{maxGuests}` vêm do imóvel (na home, o menor mínimo e a maior capacidade entre os aptos).

### 8.1 Textos

| Chave | pt | en | es |
|---|---|---|---|
| `form.title` | Confira as suas datas | Check your dates | Consultá tus fechas |
| `form.intro` | Escolha as datas e quantas pessoas. A mensagem abre pronta no WhatsApp, e você pode editar antes de enviar. | Pick your dates and how many of you. The message opens ready in WhatsApp, and you can edit it before sending. | Elegí las fechas y cuántos son. El mensaje se abre listo en WhatsApp y podés editarlo antes de enviarlo. |
| `form.checkIn.label` | Entrada | Check-in | Entrada |
| `form.checkOut.label` | Saída | Check-out | Salida |
| `form.guests.label` | Pessoas | Guests | Personas |
| `form.guests.option_one` | {count} pessoa | {count} guest | {count} persona |
| `form.guests.option_other` | {count} pessoas | {count} guests | {count} personas |
| `form.guests.placeholder` | Escolha | Choose | Elegí |
| `form.hint.minNights` | Estadia mínima: {minNights} noites. | Minimum stay: {minNights} nights. | Estadía mínima: {minNights} noches. |
| `form.hint.maxGuests` | Até {maxGuests} pessoas. | Up to {maxGuests} guests. | Hasta {maxGuests} personas. |
| `form.summary_one` | {nights} noite | {nights} night | {nights} noche |
| `form.summary_other` | {nights} noites | {nights} nights | {nights} noches |
| `form.submit` | Enviar pelo WhatsApp | Send on WhatsApp | Enviar por WhatsApp |
| `form.errors.summary` | Confira os campos marcados. | Please check the highlighted fields. | Revisá los campos marcados. |

O campo "Pessoas" é um `<select>` de 1 até `{maxGuests}` (data-model: `capacity.maxGuests`), então `guests.max` só dispara se alguém forçar um valor fora da lista.

### 8.2 Validação e mensagens de erro

A cor dos erros é `#9B2C1F` (6,64:1 sobre Concha, aprovada na T08), **sempre acompanhada da mensagem em texto**, nunca só pela cor (borda ou fundo sozinhos não valem). A validação roda ao tentar enviar (e refaz ao mudar o campo). Cada erro aparece junto do campo, em texto (não só cor), ligado por `aria-describedby`, e o foco vai para o primeiro campo com erro. Datas em `<input type="date">`. Um erro por campo, na ordem da tabela.

| Chave | Regra | pt | en | es |
|---|---|---|---|---|
| `form.errors.checkIn.required` | Entrada vazia | Escolha a data de entrada. | Pick a check-in date. | Elegí la fecha de entrada. |
| `form.errors.checkIn.invalid` | Data inexistente ou ilegível | Essa data não é válida. | That date isn't valid. | Esa fecha no es válida. |
| `form.errors.checkIn.past` | Entrada antes de hoje | A data de entrada já passou. | The check-in date has already passed. | La fecha de entrada ya pasó. |
| `form.errors.checkOut.required` | Saída vazia | Escolha a data de saída. | Pick a check-out date. | Elegí la fecha de salida. |
| `form.errors.checkOut.invalid` | Data inexistente ou ilegível | Essa data não é válida. | That date isn't valid. | Esa fecha no es válida. |
| `form.errors.checkOut.beforeCheckIn` | Saída ≤ entrada | A saída precisa ser depois da entrada. | Check-out must be after check-in. | La salida tiene que ser después de la entrada. |
| `form.errors.checkOut.minNights` | Noites < `minNights` | A estadia mínima é de {minNights} noites. A primeira saída possível é {earliest}. | The minimum stay is {minNights} nights. The earliest check-out is {earliest}. | La estadía mínima es de {minNights} noches. La primera salida posible es el {earliest}. |
| `form.errors.guests.required` | Pessoas vazio | Diga quantas pessoas vão ficar. | Tell us how many guests are staying. | Decinos cuántos van a ser. |
| `form.errors.guests.min` | < 1 | Informe pelo menos 1 pessoa. | Enter at least 1 guest. | Indicá al menos 1 persona. |
| `form.errors.guests.max` | > `maxGuests` | Cada apartamento recebe até {maxGuests} pessoas. | Each apartment sleeps up to {maxGuests} guests. | Cada depto recibe hasta {maxGuests} personas. |

Regras:
- `minNights` só é checada quando entrada e saída são válidas e saída > entrada.
- `{earliest}` = entrada + `minNights` dias, formatada como em §0.
- Nenhum erro culpa a pessoa; todos dizem o que fazer.
- Com o formulário limpo, os CTAs normais (versão em branco) continuam funcionando.
- A noite mínima é regra do imóvel (4 noites, o ano todo). O formulário não verifica disponibilidade nem preço.

---

## 9. Titles e descriptions (home, bairro, privacidade)

Os dos aptos ficam com a T18. Home e bairro são os da [T12](../plan/keywords.md) (§6.1, §6.2), copiados sem alteração (já validados: title ≤ 60, description ≤ 155). A marca não entra no title por enquanto (T12 §7). O de privacidade usa os títulos da T12 §6.5 e uma description nova.

Contagem de caracteres no fim desta seção.

### 9.1 Home (`home.seo.*`)

| Chave | pt | en | es |
|---|---|---|---|
| `home.seo.title` | Aluguel de temporada em Jurerê, a 50 m da praia | Jurerê Vacation Apartments, 50 m from the Beach | Alquiler de departamento en Jurerê, a 50 m de la playa |
| `home.seo.description` | Dois apartamentos para até 3 pessoas em Jurerê, Florianópolis. Mínimo de 4 noites. Fale direto pelo WhatsApp, sem taxas de plataforma. | Two apartments for up to 3 guests in Jurerê, Florianópolis. 4-night minimum. Message us directly on WhatsApp, no platform fees. | Dos departamentos para hasta 3 personas en Jurerê, Florianópolis. Mínimo 4 noches. Hablá directo por WhatsApp, sin comisiones. |

### 9.2 Bairro (`neighborhood.seo.*`)

| Chave | pt | en | es |
|---|---|---|---|
| `neighborhood.seo.title` | O que fazer em Jurerê Tradicional: guia do bairro | Things to Do in Jurerê Tradicional: Local Guide | Qué hacer en Jurerê Tradicional y cómo llegar |
| `neighborhood.seo.description` | Praias, onde comer, como chegar e a melhor época para Jurerê Tradicional, em Florianópolis. E a diferença para Jurerê Internacional. | Beaches, where to eat, how to get there and when to visit Jurerê Tradicional, Florianópolis. And how it differs from Jurerê Internacional. | Playas, dónde comer, cómo llegar y cuándo ir a Jurerê Tradicional, Florianópolis. Y en qué se diferencia de Jurerê Internacional. |

### 9.3 Privacidade (`privacy.seo.*`)

| Chave | pt | en | es |
|---|---|---|---|
| `privacy.seo.title` | Política de privacidade e cookies | Privacy Policy and Cookies | Política de privacidad y cookies |
| `privacy.seo.description` | O que a Acácia coleta quando você visita o site ou chama no WhatsApp, para quê, por quanto tempo, e como pedir a correção ou a exclusão dos seus dados. | What Acácia collects when you visit the site or message us on WhatsApp, why, for how long, and how to ask us to correct or delete your data. | Qué datos recoge Acácia cuando visitás el sitio o escribís por WhatsApp, para qué, por cuánto tiempo y cómo pedir que los corrijamos o borremos. |

### 9.4 404

| Chave | pt | en | es |
|---|---|---|---|
| `notFound.meta.title` | Página não encontrada | Page not found | Página no encontrada |

Contagem (feita com script em 2026-10-19):

| Chave | pt | en | es | Limite |
|---|---|---|---|---|
| `home.seo.title` | 47 | 47 | 54 | ≤ 60 OK |
| `home.seo.description` | 134 | 127 | 126 | ≤ 155 OK |
| `neighborhood.seo.title` | 49 | 47 | 45 | ≤ 60 OK |
| `neighborhood.seo.description` | 132 | 138 | 129 | ≤ 155 OK |
| `privacy.seo.title` | 33 | 26 | 32 | ≤ 60 OK |
| `privacy.seo.description` | 151 | 140 | 144 | ≤ 155 OK |


---

## 10. Checklist contra o brand.md

- [x] Fato em toda frase; nenhuma palavra da lista proibida (paraíso, inesquecível, exclusivo, experiência, refúgio etc.).
- [x] "A 50 m da praia" em vez de "beira-mar"/"frente al mar".
- [x] "Apto 4"/"Apt 4"/"Depto 4"; es com "vos", "depto", "cochera".
- [x] Nenhum horário de atendimento nem tempo de resposta perto do botão.
- [x] Nenhuma menção a nota ou link do Booking, nem à família por nome ("nós" discreto só em "mandamos as instruções", "combinamos", "lo arreglamos").
- [x] Pagamento e cancelamento: "combinamos pelo WhatsApp", sem política escrita.
- [x] Wi-Fi sem Mbps; apto 6 "sem escada"; "Jurerê Internacional" só no description do bairro (que é da T12/T17), nunca em home e aptos.
- [x] Slugs não traduzidos: `/en/privacidade/`, `/es/privacidade/` (os links usam `{privacyUrl}`).
- [x] GA4 só depois do "Aceitar" (texto do banner copiado da T20).
- [x] Sem emojis; o "¡Hola!/Olá!/Hi!" é só na abertura da mensagem de WhatsApp.

---

## Notas para outras tarefas

- **T11 (data-model) / T18 / T24:** o `{name}` da mensagem do WhatsApp é o rótulo curto "Apto 4" / "Apt 4" / "Depto 4", **não** o `name` longo do §11 do data-model ("Departamento con balcón y vista al mar"). Proponho montá-lo com `property.label` + `unitLabel`/número (já existe `unitLabel: Apto 4`, mas ele não é traduzido). Alternativa: um campo `shortName` localizado.
- **T11 (§6 amenities):** (1) a chave nova `amenity.stepFree` foi adotada e já está no data-model §6 ("sem escada da rua até dentro"), para o apto 6; o data-model só tem `wheelchairAccessible`, que **não** está confirmado. Entra no enum e na V52 (não combina com `stairsOnly`). (2) Rótulos finais mudaram em relação ao rascunho: `ovenStove` ("Fogão e forno", sem "cooktop"), `washer` ("Máquina de lavar roupa"), `desk` ("Work desk" em en), `airConditioning` en/es com "split", `freeParking` es ("Cochera sin cargo"), `stairsOnly`, `tv` com "Smart TV", `beachGear` es com "de playa". Os rótulos `amenityFeature` do schema continuam em inglês, independente destes.
- **T23 (i18n):** adotar as chaves desta tabela como estão; plural por `_one`/`_other`; a V51 deve checar também `amenity.group.*`. `footer.cookiePreferences` e `cookies.preferences` são o mesmo texto (uma chave só).
- **T30 (cookies):** o banner de idioma não pode competir com o de cookies (mostrar um de cada vez, §5.2); a dispensa do banner de idioma usa `sessionStorage`, não cookie.
- **T31 (WhatsApp):** montar `intro + " " + ask` (§7.4) e testar os exemplos de §7.3. O formulário exige os 3 campos; as regras de validação estão na §8.2. `{earliest}` e a data da mensagem usam os formatos fixos da §0.
- **T28 (imóvel) / T29 (bairro) / T27 (home):** títulos de seção estão em `property.section.*`; o bloco `property.section.rules` é o "Antes de reservar" do brand.md.
- **T33 (analytics):** o evento `whatsapp_click` não leva o texto da mensagem.
- **T20 (privacidade):** o banner de idioma não grava nada além de `sessionStorage` da sessão; se isso mudar, atualizar a tabela de cookies.
- **Decisões do usuário aplicadas (2026-10-20):** menu = "Jurerê" nos 3 idiomas; "Cochera sin cargo" mantido; mini formulário só nos aptos; `amenity.stepFree` adotada; TV é Smart TV.
