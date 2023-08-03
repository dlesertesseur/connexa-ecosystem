const COMEX = {
  types: {
    RECAP_CREATED: "CREATED",
  },

  campaigns: [
    { id: 1, event: "Dia del niño 2024", description: "" },
    { id: 2, event: "Navidad 2024", description: "" },
    { id: 3, event: "Dia de la madre 2024", description: "" },
    { id: 4, event: "Dia del padre 2024", description: "" },
  ],

  departments: [
    { id: 1, code: "GRO", name: "Bodega / Alimentos" },
    { id: 2, code: "ELE", name: "Electrónica" },
    { id: 3, code: "HOG", name: "Hogar" },
    { id: 4, code: "MOD", name: "Moda / Ropa" },
    { id: 5, code: "ZAP", name: "Zapatos y Accesorios" },
    { id: 6, code: "JUG", name: "Juguetes" },
    { id: 7, code: "LIB", name: "Libros y Papelería" },
    { id: 8, code: "DEP", name: "Deportes" },
    { id: 9, code: "BEL", name: "Belleza y Cuidado Personal" },
    { id: 10, code: "TEC", name: "Tecnología" },
    { id: 11, code: "MUE", name: "Muebles" },
    { id: 12, code: "AUT", name: "Automóviles y Accesorios" },
    { id: 13, code: "MUS", name: "Música y Entretenimiento" },
    { id: 14, code: "OTR", name: "Otros" },
  ],

  countries: [
    {
      code: "US",
      country: "Estados Unidos",
      providers: [
        { code: "P&G", name: "Procter & Gamble Co." },
        { code: "COKE", name: "The Coca-Cola Company" },
        { code: "PEPSI", name: "PepsiCo Inc." },
        { code: "JNJ", name: "Johnson & Johnson" },
        { code: "K-C", name: "Kimberly-Clark Corporation" },
        { code: "KELLOGG", name: "Kellogg Company" },
      ],
    },
    {
      code: "NL",
      country: "Países Bajos",
      providers: [
        { code: "UNILEVER", name: "Unilever" },
        { code: "HEINEKEN", name: "Heineken N.V." },
      ],
    },
    {
      code: "CH",
      country: "Suiza",
      providers: [{ code: "NESTLE", name: "Nestlé S.A." }],
    },
    {
      code: "FR",
      country: "Francia",
      providers: [
        { code: "LOREAL", name: "L'Oréal S.A." },
        { code: "DANONE", name: "Danone S.A." },
        // Agrega más empresas de Francia aquí...
      ],
    },
    {
      code: "BE",
      country: "Bélgica",
      providers: [{ code: "ABINBEV", name: "Anheuser-Busch InBev NV/SA" }],
    },
  ],

  dummyTask: [
    {
      id: "1",
      creationDate: "2023/07/20",
      description: "BEBES",
      campaign: { id: 1, event: "Navidad 2024", description: "" },
      supplier: { code: "K-C", name: "Kimberly-Clark Corporation"},
      country: { code: "US", country: "Estados Unidos" },
    },
  ],
};

export { COMEX };
