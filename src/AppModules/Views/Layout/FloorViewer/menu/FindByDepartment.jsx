
import { Select } from "@mantine/core";
import React from "react";

const FindByDepartment = () => {
  return (
    <Select
      label="Select a department"
      placeholder="a departmento"
      data={[
        { value: "AL", label: "ALMACEN" },
        { value: "BE", label: "BEBIDAS CON ALCHOOL" },
        { value: "BS", label: "BEBIDAS SIN ALCHOOL" },
        { value: "LI", label: "LIMPIEZA" },
        { value: "PF", label: "PERFUMERIA" },
        { value: "EL", label: "ELECTRO" },
      ]}
    />
  );
};

export default FindByDepartment;
