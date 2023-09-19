import React, { useEffect, useState } from "react";
import { Button, Group, Modal, TextInput, Select, Checkbox, Stack } from "@mantine/core";
import { PARAMETERS_TYPE, WIDGETS } from "../../../../Constants/DOCUMENTS";
import { findAllDataSource } from "../../../../DataAccess/DataSource";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { useContext } from "react";
import { EntityLayoutContext } from "../Context";

const FieldModal = ({ opened, close, onCreate }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [dataSources, setDataSources] = useState(false);
  const [relatedField, setRelatedField] = useState(false);

  const { selectedField } = useContext(EntityLayoutContext);

  const getData = async () => {
    const params = { token: user.token };

    let ret = await findAllDataSource(params);
    setDataSources(
      ret.map((p) => {
        return { value: p.id, label: p.name };
      })
    );

    // const filterRows = rows.filter((r) => r.widget === "Select");
    // ret = filterRows.map((r) => {
    //   return { value: r.id, label: r.name };
    // });
    // setRelatedField(ret);
  };

  useEffect(() => {
    const f = async () => {
      if (selectedField) {
        form.setFieldValue("name", selectedField.name);
        form.setFieldValue("description", selectedField.description);
        form.setFieldValue("type", selectedField.type);
        form.setFieldValue("required", selectedField.required);
        form.setFieldValue("widget", selectedField.widget);
        form.setFieldValue("dataSourceId", selectedField.dataSourceId);
        form.setFieldValue("relatedFieldId", selectedField.relatedFieldId);
        form.setFieldValue("defatultValue", selectedField.defatultValue);
        form.setFieldValue("id", selectedField.id);
        form.setFieldValue("row", selectedField.row);
      }
    };
    if (opened && selectedField) {
      f();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  useEffect(() => {
    getData();
  }, [user]);

  const [fieldType] = useState(
    PARAMETERS_TYPE.map((p) => {
      return { value: p.id, label: p.name };
    })
  );

  const [widgets] = useState(
    WIDGETS.map((p) => {
      return { value: p.id, label: p.name };
    })
  );

  const form = useForm({
    initialValues: {
      description: "",
      name: "",
      type: "",
      required: false,
      widget: "",
      dataSourceId: "",
      relatedFieldId: "",
      defatultValue: "",
      id: null,
      row: null,
    },

    validate: {
      description: (val) => (val ? null : t("validation.required")),
      name: (val) => (val ? null : t("validation.required")),
      type: (val) => (val ? null : t("validation.required")),
      widget: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("document.field.label." + field)}
        placeholder={t("document.field.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelect = (field, data) => {
    const ret = (
      <Select
        label={t("document.field.label." + field)}
        data={data ? data : []}
        placeholder={t("document.field.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createCheck = (field) => {
    const ret = (
      <Checkbox
        label={t("document.field.label." + field)}
        placeholder={t("document.field.placeholder." + field)}
        checked={ form.getInputProps(field).value}
        onChange={(event) => {
          form.setFieldValue(field, event.currentTarget.checked);
        }}
      />
    );

    return ret;
  };

  return (
    <Modal opened={opened} onClose={close} title={t("document.field.title.create")} size={"xl"}>
      <Stack spacing={"xs"}>
        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
            form.reset();
          })}
        >
          <Group mb={"md"} grow>
            {createTextField("name")}
          </Group>

          <Group mb={"md"} grow>
            {createTextField("description")}
          </Group>

          <Group mb={"md"} grow>
            {createCheck("required")}
          </Group>

          <Group mb={"md"} grow>
            {createSelect("type", fieldType)}
            {createSelect("widget", widgets)}
          </Group>
          <Group mb={"md"} grow>
            {createSelect("dataSource", dataSources)}
            {createSelect("relatedFieldId", relatedField)}
          </Group>

          <Group mb={"md"} grow>
            {createTextField("defaultValue")}
          </Group>
          <Group position="right">
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={() => {
                close();
                form.reset();
              }}
            >
              {t("button.cancel")}
            </Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
};

export default FieldModal;
