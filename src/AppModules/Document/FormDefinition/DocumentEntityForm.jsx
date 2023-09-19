import React, { useEffect } from "react";
import { Checkbox, Container, Group, NumberInput, ScrollArea, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { findEntityDefinitionById } from "../../../DataAccess/EntityDefinition";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import uuid from "react-uuid";

const DocumentEntityForm = ({ entityDef, height, onSubmitEntity }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [entity, setEntity] = useState();
  const [fieldsByRow, setFieldsByRow] = useState(null);
  const [rows, setRows] = useState(null);
  const [formConfig, setFormConfig] = useState({});
  
  const getData = async () => {
    const params = {
      token: user.token,
      id: entityDef.entity,
    };

    try {
      const entity = await findEntityDefinitionById(params);

      const fieldsByRow = new Map();

      entity.fields.forEach((field) => {
        const fields = fieldsByRow.get(field.row);
        if (fields !== undefined) {
          fieldsByRow.set(field.row, [...fields, field]);
        } else {
          fieldsByRow.set(field.row, [field]);
        }
      });
  
      setFieldsByRow(fieldsByRow);
      setEntity(entity);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (open) {
      getData();
    }
  }, [open]);

  const buildGroup = (group) => {
    const ret = (
      <Group key={uuid()} grow mb={"xs"}>
        {group?.map((f) => buildField(f))}
      </Group>
    );

    return ret;
  };

  const buildField = (field) => {
    let ret = null;
    const key = uuid();

    switch (field.widget) {
      case 1:
        ret = (
          <TextInput
            key={key}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 2:
        ret = (
          <Textarea
            key={key}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 3:
        ret = (
          <NumberInput
            key={key}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 4:
        ret = (
          <Select
            key={key}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            data={[]}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 5:
        ret = (
          <Checkbox
            key={key}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
    }
    return ret;
  };

  const buildForm = () => {
    const rows = entity?.fields?.map((f) => {
      const group = fieldsByRow.get(f.row);
      const ret = buildGroup(group);
      return ret;
    });

    setRows(rows);
  };

  const createInitialValues = (fields) => {
    const ret = {};
    fields?.forEach((p) => {
      const group = fieldsByRow.get(p.row);
      group?.forEach((f) => {
        ret[f.name] = (f.type === 1 || f.type === 2) ? "" : null;
      });
    });

    return ret;
  };

  const createValidations = (fields) => {
    const ret = {};

    fields?.forEach((p) => {
      const group = fieldsByRow.get(p.row);
      group?.forEach((f) => {
        if (f.required) {
          ret[f.name] = (val) => (val ? null : t("validation.required"));
        }
      });
    });
    return ret;
  };

  useEffect(() => {
    if (entity) {
      const config = {
        initialValues: createInitialValues(entity?.fields),
        validate: createValidations(entity?.fields),
      };
      setFormConfig(config);
    }
  }, [entity]);

  const form = useForm(formConfig);

  useEffect(()=>{
    if(formConfig){
      buildForm();
    }
  },[formConfig])

  return (
    <Container size={entity?.size}>
      <Stack spacing={"xs"}>
        {rows ? (
          <form
            onSubmit={form.onSubmit((values) => {
              onSubmitEntity(entity, values);
              form.reset();
            })}
          >
            <ScrollArea h={height}>{rows}</ScrollArea>
          </form>
        ) : null}
      </Stack>
    </Container>
  );
};

export default DocumentEntityForm;
