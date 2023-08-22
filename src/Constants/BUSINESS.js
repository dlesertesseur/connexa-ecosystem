import uuid from "react-uuid";

const BUSINESS = {
  list: [
    {
      id: uuid(),
      name: "Proceso de Importacion",
      description: "Especifica el proceso de importacion de productos",
      status: "ACTIVO",
      stages: [
        {
          id: uuid(),
          name: "Stage 01",
          actions: [
            {
              id: uuid(),
              name: "Action 01",
              tasks: [{ id: uuid(), name: "Task 01" }],
            },
          ],
        },
      ],
      parameters: [
        {
          id: uuid(),
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
  { id: 3, name: "URL" },
  { id: 4, name: "UUID" },
  { id: 5, name: "JSON" },
];

export { BUSINESS, PARAMETERS_TYPE };
