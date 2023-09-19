import uuid from "react-uuid";
import { arrayToMap } from "../Util";

const PARAMETERS_TYPE = [
  { id: 1, name: "String" },
  { id: 2, name: "Numeric" },
  { id: 3, name: "Boolean" },
  { id: 4, name: "UUID" },
];

const PARAMETERS_TYPE_NAMES_BY_ID = arrayToMap(PARAMETERS_TYPE);

const WIDGETS = [
  { id: 1, name: "TextInput" },
  { id: 2, name: "TextArea" },
  { id: 3, name: "NumberInput" },
  { id: 4, name: "Select" },
  { id: 5, name: "CheckBox" },
  { id: 6, name: "Entity list" },
  { id: 7, name: "Upload image" },
  { id: 8, name: "Upload document" },
];

const WIDGETS_NAMES_BY_ID = arrayToMap(WIDGETS);

const DOCUMENTS = {
  entityDefinition: [
    {
      id: "3ae4cf58-f06a-b353-2168-a6e27a19e7af",
      name: "RECAP",
      description: "Datos necesarios para crear un RECAP de importaciones",
      size: "md",
      fields: [
        {
          id: "8e883779-7cf7-6aee-8d7b-0355a07b7e82",
          name: "name",
          description: "Nombre del evento",
          type: 1,
          required: true,
          widget: 1,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 0,
          order: 0,
        },
        {
          id: "5c38ee9c-0d47-e549-0688-3440c68f4b24",
          name: "campaign",
          description: "Campaña",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 1,
          order: 0,
        },
        {
          id: "5c84e574-9d33-63b8-01e2-b81d813638de",
          name: "supplier",
          description: "Proveedor",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 2,
          order: 0,
        },
        {
          id: "e9ea9197-2f9c-a7c1-bee3-4eea9c9635e1",
          name: "originCountry",
          description: "Pais origen",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 3,
          order: 0,
        },
        {
          id: "078fa7c6-be48-de92-bfe0-157320189156",
          name: "destinationCountry",
          description: "Pais destino",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 4,
          order: 0,
        },
        {
          id: "46d4632b-4c8d-fb71-93b3-0f7096e7496f",
          name: "originShippingPort",
          description: "Puerto origen",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 5,
          order: 0,
        },
        {
          id: "93247141-6b18-c4e0-dbd2-5fddc8ab3c5d",
          name: "destinationShippingPort",
          description: "Puerto destino",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 6,
          order: 0,
        },
        {
          id: "b4dd447a-d996-475e-9e39-604203bebf17",
          name: "importationType",
          description: "Tipo de importacion",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 7,
          order: 0,
        },
        {
          id: "2790ff66-5875-d02a-6cb5-30192a27650c",
          name: "productionTime",
          description: "Tiempo de produccion",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 8,
          order: 0,
        },
        {
          id: "c6554c2a-e7b9-04b0-b5fc-ad2e93478298",
          name: "incoterm",
          description: "Incoterm",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 9,
          order: 0,
        },
        {
          id: "d0c1c86e-dc3c-c1d5-aa3e-cf226fb479f0",
          name: "currency",
          description: "Moneda",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 10,
          order: 0,
        },
        {
          id: "2df5bf35-094e-7802-6036-6fe8dca0b6ac",
          name: "status",
          description: "Estado",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 11,
          order: 0,
        },
        {
          id: "ed203c53-7b72-01ff-99b3-3ff6105e66be",
          name: "paymentTerms",
          description: "Terminos de pago",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 12,
          order: 0,
        },
        {
          id: "35e404ed-fd65-8dff-8ee0-18639191921d",
          name: "department",
          description: "Departamento",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 13,
          order: 0,
        },
        {
          id: "69a68793-91a4-f981-9dad-25b058f1b441",
          name: "transportType",
          description: "Tipo de transporte",
          type: 4,
          required: true,
          widget: 4,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 14,
          order: 0,
        },
      ],
    },
    {
      id: "0357dd97-dba8-ff11-9b01-2880ba511cb6",
      name: "Producto",
      description: "Datos necesarios para la definicion de un producto a importar",
      size: "xl",
      fields: [
        {
          id: "fdbb0ece-9a9c-d0d6-dfe3-70adf09f46ee",
          name: "sku",
          description: "Codigo",
          type: 1,
          required: true,
          widget: 1,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 0,
          order: 0,
        },
        {
          id: "9e370ff6-987d-d31d-7e85-d31594003e9f",
          name: "description",
          description: "Descripcion",
          type: 1,
          required: true,
          widget: 1,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 1,
          order: 0,
        },
        {
          id: "2d821acc-4572-553a-ae5b-9e01de08d06e",
          name: "quantity",
          description: "Candidad",
          type: 3,
          required: true,
          widget: 2,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 2,
          order: 0,
        },
      ],
    },
    {
      id: "0357dd97-dba8-ff11-9b01-2880ba511cb9",
      name: "Proveedor",
      description: "Datos necesarios para la definicion de un proveedor",
      size: "md",
      fields: [
        {
          id: "fdbb0ece-9a9c-d0d6-dfe3-70adf09f46ee",
          name: "sku",
          description: "Codigo",
          type: 1,
          required: true,
          widget: 1,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 0,
          order: 0,
        },
        {
          id: "9e370ff6-987d-d31d-7e85-d31594003e9f",
          name: "description",
          description: "Descripcion",
          type: 1,
          required: true,
          widget: 1,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          row: 1,
          order: 0,
        },
        {
          description: "Candidad",
          name: "quantity",
          type: 3,
          required: true,
          widget: 3,
          dataSourceId: null,
          relatedFieldId: null,
          defatultValue: null,
          id: "2d821acc-4572-553a-ae5b-9e01de08d06e",
          row: 2,
          order: 0,
        },
        {
          description: "Observacion",
          name: "note",
          type: 1,
          required: false,
          widget: 2,
          dataSourceId: "",
          relatedFieldId: "",
          defatultValue: "",
          id: "4ceb8cc8-5976-1a27-d3a5-a004e30c7860",
          row: 3,
          order: 0,
        },
      ],
    },
  ],

  dataSource: [
    { id: uuid(), name: "Paises", description: "Lista de paises origen de productos importados" },
    { id: uuid(), name: "Puertos Origen", description: "Lista de puertos origen segun pais de fabricacion" },
    { id: uuid(), name: "Puertos Destino", description: "Lista de puertos destino para importacines" },
  ],

  formDefinition: [
    {
      id: uuid(),
      name: "RECAP",
      description: "Documento para importaciones",
      sections: [
        {
          name: "Cabecera de RECAP",
          entity: "3ae4cf58-f06a-b353-2168-a6e27a19e7af",
          relation: 1,
          id: "0b3329c3-b464-240a-41eb-31978ce3d524",
        },
        {
          name: "Lista de productos",
          entity: "0357dd97-dba8-ff11-9b01-2880ba511cb6",
          relation: 2,
          id: "6388bef0-95e9-8ddf-754f-0d637e5ba87d",
        },
      ],
    },
  ],

  relations: [
    { id: 1, name: "FOMULARIO" },
    { id: 2, name: "LISTA" },
  ],
};

export { WIDGETS, WIDGETS_NAMES_BY_ID, PARAMETERS_TYPE, PARAMETERS_TYPE_NAMES_BY_ID, DOCUMENTS };
