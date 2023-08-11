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

  currencies: [
    { id: 1, name: "DOLLAR", code: "USD" },
    { id: 2, name: "YUAN", code: "YUA" },
  ],

  status: [
    { id: "EDITING", name: "EN_EDICION" },
    { id: "FINISHED", name: "TERMINADA" },
  ],

  transportType: [
    { id: "SEA_TRANSPORT", name: "SEA TRANSPORT" },
    { id: "AIR_TRANSPORT", name: "AIR TRANSPORT" },
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

  modalities: [
    { id: 1, code: "OC", name: "Oficina de credito" },
    { id: 2, code: "ID", name: "Importacion directa" },
  ],

  factories: [
    { ID: 1, code: "FOXCONN", name: "Foxconn Technology Group" },
    { ID: 2, code: "HUAWEI", name: "Huawei Technologies Co., Ltd." },
    { ID: 3, code: "WINGTECH", name: "Wingtech Technology Co., Ltd." },
    { ID: 4, code: "HONHAI", name: "Hon Hai Precision Industry Co., Ltd. (Foxconn)" },
    { ID: 5, code: "BYD", name: "BYD Company Limited" },
    { ID: 6, code: "LENOVO", name: "Lenovo Group Limited" },
    { ID: 7, code: "ZTE", name: "ZTE Corporation" },
    { ID: 8, code: "XIAOMI", name: "Xiaomi Corporation" },
    { ID: 9, code: "OPPO", name: "Guangdong Oppo Mobile Telecommunications Corp., Ltd." },
    { ID: 10, code: "VIVO", name: "Vivo Communication Technology Co., Ltd." },
  ],

  paymentTerms: [
    { ID: 1, code: "LC", name: "Carta de Crédito" },
    { ID: 2, code: "TT", name: "Transferencia Telegráfica" },
    { ID: 3, code: "CAD", name: "Contra Reembolso" },
    { ID: 4, code: "DA", name: "Aceptación Diferida" },
    { ID: 5, code: "OA", name: "Órdenes de Pago" },
    { ID: 6, code: "CH", name: "Cheque" },
    { ID: 7, code: "R/A", name: "Remesa Aceptada" },
    { ID: 8, code: "Otro", name: "Otro" },
  ],

  shippingPorts: [
    { ID: 1, code: "SHANGHAI", name: "Puerto de Shanghái" },
    { ID: 2, code: "NINGBO", name: "Puerto de Ningbo-Zhoushan" },
    { ID: 3, code: "SHENZHEN", name: "Puerto de Shenzhen" },
    { ID: 4, code: "QINGDAO", name: "Puerto de Qingdao" },
    { ID: 5, code: "GUANGZHOU", name: "Puerto de Guangzhou" },
    { ID: 6, code: "TIANJIN", name: "Puerto de Tianjin" },
    { ID: 7, code: "DALIAN", name: "Puerto de Dalian" },
    { ID: 8, code: "XIAMEN", name: "Puerto de Xiamen" },
    { ID: 9, code: "HONGKONG", name: "Puerto de Hong Kong" },
    { ID: 10, code: "WUHAN", name: "Puerto de Wuhan" },
  ],

  productionTimes: [
    { ID: 1, code: "ELEC", name: "Electrónica", value: "3-4 semanas" },
    { ID: 2, code: "TEXT", name: "Textiles", value: "2-3 semanas" },
    { ID: 3, code: "MOB", name: "Mobiliario", value: "4-6 semanas" },
    { ID: 4, code: "AUTOP", name: "Autopartes", value: "2-3 semanas" },
    { ID: 5, code: "JUG", name: "Juguetes", value: "2 semanas" },
    { ID: 6, code: "EQUIP", name: "Equipo médico", value: "6-8 semanas" },
    { ID: 7, code: "CALZ", name: "Calzado", value: "1-2 semanas" },
    { ID: 8, code: "ACC", name: "Accesorios de moda", value: "2-3 semanas" },
    { ID: 9, code: "HOG", name: "Artículos para el hogar", value: "3-4 semanas" },
    { ID: 10, code: "JOY", name: "Joyas", value: "3-4 semanas" },
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
      supplier: { code: "K-C", name: "Kimberly-Clark Corporation" },
      country: { code: "US", country: "Estados Unidos" },
    },
  ],
};

export { COMEX };
