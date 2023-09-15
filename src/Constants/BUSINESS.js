import { arrayToMap } from "../Util";

const BUSINESS = {
  list: [
    // {
    //   id: uuid(),
    //   name: "Proceso de Importacion",
    //   description: "Especifica el proceso de importacion de productos",
    //   status: "ACTIVO",
    //   stages: [
    //     {
    //       id: uuid(),
    //       name: "Stage 01",
    //       actions: [
    //         {
    //           id: uuid(),
    //           name: "Action 01",
    //           tasks: [{ id: uuid(), name: "Task 01" }],
    //         },
    //       ],
    //     },
    //   ],
    //   parameters: [
    //     {
    //       id: uuid(),
    //       name: "N_ORDER",
    //       description: "Nunero de Orden de compra",
    //       type: 1,
    //     },
    //   ],
    // },
    {
      id: "8a4f42a0-ad01-ff86-01c5-2b7581868995",
      name: "Proceso de Importacion",
      description: "Especifica el proceso de importacion de productos",
      status: "ACTIVO",
      stages: [
        {
          id: "1afaadce-4371-f96b-9c63-352bb77205be",
          name: "DEFINICION DE COMPRA",
          actions: [
            {
              id: "22929a1f-7450-a10b-a87e-27247f0c4d45",
              name: "RECAP (COMPRAS)",
              tasks: [
                {
                  id: "82845586-19d2-aedd-a0a9-732f4f1df376",
                  name: "CONFECCIONAR RECAP",
                },
              ],
            },
            {
              id: "d47d12a6-aff7-6f63-c64e-807ee76871ab",
              name: "ANALISIS (PLANIFICACION)",
              tasks: [
                {
                  id: "ff1fc76d-5768-8032-c2e1-491f6da0355d",
                  name: "ANALIZAR",
                },
              ],
            },
            {
              id: "2b723808-91b4-df9a-6de9-0087a3cb8bb2",
              name: "ANALISIS (REAPRO)",
              tasks: [
                {
                  id: "d0ad7e4d-baaa-e582-4747-9870877b2b9c",
                  name: "ANALIZAR",
                },
              ],
            },
            {
              id: "cdb91744-464e-51c8-cc0b-64bf87078a25",
              name: "ANALISIS (COMEX)",
              tasks: [
                {
                  id: "ee359505-eed6-9090-ebdb-845c11c3f971",
                  name: "ANALIZAR",
                },
              ],
            },
          ],
        },
        {
          id: "be12f6cd-d079-dffe-443c-0a5692d55791",
          name: "ADQUISICION",
          actions: [
            {
              id: "d9f37eee-4313-054c-5922-523e81abcd2d",
              name: "DOCUMENTACION ENTRANTE",
              tasks: [
                {
                  id: "1a6ec804-6cb6-cd46-2eec-e1a076ca28f9",
                  name: "TRAMITAR FT Y FP",
                },
              ],
            },
            {
              id: "8d859ea8-442b-db15-8432-3ad41279ffc7",
              name: "CLASIFICACION",
              tasks: [
                {
                  id: "2945d18b-bccf-f13e-bf72-37264b627ba5",
                  name: "TRAMITAR CLASIFICACION",
                },
              ],
            },
            {
              id: "06d18b89-4df2-56c9-f8b2-421e4092fea8",
              name: "ORDEN DE COMPRA",
              tasks: [
                {
                  id: "369aa8e3-7f48-46af-e373-d4b3f9cac722",
                  name: "CREAR OC",
                },
              ],
            },
            {
              id: "d92ba74b-9a59-2e68-6969-d547ea9949eb",
              name: "DOCUMENTACION SALIENTE",
              tasks: [
                {
                  id: "2f42dfe4-12e4-b2f5-a01c-656c2176c977",
                  name: "TRAMITAR SIRA",
                },
                {
                  id: "b93cb304-cbeb-9c0e-3e76-aa597943eac4",
                  name: "ENVIAR ARTES",
                },
                {
                  id: "b2cd8efc-63f2-2191-c4b4-63d87c864a20",
                  name: "ENVIAR ETIQUETAS",
                },
              ],
            },
            {
              id: "1f808527-3b2a-a8c4-bc2d-ef4f1b0915f9",
              name: "PAGO",
              tasks: [
                {
                  id: "3072a7ec-0b5d-efdd-fe81-a9349e138e40",
                  name: "ABRIR CDC",
                },
              ],
            },
            {
              id: "97ddb270-11c6-c258-947d-0e7d0c1b0443",
              name: "PRODUCCION",
              tasks: [
                {
                  id: "07dc2026-197a-bcd6-3487-8dc13a4af4fb",
                  name: "PRODUCIR",
                },
              ],
            },
          ],
        },
        {
          id: "d2df1175-7a04-6b7f-6e52-3167ef96a8db",
          name: "RECEPCION",
          actions: [],
        },
        {
          id: "a42cebae-4bfa-d79c-068b-57bfbbcd8594",
          name: "DISTRIBUCION",
          actions: [],
        },
        {
          id: "059fe3c0-dd91-2bdf-b1b4-b8149a72e2c4",
          name: "EXHIBICION EN TIENDA",
          actions: [],
        },
      ],
      parameters: [
        {
          id: "71ef76d0-2a39-b7cf-b593-1473a1ef9557",
          name: "N_ORDER",
          description: "Nunero de Orden de compra",
          type: 1,
        },
      ],
    },
  ],
};

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
  { id: 6, name: "Upload image" },
  { id: 7, name: "Upload document" },
];

const WIDGETS_NAMES_BY_ID = arrayToMap(WIDGETS);

const SPRINTS = [
  { id: 1, name: "Def. Surtido" },
  { id: 2, name: "Ejec. Compra" },
  { id: 3, name: "Recepcion" },
  { id: 4, name: "Distribucion" },
  { id: 5, name: "Venta" },
];
export { BUSINESS, PARAMETERS_TYPE, SPRINTS, WIDGETS, WIDGETS_NAMES_BY_ID, PARAMETERS_TYPE_NAMES_BY_ID };
