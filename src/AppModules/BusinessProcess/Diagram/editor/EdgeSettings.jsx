import React, { useState } from "react";
import { Button, Group, Modal, Stack, Switch, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

const EdgeSettings = ({ open, close, updateEdge, edge }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
    },

    validate: {
      //name: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    form.setFieldValue("name", edge.label);
    setChecked(edge.data.bidirectional);
  };

  useEffect(() => {
    if (edge && open) {
      getData();
    }
  }, [open]);

  const createTextField = (field, disabled = false) => {
    const ret = (
      <TextInput
        disabled={disabled}
        label={t("businessProcessModel.label." + field)}
        placeholder={t("businessProcessModel.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  return (
    <Modal
      size={"md"}
      opened={open}
      onClose={() => {
        close();
      }}
      title={edge?.label ? edge.label : t("businessProcessModel.title.connectorProperties")}
      centered
    >
      <Stack w={"100%"} spacing={"xs"}>
        <form
          onSubmit={form.onSubmit((values) => {
            updateEdge({...values, bidirectional:checked});
            close();
          })}
        >
          <Group mt={"xs"} grow>
            {createTextField("name")}
          </Group>

          <Group mt={"sm"}>
            <Switch
              labelPosition="left"
              label={t("businessProcessModel.label.bidirectionalConnection")}
              checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)}
            />
          </Group>

          <Group position="right" mt={"xl"}>
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={() => {
                close();
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

export default EdgeSettings;
