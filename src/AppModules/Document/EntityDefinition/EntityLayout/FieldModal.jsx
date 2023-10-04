import React, { useEffect, useState } from "react";
import { Button, Group, Modal, TextInput, Select, Checkbox, Stack } from "@mantine/core";
import { WIDGETS } from "../../../../Constants/DOCUMENTS";
import { findAllDataSource } from "../../../../DataAccess/DataSource";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { useContext } from "react";
import { EntityLayoutContext } from "../Context";

const FieldModal = ({ opened, close, onCreate }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { selectedField } = useContext(EntityLayoutContext);
  const [dataSources, setDataSources] = useState(false);
  const [relatedField, setRelatedField] = useState(false);

  const getData = async () => {
    const params = { token: user.token };

    let ret = await findAllDataSource(params);
    setDataSources(
      ret.map((p) => {
        return { value: p.id, label: p.name };
      })
    );
  };

  useEffect(() => {
    const f = async () => {
      if (selectedField) {
        form.setFieldValue("name", selectedField.name ? selectedField.name : "");
        form.setFieldValue("label", selectedField.label ? selectedField.label : "");
        form.setFieldValue("description", selectedField.description ? selectedField.description : "");
        form.setFieldValue("required", selectedField.required === "true" ? true : false);
        form.setFieldValue("type", selectedField.type);
        form.setFieldValue("datasourceId", selectedField.datasourceId);
        form.setFieldValue("relatedFieldId", selectedField.relatedFieldId);
        form.setFieldValue("defatultValue", selectedField.defatultValue ? selectedField.defatultValue : "");
        // form.setFieldValue("row", selectedField.defatultValue);
        // form.setFieldValue("id", selectedField.id);
      }
    };

    if (opened && selectedField) {
      f();
    }
    if (opened && !selectedField) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  useEffect(() => {
    getData();
  }, [user]);

  const [widgets] = useState(
    WIDGETS.filter((p) => !p.hidden).map((p) => {
      return { value: p.name, label: p.name };
    })
  );

  const form = useForm({
    initialValues: {
      label: "",
      description: "",
      name: "",
      type: "",
      required: false,
      datasourceId: "",
      relatedFieldId: "",
      defatultValue: "",
      // id: null,
      // row: null,
    },

    validate: {
      label: (val) => (val ? null : t("validation.required")),
      name: (val) => (val ? null : t("validation.required")),
      type: (val) => (val ? null : t("validation.required")),
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
        checked={form.getInputProps(field).value}
        onChange={(event) => {
          form.setFieldValue(field, event.currentTarget.checked);
        }}
      />
    );

    return ret;
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={selectedField ? t("document.field.title.update") : t("document.field.title.create")}
      size={"md"}
    >
      <Stack spacing={"xs"}>
        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            const obj = { ...values };

            if (selectedField?.id) {
              obj.id = selectedField.id;
            } else {
              obj.id = null;
            }

            if (selectedField?.row) {
              obj.row = selectedField.row;
            } else {
              obj.row = null;
            }

            onCreate(obj);
          })}
        >
          <Group mb={"md"} grow>
            {createTextField("name")}
          </Group>

          <Group mb={"md"} grow>
            {createTextField("label")}
          </Group>

          <Group mb={"md"} grow>
            {createTextField("description")}
          </Group>

          <Group mb={"md"} grow>
            {createCheck("required")}
          </Group>

          <Group mb={"md"} grow>
            {createSelect("type", widgets)}
            {createTextField("defaultValue")}
          </Group>
          <Group mb={"md"} grow>
            {createSelect("datasourceId", dataSources)}
          </Group>
          <Group mb={"md"} grow>
            {createSelect("relatedFieldId", relatedField)}
          </Group>

          {/* <Group mb={"md"} grow>
            {createSelect("entity", entities)}
          </Group> */}

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
