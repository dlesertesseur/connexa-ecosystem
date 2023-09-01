import React from "react";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

const StageSettings = ({ open, close, updateNode, node }) => {
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: "",
      role:""
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      //role: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    form.setFieldValue("name", node.data.label);
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

  const updateTask = (values) => {
    updateNode(values);
    close();
  };

  return (
    <Modal
      size={"lg"}
      opened={open}
      onClose={() => {
        close();
      }}
      title={node?.data.label}
      centered
    >
      <Stack w={"100%"} spacing={"xs"}>
        <form
          onSubmit={form.onSubmit((values) => {
            updateTask(values);
          })}
        >
          <Group mt={"xs"} grow>
            {createTextField("name")}
          </Group>
          {/* <Group mt={"xs"}>{createTextField("code")}</Group> */}

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

export default StageSettings;
