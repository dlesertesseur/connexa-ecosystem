import React from "react";
import {
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

const CreateProcessInstanceDialog = ({ open, close, processModel, onCreate }) => {
  const { t } = useTranslation();
  
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
    },
  });

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

  useEffect(() => {
    if(open){
      form.reset();
    }
  }, [open])

  return (
    <Modal
      size={"lg"}
      opened={open}
      onClose={() => {
        close();
      }}
      title={processModel?.name}
      centered
    >
      <Stack w={"100%"} spacing={"xs"}>
        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          <Group mt={"xs"} grow>
            {createTextField("name")}
          </Group>
          <Group mt={"xs"} grow>
            {createTextField("description")}
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

export default CreateProcessInstanceDialog;
