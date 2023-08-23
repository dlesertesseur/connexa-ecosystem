import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import React from "react";
import { useForm } from "@mantine/form";

const TaskSettings = ({ open, close }) => {
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      description: "",
      name: "",
    },

    validate: {
      description: (val) => (val ? null : t("validation.required")),
      name: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field, disabled=false) => {
    const ret = (
      <TextInput
        disabled={disabled}
        label={t("businessProcess.label." + field)}
        placeholder={t("businessProcess.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  return (
    <Modal opened={open} onClose={close} title={t("businessProcess.title.taskSettings")} centered>
      <Stack w={"100%"} spacing={"xs"}>
        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          <Group grow>{createTextField("name", true)}</Group>
          <Group mt={"xs"} grow>{createTextField("description")}</Group>
          <Group mt={"xs"} >{createTextField("code")}</Group>
          <Group position="right" mt={"xl"}>
            <Button type="submit">{t("button.accept")}</Button>
            <Button onClick={close}>{t("button.cancel")}</Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
};

export default TaskSettings;
