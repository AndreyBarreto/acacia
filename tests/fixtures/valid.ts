// Valid content entries, shaped like the YAML files in content/ after parsing.
// Invalid fixtures (tests/fixtures/invalid.ts) are small changes on top of these.

export const site = {
  brandName: 'Acácia',
  siteUrl: 'https://acaciafloripa.com.br',
  defaultLocale: 'pt',
  hostLanguages: ['pt-BR', 'es'],
  contact: { whatsapp: '+5548999442015' },
};

export const city = {
  name: { pt: 'Florianópolis', en: 'Florianópolis', es: 'Florianópolis' },
  region: 'SC',
  country: 'BR',
  timeZone: 'America/Sao_Paulo',
};

const seo = {
  title: {
    pt: 'O que fazer em Jurerê Tradicional: guia do bairro',
    en: 'Things to Do in Jurerê Tradicional: Local Guide',
    es: 'Qué hacer en Jurerê Tradicional y cómo llegar',
  },
  description: {
    pt: 'Praias, onde comer, como chegar e a melhor época para Jurerê Tradicional, em Florianópolis.',
    en: 'Beaches, where to eat, how to get there and when to visit Jurerê Tradicional, Florianópolis.',
    es: 'Playas, dónde comer, cómo llegar y cuándo ir a Jurerê Tradicional, Florianópolis.',
  },
};

export const neighborhood = {
  city: 'florianopolis',
  order: 1,
  name: { pt: 'Jurerê', en: 'Jurerê', es: 'Jurerê' },
  geo: { latitude: '-27.43800', longitude: '-48.49500' },
  seo,
};

const image = (src: string, category: string, alt: { pt: string; en: string; es: string }) => ({
  src,
  category,
  provisional: true,
  alt,
});

export const building = {
  name: 'Residencial Acacia',
  neighborhood: 'jurere',
  address: { street: 'Rua Luiz Rampa, 70', postalCode: '88053-682' },
  geo: { latitude: '-27.43812', longitude: '-48.49587' },
  beachDistanceMeters: 50,
  amenities: ['wifi', 'freeParking'],
  images: [
    image('./photos/front.jpg', 'exterior', {
      pt: 'Fachada do prédio de dois andares',
      en: 'Front of the two-storey building',
      es: 'Frente del edificio de dos pisos',
    }),
    image('./photos/beach.jpg', 'beach', {
      pt: 'Praia de Jurerê no fim da rua',
      en: 'Jurerê beach at the end of the lane',
      es: 'Playa de Jurerê al final del pasaje',
    }),
  ],
};

export const property = {
  identifier: 'acacia-4',
  status: 'draft',
  order: 1,
  neighborhood: 'jurere',
  building: 'residencial-acacia',
  unitLabel: 'Apto 4',
  showUnitPublicly: false,
  propertyType: 'Apartment',
  name: { pt: 'Apto 4', en: 'Apt 4', es: 'Depto 4' },
  subtitle: {
    pt: 'Com varanda e vista para o mar',
    en: 'With a sea-view balcony',
    es: 'Con balcón y vista al mar',
  },
  summary: {
    pt: 'No andar de cima, com varanda, a 50 m da praia. Até 3 pessoas.',
    en: 'Upstairs, with a balcony, 50 m from the beach. Sleeps 3.',
    es: 'En la planta alta, con balcón, a 50 m de la playa. Hasta 3 personas.',
  },
  description: {
    pt: 'O Apto 4 fica no andar de cima, a 50 m da praia de Jurerê.\n',
    en: 'Apt 4 is the upstairs unit, 50 m from the beach in Jurerê.\n',
    es: 'El depto 4 está en la planta alta, a 50 m de la playa de Jurerê.\n',
  },
  highlights: {
    pt: ['A 50 m da praia de Jurerê', 'Wi-Fi e mesa de trabalho', 'Garagem no prédio, sem custo'],
    en: ['50 m from Jurerê beach', 'Wi-Fi and a work desk', 'Free parking in the building'],
    es: ['A 50 m de la playa de Jurerê', 'Wi-Fi y mesa para trabajar', 'Cochera en el edificio'],
  },
  seo: {
    title: {
      pt: 'Apartamento com varanda e vista para o mar em Jurerê',
      en: 'Jurerê Apartment with Balcony and Sea View',
      es: 'Departamento con balcón y vista al mar en Jurerê',
    },
    description: {
      pt: 'Apartamento para até 3 pessoas com varanda, a 50 m da praia em Jurerê. Mínimo de 4 noites.',
      en: 'Apartment for up to 3 guests with a balcony, 50 m from the beach in Jurerê. 4-night minimum.',
      es: 'Departamento para hasta 3 personas con balcón, a 50 m de la playa en Jurerê. Mínimo 4 noches.',
    },
  },
  capacity: { maxGuests: 3 },
  bedrooms: 1,
  bathrooms: 1,
  floorSizeM2: 44,
  sleepingAreas: [
    { room: 'bedroom', beds: [{ type: 'double', count: 1 }] },
    { room: 'livingRoom', beds: [{ type: 'sofaBed', count: 1 }] },
  ],
  floor: 'upper',
  views: ['sea', 'mountain'],
  amenities: ['airConditioning', 'kitchen', 'desk', 'balcony', 'stairsOnly'],
  rules: {
    checkIn: { from: '14:00' },
    checkOut: { until: '11:00' },
    minNights: 4,
    smoking: false,
    pets: false,
    children: true,
    crib: false,
    selfCheckIn: true,
    notes: {
      pt: ['Avise pelo WhatsApp a que horas pretende chegar.'],
      en: ['Let us know on WhatsApp roughly when you will arrive.'],
      es: ['Avisanos por WhatsApp a qué hora pensás llegar.'],
    },
  },
  images: [
    {
      ...image('./photos/balcony.jpg', 'balcony', {
        pt: 'Varanda com cadeiras e o mar ao fundo',
        en: 'Balcony with chairs and the sea beyond',
        es: 'Balcón con sillas y el mar al fondo',
      }),
      cover: true,
      fileName: {
        pt: 'apto-4-jurere-varanda',
        en: 'apt-4-jurere-balcony',
        es: 'depto-4-jurere-balcon',
      },
    },
    image('./photos/living.jpg', 'living', {
      pt: 'Sala com sofá e porta para a varanda',
      en: 'Living room with a sofa and balcony door',
      es: 'Living con sillón y puerta al balcón',
    }),
    image('./photos/kitchen.jpg', 'kitchen', {
      pt: 'Cozinha com cooktop e micro-ondas',
      en: 'Kitchen with a stovetop and microwave',
      es: 'Cocina con anafe y microondas',
    }),
    image('./photos/table.jpg', 'kitchen', {
      pt: 'Mesa de granito para as refeições',
      en: 'Granite table for meals',
      es: 'Mesa de granito para comer',
    }),
    image('./photos/bedroom.jpg', 'bedroom', {
      pt: 'Quarto com cama de casal',
      en: 'Bedroom with a double bed',
      es: 'Dormitorio con cama matrimonial',
    }),
    image('./photos/bathroom.jpg', 'bathroom', {
      pt: 'Banheiro com box de vidro',
      en: 'Bathroom with a glass shower',
      es: 'Baño con mampara de vidrio',
    }),
  ],
};

/** A whole valid site, as Astro hands the entries over: an id (the folder name) and the data. */
export const content = {
  site: [{ id: 'site', data: site }],
  cities: [{ id: 'florianopolis', data: city }],
  neighborhoods: [{ id: 'jurere', data: neighborhood }],
  buildings: [{ id: 'residencial-acacia', data: building }],
  properties: [{ id: 'apto-4', data: property }],
};
