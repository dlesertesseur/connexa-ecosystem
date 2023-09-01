import React from "react";
import { Button, Grid, Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useContext } from "react";
import { EditorStateContext } from "../Context";
import { useEffect } from "react";

const TaskSettings = ({ open, close, updateNode, node }) => {
  const { t } = useTranslation();
  const { roles } = useContext(EditorStateContext);
  const [data, setData] = useState(null);

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
    if(node.data.role){
      form.setFieldValue("role", node.data.role.id);
    }else{
      form.setFieldValue("role", null);
    }

    const ret = roles.map((r) => {
      const reg = { value: r.role.id, label: `${r.role.name} (${r.role.groupName})` };
      return reg;
    });
    setData(ret);
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

          <Grid mt={"xs"}>
            <Grid.Col span={6}>
              <Select
                label={t("businessProcessModel.label.rolesList")}
                placeholder={t("businessProcessModel.placeholder.role")}
                data={data}
                {...form.getInputProps("role")}
              />
            </Grid.Col>
          </Grid>
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

export default TaskSettings;
