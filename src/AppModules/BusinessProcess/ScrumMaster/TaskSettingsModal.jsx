import React from "react";
import {
  Button,
  Grid,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,

} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { config } from "../../../Constants/config";

const TaskSettingsModal = ({ open, close, updateNode, node }) => {
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      role: "",
      duration: 1,
    },

    validate: {},
  });

  const getData = async () => {
    form.setFieldValue("name", node.data.label);
    form.setFieldValue("description", node.data.description);

    if (node.data.role) {
      form.setFieldValue("role", node.data.role.name);
    } else {
      form.setFieldValue("role", null);
    }

    form.setFieldValue("duration", node.data.duration);
    form.setFieldValue("status", node.data.status.toLowerCase());
  };

  useEffect(() => {
    if (node && open) {
      getData();
    }
  }, [open]);

  const createTextValue = (field) => {
    const ret = (
      <Stack spacing={2}>
        <Text size={"sm"} weight={500}>{t("businessProcessModel.label." + field)}</Text>
        <Paper withBorder p={6} bg={"gray.1"}>
          <Text size={"sm"} mih={24}>{form.getInputProps(field).value ? form.getInputProps(field).value : ""}</Text>
        </Paper>
      </Stack>
    );

    return ret;
  };

  const createSelectField = (field) => {
    const list = config.taskStatuses.map((c) => {
      return { value: c, label: t(`taskStatuses.${c}`) };
    });
    const ret = (
      <Select label={t("businessProcessModel.label." + field)} data={list ? list : []} {...form.getInputProps(field)} />
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
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            updateTask(values);
          })}
        >
          <Group mt={"xs"} grow>
            {createTextValue("name")}
          </Group>

          <Group mt={"xs"} grow>
            {createTextValue("description")}
          </Group>

          <Grid mt={"xs"}>
            <Grid.Col span={6}>
              {createTextValue("role")}
            </Grid.Col>
            <Grid.Col span={6}>{createNumberField("duration")}</Grid.Col>
          </Grid>

          <Group mt={"xs"} grow>
            {createSelectField("status")}
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

export default TaskSettingsModal;
