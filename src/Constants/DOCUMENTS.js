import uuid from "react-uuid";

const DOCUMENTS = {
  entityDefinition: [
    {
      id: uuid(),
      name: "RECAP",
      description: "Datos necesarios para crear un RECAP de importaciones",
      fields: [
        { id: uuid(), name: "name", description: "Nombre del evento", type:1, required: true, widget: 1, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "campaign", description: "Campaña", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "supplier", description: "Proveedor", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "originCountry", description: "Pais origen", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "destinationCountry", description: "Pais destino", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "originShippingPort", description: "Puerto origen", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "destinationShippingPort", description: "Puerto destino", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "importationType", description: "Tipo de importacion", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "productionTime", description: "Tiempo de produccion", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "incoterm", description: "Incoterm", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "currency", description: "Moneda", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "status", description: "Estado", type:4, required: true, widget: 4 },
        { id: uuid(), name: "paymentTerms", description: "Terminos de pago", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "department", description: "Departamento", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "transportType", description: "Tipo de transporte", type:4, required: true, widget: 4, dataSourceId:null, relatedFieldId:null, defatultValue:null },
      ],
    },
    {
      id: uuid(),
      name: "Producto",
      description: "Datos necesarios para la definicion de un producto a importar",
      fields: [
        { id: uuid(), name: "sku", description: "Codigo", type:1, required: true, widget: 1, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "description", description: "Descripcion", type:1, required: true, widget: 1, dataSourceId:null, relatedFieldId:null, defatultValue:null },
        { id: uuid(), name: "quantity", description: "Candidad", type:3, required: true, widget: 2, dataSourceId:null, relatedFieldId:null, defatultValue:null },
      ],
    },
  ],
  dataSource: [
    { id: uuid(), name: "Paises", description: "Lista de paises origen de productos importados" },
    { id: uuid(), name: "Puertos Origen", description: "Lista de puertos origen segun pais de fabricacion" },
    { id: uuid(), name: "Puertos Destino", description: "Lista de puertos destino para importacines" },
  ],

  formDefinition: [{ id: uuid(), name: "RECAP", description: "Documento para importaciones" }],

  relations: [
    { id: uuid(), value: "uno a uno" },
    { id: uuid(), name: "uno a muchos" },
  ],
};

export { DOCUMENTS };
