import React, { useEffect, useState } from "react";
import { findEntityDefinitionById } from "../../../../DataAccess/EntityDefinition";
import { useSelector } from "react-redux";
import { Container } from "@mantine/core";
import CollectionFormPanel from "./CollectionFormPanel";
import ComponentFormPanel from "./ComponentFormPanel";

const FormPanel = ({ formId, collection }) => {
  const { user } = useSelector((state) => state.auth.value);
  const [formDefinition, setFormDefinition] = useState(null);
  const [options, setOptions] = useState(null);

  const getData = async () => {
    const params = { token: user.token, id: formId };
    const ret = await findEntityDefinitionById(params);

    try {
      const options = await JSON.parse(ret.options);
      setOptions(options);
    } catch (error) {
      console.log("error ->", error);
      setOptions({ size: "md" });
    }

    setFormDefinition(ret);
  };

  useEffect(() => {
    getData();
  }, [formId]);

  return (
    <Container size={options?.size} mb={"md"}>
      {collection ? <CollectionFormPanel form={formDefinition} /> : <ComponentFormPanel form={formDefinition} />}
    </Container>
  );
};

export default FormPanel;
