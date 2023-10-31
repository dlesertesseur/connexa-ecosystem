import React from "react";
import { Button, Group, Modal, NumberInput, Stack, TextInput, Textarea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

const SprintSettingsModal = ({ open, close, updateNode, node }) => {
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: "",
      sprintNumber:null,
      duration:null,
      description: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      sprintNumber: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    form.setFieldValue("name", node.data.label);
    form.setFieldValue("duration", node.data.duration);
    form.setFieldValue("sprintNumber", node.data.sprintNumber);
  };

  useEffect(() => {
    if (node && open) {
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

  const createNumberField = (field) => {
    const ret = (
      <NumberInput
        label={t("businessProcessModel.label." + field)}
        placeholder={t("businessProcessModel.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createTextArea = (field, disabled = false) => {
    const ret = (
      <Textarea
        disabled={disabled}
        label={t("businessProcessModel.label." + field)}
        placeholder={t("businessProcessModel.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const updateTask = (values) => {
    updateNode(values);
    close();
  };

  return (
    <Modal
      size={"md"}
      opened={open}
      onClose={() => {
        close();
      }}
      title={node?.data.label}
      centered
    >
      <Stack w={"100%"} spacing={"xs"}>
        <form
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            updateTask(values);
          })}
        >
          <Group mt={"xs"} grow>
            {createTextField("name")}
          </Group>

          <Group mt={"xs"} grow>
            {createTextArea("description")}
          </Group>

          <Group mt={"xs"} grow>
            {createNumberField("sprintNumber")}
            {createNumberField("duration")}
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

export default SprintSettingsModal;
