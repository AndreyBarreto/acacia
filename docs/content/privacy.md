# Política de privacidade e aviso de cookies — VERSÃO FINAL PARA REVISÃO

> **Aviso: este documento NÃO é parecer jurídico.** É um texto técnico escrito por um agente de IA a partir de fontes oficiais e públicas. Antes de publicar, deve ser revisado por advogado(a) ou, no mínimo, conferido pelo responsável contra a LGPD e o guia da ANPD.
>
> Status: versão final da T20, aguardando aprovação do usuário. Itens entre `{CHAVES}` são placeholders a preencher antes do lançamento.

## 0. Notas internas (não vão para o site)

### Fontes oficiais consultadas (2026-10-19)

Desta vez as duas fontes brasileiras abriram. O Planalto só respondeu com `curl -k` e um User-Agent de navegador; o PDF da ANPD só baixou pelo link `.../guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf/@@display-file/file` (o link direto devolve uma página HTML).

| Fonte | Link | O que foi conferido |
|---|---|---|
| Lei nº 13.709/2018 (LGPD), Planalto | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm | Texto lido. Conferidos: art. 7º (bases legais: I consentimento, II obrigação legal, V procedimentos preliminares a contrato, IX legítimo interesse), art. 8º (consentimento por meio que demonstre a vontade; ônus da prova do controlador), art. 18 (direitos), art. 33 (transferência internacional) e art. 41 (encarregado; identidade e contato divulgados publicamente, de preferência no site). |
| ANPD, Guia Orientativo "Cookies e Proteção de Dados Pessoais" | https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf | PDF lido (texto extraído). Pontos usados abaixo. |
| ANPD (portal) | https://www.gov.br/anpd | Canal de reclamação do titular. |
| Google, cookies do GA4 | https://support.google.com/analytics/answer/11397207 | `_ga` e `_ga_<container-id>`, 2 anos por padrão; a duração pode ser alterada (de imediata a 25 meses). |
| Google, Consent Mode (visão geral) | https://developers.google.com/tag-platform/security/concepts/consent-mode | Modos básico e avançado; tipos de consentimento. |
| Google, configurar Consent Mode | https://developers.google.com/tag-platform/security/guides/consent | `gtag('consent','default',{...})` antes de qualquer `config`/`event`; `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`. |
| Google, Consent Mode no Analytics | https://support.google.com/analytics/answer/9976101 | Com consentimento negado, as tags não gravam cookies e enviam "pings sem cookies"; o Google preenche lacunas com modelagem. |
| Google, retenção de dados do GA4 | https://support.google.com/analytics/answer/7667196 | Dados de usuário e de eventos: 2 ou 14 meses (propriedade padrão). |
| AWS, logs de acesso do CloudFront | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/standard-logging.html | Campos registrados (lista abaixo). |
| AWS, visão geral de logs | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/logging.html | Logs de acesso são um recurso que se ativa e entrega num destino que você escolhe. |
| AWS, pontos de presença do CloudFront | https://aws.amazon.com/cloudfront/features/ | Lista de PoPs, incluindo Fortaleza, Rio de Janeiro, São Paulo e Buenos Aires. |

### O que o guia da ANPD diz (lido no PDF)

- Consentimento deve ser **livre, informado e inequívoco**; consentimento tácito ou caixas pré-marcadas não valem; o titular deve poder **revogar de forma simplificada e gratuita** a qualquer momento.
- Banner de primeiro nível: botão para **rejeitar todos os cookies não necessários, de fácil visualização**. No exemplo analisado pela ANPD, "aceitar", "rejeitar" e "gerenciar" têm **o mesmo formato e destaque**; cookies baseados em consentimento ficam **desativados por padrão**; o banner informa finalidades e retenção; falta, no exemplo, apenas o mecanismo de revogação, que no nosso caso é o link "Preferências de cookies" no rodapé.
- É orientação interpretativa, não norma.

### Consent Mode v2: o que fazer e o que significa (para T30/T33)

Fatos da documentação do Google:

- Consent Mode tem dois modos. **Básico**: as tags do Google ficam bloqueadas até o clique no banner; **nenhum dado é enviado antes do consentimento, nem o estado de consentimento**. **Avançado**: as tags carregam já na abertura da página, com tudo negado, e enviam **pings sem cookies** ao Google mesmo sem consentimento (o Google usa isso para modelagem).
- Os 4 parâmetros do v2: `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`. O `default` deve rodar antes de qualquer `config`/`event`.

Decisão registrada (CLAUDE.md): **GA4 só carrega depois do "Aceitar"**. Isso corresponde ao **modo básico**: o script do Google nem é baixado antes do aceite. Se algum dia se adotar o modo avançado, a política precisa dizer que o Google recebe pings sem cookies (com IP, agente do navegador e página) mesmo sem aceite, e a base legal e o texto do banner mudam. **Não adotar o avançado sem nova decisão.** Implementação sugerida para a T33: `default` com os 4 parâmetros `denied` (não usamos publicidade, então `ad_*` ficam sempre `denied`), carregar o script do GA4 só no "Aceitar" e chamar `update` com `analytics_storage: 'granted'`. Não ativar sinais do Google nem recursos de publicidade no GA4.

### Registros do CloudFront (para T35)

A documentação da AWS lista, entre os campos de cada requisição nos logs de acesso (padrão): data e hora, local de borda (`x-edge-location`), **IP do visitante** (`c-ip`), método, host, caminho (`cs-uri-stem`), status, **Referer**, **User-Agent**, parâmetros da URL (`cs-uri-query`), cookies (`cs(Cookie)`, só se o registro de cookies for ligado), tempo de resposta, protocolo TLS, entre outros; também há o país do visitante deduzido do IP (`c-country`). Os logs de acesso são um recurso que **se ativa** e que entrega os arquivos a um destino escolhido (por exemplo, um bucket S3 ou o CloudWatch). A doc **não fixa um prazo de retenção**: quem define é o dono da conta. Duas decisões ficam para a T35: (1) ligar ou não os logs de acesso; (2) a região do bucket S3 (sugestão: `sa-east-1`, São Paulo). Se os logs forem ligados, sugiro **desligar o registro de cookies** e **guardar 90 dias** com expiração automática (lifecycle) no bucket. O texto abaixo cobre os dois casos.

O CloudFront entrega o conteúdo a partir do ponto de presença mais próximo do visitante (há PoPs em Fortaleza, Rio, São Paulo e Buenos Aires, entre outros no mundo), então o IP do visitante é processado nesse ponto. O conteúdo em si fica no bucket S3 da região escolhida.

### Decisões aplicadas

1. Base legal do GA4: **consentimento** (art. 7º, I).
2. Responsável pelos dados: **pessoa física**, sem CNPJ (placeholder).
3. **Encarregado = o próprio responsável** (art. 41 pede identidade e contato públicos; a LGPD admite regra de dispensa para agentes de pequeno porte via regulamento da ANPD, a confirmar com jurídico).
4. **Sem e-mail no domínio**: o canal único é o WhatsApp +55 48 99944-2015. Atenção: um pedido de privacidade por WhatsApp é válido, mas o responsável deve guardar o registro do pedido e da resposta.
5. Menção curta às leis da Argentina (Ley 25.326) e do Uruguai (Ley 18.331), sem prometer conformidade.
6. Resposta em **15 dias**; conversas de WhatsApp guardadas só enquanto necessário, com **revisão anual**.
7. Sem menção a Airbnb/Booking.

### Placeholders

`{CONTROLLER_NAME}` (nome completo da pessoa física) · `{CONTACT}` (nome para contato; o canal é o WhatsApp acima) · `{CONTROLLER_ADDRESS}` (opcional; o art. 41 não exige endereço, mas confira com jurídico) · `{S3_REGION}` (T35; sugestão: São Paulo) · `{LOG_RETENTION_DAYS}` (T35; sugestão: 90) · `{LAST_UPDATED}` · `{LINK_PT}`/`{LINK_EN}`/`{LINK_ES}` (URLs da política, T30; lembrar que o slug não é traduzido, ex.: `/en/privacidade/`)

---

## 1. Política de Privacidade — pt-BR

**Última atualização:** {LAST_UPDATED}

### Quem somos
Este site apresenta apartamentos de aluguel por temporada em Jurerê, Florianópolis/SC. O responsável pelos dados pessoais (o "controlador", na Lei Geral de Proteção de Dados, a LGPD) é **{CONTROLLER_NAME}**, pessoa física. Essa mesma pessoa é o **encarregado** pelo tratamento de dados. Contato para qualquer assunto de privacidade: **{CONTACT}**, pelo WhatsApp **+55 48 99944-2015**.

### Resumo
Não temos cadastro, login nem formulário que guarde seus dados. O contato é feito pelo WhatsApp. Só usamos estatísticas de visitas (Google Analytics) se você aceitar, e você pode recusar sem perder nada.

### Que dados tratamos e para quê

| Situação | Dados | Finalidade | Base legal (LGPD, art. 7º) |
|---|---|---|---|
| Você navega no site | Endereço IP, navegador e dispositivo, página pedida, data e hora, origem da visita (registros de acesso da nossa hospedagem na AWS, se ativados) | Entregar o site, segurança e prevenção de abuso | Legítimo interesse (IX) |
| Você aceita os cookies de estatística | Identificadores de cookie do Google Analytics, páginas vistas, idioma, origem da visita, tipo de dispositivo, cliques no botão de WhatsApp (com o imóvel e o idioma) | Entender quais páginas e imóveis interessam e melhorar o site | Consentimento (I) |
| Você clica no botão de WhatsApp | Nada é enviado ao nosso servidor. O WhatsApp abre com uma mensagem pré-preenchida que **você** decide enviar | Facilitar o contato | Procedimentos preliminares a contrato, a pedido do titular (V) |
| Você nos escreve pelo WhatsApp | Seu número, nome de perfil e o que você escrever | Responder, informar disponibilidade e combinar a hospedagem | Procedimentos preliminares a contrato (V); depois, execução de contrato (V) e cumprimento de obrigação legal, se houver reserva (II) |

Não coletamos dados sensíveis nem de crianças. Se você nos enviar algo assim pelo WhatsApp, usaremos apenas para atender ao seu pedido.

### Hospedagem
O site fica na **Amazon Web Services (AWS)**: os arquivos ficam no Amazon S3 (região {S3_REGION}) e são entregues pelo Amazon CloudFront, uma rede de servidores espalhados pelo mundo (inclusive no Brasil e na Argentina) que responde a partir do ponto mais próximo de você. Para entregar uma página, esses servidores recebem o seu IP e os dados técnicos do pedido (navegador, página, data e hora). Os registros de acesso, se ativados, guardam esses dados e **{LOG_RETENTION_DAYS} dias** é o prazo máximo que mantemos. Não usamos esses registros para identificar você nem para publicidade.

### Cookies
Resumo: o cookie (ou item de armazenamento local) que lembra a sua escolha é estritamente necessário e não precisa de consentimento. Os cookies de estatística do Google Analytics **só são ativados se você clicar em "Aceitar"**, e o script do Google nem é carregado antes disso. Você pode mudar de ideia a qualquer momento em "Preferências de cookies", no rodapé. Veja o quadro na seção "Cookies" do site.

### Com quem compartilhamos
- **Google LLC** (Google Analytics 4, só depois do seu consentimento; e Search Console, que mostra de forma agregada como o Google exibe nossas páginas e não coleta dados seus).
- **Amazon Web Services**, que hospeda o site e pode manter registros de acesso.
- **WhatsApp / Meta Platforms**, quando você escolhe iniciar a conversa; vale a política deles.
- Autoridades, quando a lei exigir.

Não vendemos dados.

### Transferência internacional
Google, Meta e AWS podem tratar dados fora do Brasil (por exemplo, nos Estados Unidos). Isso é feito com base no seu consentimento específico (no caso do Analytics) ou nas hipóteses do art. 33 da LGPD, como cláusulas contratuais, conforme o caso.

### Por quanto tempo guardamos
- Registros de acesso da hospedagem: {LOG_RETENTION_DAYS} dias, se ativados.
- Dados do Google Analytics: 14 meses (configuração da ferramenta; o cookie `_ga` dura até 2 anos no seu navegador).
- Conversas de WhatsApp: só pelo tempo necessário para atender você; se houver reserva, pelo prazo exigido por lei fiscal ou contábil. Revisamos as conversas antigas uma vez por ano e apagamos o que não for mais necessário.

### Seus direitos (LGPD, art. 18)
Você pode pedir: confirmação de que tratamos seus dados; acesso; correção; anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos; portabilidade; eliminação dos dados tratados com consentimento; informação sobre com quem compartilhamos; informação sobre a possibilidade de não consentir e suas consequências; e **revogar o consentimento** quando quiser. Para pedir, escreva para **+55 48 99944-2015** (WhatsApp), dizendo que é um pedido de privacidade. Respondemos em até **15 dias**. Se não ficar satisfeito, você pode reclamar à **ANPD** (https://www.gov.br/anpd).

### Visitantes de outros países
Se você acessa da Argentina ou do Uruguai, as leis locais de proteção de dados (Ley 25.326 e Ley 18.331) também podem proteger você. Os direitos acima valem para todos.

### Mudanças
Se mudarmos esta política, a data no topo será atualizada.

---

## 2. Privacy Policy — English (adapted)

**Last updated:** {LAST_UPDATED}

### Who we are
This website presents holiday apartments in Jurerê, Florianópolis, Brazil. The data controller under Brazil's data protection law (LGPD) is **{CONTROLLER_NAME}**, an individual. The same person is the **data protection officer**. For anything about privacy, contact **{CONTACT}** on WhatsApp at **+55 48 99944-2015**.

### In short
There are no accounts, no logins and no forms that store your details. You contact us on WhatsApp. We only measure visits with Google Analytics if you say yes, and saying no costs you nothing.

### What we collect and why

| When | Data | Why | Legal basis (Brazilian LGPD, art. 7) |
|---|---|---|---|
| You browse the site | IP address, browser and device, page requested, date and time, where you came from (access logs of our AWS hosting, if enabled) | Deliver the site, keep it secure | Legitimate interest |
| You accept analytics cookies | Google Analytics cookie identifiers, pages viewed, language, traffic source, device type, clicks on the WhatsApp button (with the apartment and language) | See which pages and apartments people care about, improve the site | Consent |
| You tap the WhatsApp button | Nothing is sent to our server. WhatsApp opens with a pre-filled message that **you** choose to send | Make contact easy | Steps preceding a contract, at your request |
| You message us on WhatsApp | Your number, profile name, and what you write | Reply, check availability, arrange your stay | Pre-contract steps; contract performance; legal obligations if you book |

We do not collect sensitive data or data from children.

### Hosting
The site is hosted on **Amazon Web Services (AWS)**: files are stored in Amazon S3 (region {S3_REGION}) and delivered by Amazon CloudFront, a network of servers around the world (including in Brazil and Argentina) that answers from the point closest to you. To deliver a page, these servers receive your IP address and the technical details of the request (browser, page, date and time). Access logs, if switched on, keep that data for at most **{LOG_RETENTION_DAYS} days**. We do not use them to identify you or for advertising.

### Cookies
The item that remembers your cookie choice is strictly necessary and needs no consent. Google Analytics cookies are **only set if you click "Accept"**, and Google's script is not even loaded before that. You can change your mind at any time with "Cookie preferences" in the footer.

### Who we share data with
- **Google LLC** (Google Analytics 4, only after you consent; and Search Console, which shows us in aggregate how Google displays our pages and collects nothing about you).
- **Amazon Web Services**, our host, which may keep access logs.
- **WhatsApp / Meta**, when you choose to start a chat; their own policy applies.
- Authorities, where the law requires it.

We do not sell personal data.

### International transfers
Google, Meta and AWS may process data outside Brazil (for example in the US), based on your specific consent (Analytics) or the grounds in art. 33 of the LGPD, such as contractual clauses.

### How long we keep it
Access logs: {LOG_RETENTION_DAYS} days, if switched on. Analytics data: 14 months (a tool setting; the `_ga` cookie lasts up to 2 years in your browser). WhatsApp chats: only as long as needed to help you and, if you book, as long as tax and accounting law requires. We review old chats once a year and delete what is no longer needed.

### Your rights
Under Brazilian law (LGPD, art. 18) you can ask to confirm, access, correct, anonymize, block or delete your data, port it, ask who we share it with, and withdraw consent at any time. Message **+55 48 99944-2015** on WhatsApp and say it is a privacy request; we answer within **15 days**. You can also complain to Brazil's data protection authority, the **ANPD** (https://www.gov.br/anpd). If you live in Argentina or Uruguay, local laws (Ley 25.326 and Ley 18.331) may also protect you. If you live in the EU or UK, note that this site is aimed at visitors to Brazil and we have not assessed GDPR separately.

### Changes
We will update the date above if this policy changes.

---

## 3. Política de Privacidad — español rioplatense

**Última actualización:** {LAST_UPDATED}

### Quién somos
Este sitio presenta departamentos de alquiler por temporada en Jurerê, Florianópolis (Brasil). El responsable de los datos personales (el "controlador", según la Ley General de Protección de Datos de Brasil, la LGPD) es **{CONTROLLER_NAME}**, persona física. Esa misma persona es la **encargada** del tratamiento de datos. Para cualquier tema de privacidad, escribile a **{CONTACT}** por WhatsApp al **+55 48 99944-2015**.

### En pocas palabras
No hay registro, ni usuarios, ni formularios que guarden tus datos. El contacto es por WhatsApp. Solo medimos las visitas con Google Analytics si vos lo aceptás, y si lo rechazás no perdés nada.

### Qué datos tratamos y para qué

| Cuándo | Datos | Para qué | Base legal (LGPD brasileña, art. 7) |
|---|---|---|---|
| Navegás por el sitio | Dirección IP, navegador y dispositivo, página pedida, fecha y hora, de dónde llegaste (registros de acceso de nuestro hosting en AWS, si están activados) | Mostrar el sitio y mantenerlo seguro | Interés legítimo |
| Aceptás las cookies de estadísticas | Identificadores de cookie de Google Analytics, páginas vistas, idioma, origen de la visita, tipo de dispositivo, clics en el botón de WhatsApp (con el departamento y el idioma) | Saber qué páginas y qué departamentos interesan y mejorar el sitio | Consentimiento |
| Tocás el botón de WhatsApp | No enviamos nada a nuestro servidor. Se abre WhatsApp con un mensaje ya escrito que **vos** decidís enviar | Facilitar el contacto | Trámites previos a un contrato, a pedido tuyo |
| Nos escribís por WhatsApp | Tu número, tu nombre de perfil y lo que escribas | Responderte, confirmar disponibilidad y coordinar tu estadía | Trámites previos al contrato; ejecución del contrato; obligaciones legales si reservás |

No recogemos datos sensibles ni de menores.

### Hosting
El sitio está en **Amazon Web Services (AWS)**: los archivos se guardan en Amazon S3 (región {S3_REGION}) y se entregan con Amazon CloudFront, una red de servidores repartidos por el mundo (también en Brasil y en Argentina) que te responde desde el punto más cercano. Para entregarte una página, esos servidores reciben tu IP y los datos técnicos del pedido (navegador, página, fecha y hora). Los registros de acceso, si están activados, guardan esos datos por un máximo de **{LOG_RETENTION_DAYS} días**. No los usamos para identificarte ni para publicidad.

### Cookies
Lo que recuerda tu elección de cookies es estrictamente necesario y no requiere consentimiento. Las cookies de estadísticas de Google Analytics **solo se activan si tocás "Aceptar"**, y el script de Google ni siquiera se carga antes. Podés cambiar de opinión cuando quieras en "Preferencias de cookies", en el pie de página.

### Con quién compartimos datos
- **Google LLC** (Google Analytics 4, solo si das tu consentimiento; y Search Console, que nos muestra de forma agregada cómo Google exhibe nuestras páginas y no recoge datos tuyos).
- **Amazon Web Services**, que aloja el sitio y puede guardar registros de acceso.
- **WhatsApp / Meta**, cuando elegís iniciar el chat; rige su propia política.
- Autoridades, cuando la ley lo exija.

No vendemos datos personales.

### Transferencias internacionales
Google, Meta y AWS pueden tratar datos fuera de Brasil (por ejemplo, en Estados Unidos), con base en tu consentimiento específico (Analytics) o en los supuestos del art. 33 de la LGPD, como las cláusulas contractuales.

### Cuánto tiempo los guardamos
Registros de acceso: {LOG_RETENTION_DAYS} días, si están activados. Datos de Analytics: 14 meses (es un ajuste de la herramienta; la cookie `_ga` dura hasta 2 años en tu navegador). Conversaciones de WhatsApp: solo el tiempo necesario para atenderte y, si reservás, el que exijan las normas fiscales y contables. Revisamos las conversaciones viejas una vez por año y borramos lo que ya no hace falta.

### Tus derechos
Según la ley brasileña (LGPD, art. 18) podés pedir confirmación, acceso, corrección, anonimización, bloqueo o eliminación de tus datos, portabilidad, saber con quién los compartimos y retirar tu consentimiento cuando quieras. Escribinos por WhatsApp al **+55 48 99944-2015** y aclarános que es un pedido de privacidad; te respondemos en **15 días**. También podés reclamar ante la autoridad brasileña, la **ANPD** (https://www.gov.br/anpd). Si estás en Argentina o Uruguay, la Ley 25.326 (AR) y la Ley 18.331 (UY) también pueden protegerte.

### Cambios
Si cambiamos esta política, actualizaremos la fecha de arriba.

---

## 4. Tabela de cookies

| Cookie | Categoria | Finalidade | Duração | Terceiro? | Precisa de consentimento? |
|---|---|---|---|---|---|
| `cookie_consent` (nome sugerido; pode ser `localStorage`) | Necessário | Guardar sua escolha (aceitar ou recusar) | 6 meses (sugestão; pedir de novo depois) | Não | Não |
| `_ga` | Estatística | Distinguir visitantes | 2 anos (padrão do GA4; configurável de imediata a 25 meses) | Sim (Google) | Sim |
| `_ga_<container-id>` | Estatística | Manter o estado da sessão | 2 anos (padrão do GA4) | Sim (Google) | Sim |

- Fonte: https://support.google.com/analytics/answer/11397207 (cookies do GA4). Sugestão para a T33: reduzir a duração dos cookies do GA4 para 13 meses na configuração da tag (opcional).
- Não usamos cookie de idioma: a URL (`/pt/`, `/en/`, `/es/`) já carrega o idioma.
- Se o GA4 não carregar, `_ga` e `_ga_<container-id>` nunca são criados.
- Consent Mode v2, **modo básico** (ver seção 0): `analytics_storage`, `ad_storage`, `ad_user_data` e `ad_personalization` começam `denied`; só `analytics_storage` vira `granted` no "Aceitar". Não usamos publicidade.

## 5. Aviso de cookies (texto final do banner)

Regras para a T30: botões "Aceitar" e "Recusar" **com o mesmo formato e destaque**, na primeira camada, lado a lado; nada pré-marcado; GA4 desativado até o "Aceitar"; link para a política; link "Preferências de cookies" no rodapé, que reabre o banner (mecanismo de revogação exigido pela LGPD, art. 8º, § 5º, e destacado pela ANPD).

### pt-BR
> **Cookies**
> Usamos um cookie necessário para lembrar a sua escolha. Com a sua permissão, também usamos o Google Analytics para saber quais páginas e imóveis interessam. Recusar não muda nada no site, e você pode mudar de ideia quando quiser em "Preferências de cookies", no rodapé. [Política de privacidade]({LINK_PT})
> [Aceitar] [Recusar]

Link do rodapé: **Preferências de cookies**

### en
> **Cookies**
> We use one necessary cookie to remember your choice. If you allow it, we also use Google Analytics to see which pages and apartments people look at. Declining changes nothing on the site, and you can change your mind any time in "Cookie preferences" in the footer. [Privacy policy]({LINK_EN})
> [Accept] [Decline]

Footer link: **Cookie preferences**

### es
> **Cookies**
> Usamos una cookie necesaria para recordar tu elección. Si nos das permiso, también usamos Google Analytics para saber qué páginas y departamentos interesan. Rechazar no cambia nada en el sitio, y podés cambiar de opinión cuando quieras en "Preferencias de cookies", en el pie de página. [Política de privacidad]({LINK_ES})
> [Aceptar] [Rechazar]

Enlace del pie: **Preferencias de cookies**

## 6. Pendências antes de publicar
- Preencher `{CONTROLLER_NAME}`, `{CONTACT}`, `{LAST_UPDATED}` e links (usuário).
- T35: decidir se os logs de acesso do CloudFront serão ligados, a região do S3 (`{S3_REGION}`) e a retenção (`{LOG_RETENTION_DAYS}`); se não ligar logs, simplificar a linha de "registros de acesso" nos 3 idiomas.
- T33: confirmar Consent Mode básico, `default` negado, retenção do GA4 em 14 meses e a duração dos cookies.
- Revisão jurídica: dispensa ou não do encarregado para agente de pequeno porte, uso do WhatsApp como único canal do titular, e menção às leis da Argentina e do Uruguai.
