import uuid from "react-uuid";

const DOCUMENTS = {
  entityDefinition: [
    { id: uuid(), name: "RECAP", description: "Datos necesarios para crear un RECAP de importaciones", fields: [] },
    {
      id: uuid(),
      name: "Producto",
      description: "Datos necesarios para la definicion de un producto a importar",
      fields: [],
    },
  ],
  dataSource: [
    { id: uuid(), name: "Paises", description: "Lista de paises origen de productos importados" },
    { id: uuid(), name: "Puertos Origen", description: "Lista de puertos origen segun pais de fabricacion" },
    { id: uuid(), name: "Puertos Destino", description: "Lista de puertos destino para importacines" },
  ],

  formDefinition: [{ id: uuid(), name: "RECAP", description: "Documento para importaciones" }],
};

export { DOCUMENTS };
