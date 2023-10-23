import React from "react";
import {
  Button,
  Grid,
  Group,
  Modal,
  Select,
  Stack,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import { useEffect } from "react";

const FinalTaskSettings = ({ open, close, updateNode, node }) => {
  const { t } = useTranslation();
  const { roles } = useContext(AbmStateContext);
  const [data, setData] = useState(null);

  const form = useForm({
    initialValues: {
      role: ""
    },

    validate: {},
  });

  useEffect(() => {
    const ret = roles.map((r) => {
      const reg = { value: r.role.id, label: `${r.role.name} (${r.role.groupName})` };
      return reg;
    });
    setData(ret);
  }, [roles]);

  const getData = async () => {
    form.setFieldValue("name", node.data.label);
    if (node.data.role) {
      form.setFieldValue("role", node.data.role.id);
    } else {
      form.setFieldValue("role", null);
    }
  };

  useEffect(() => {
    if (node && open) {
      getData();
    }
  }, [open]);

  // const createTextField = (field, disabled = false) => {
  //   const ret = (
  //     <TextInput
  //       disabled={disabled}
  //       label={t("businessProcessModel.label." + field)}
  //       placeholder={t("businessProcessModel.placeholder." + field)}
  //       {...form.getInputProps(field)}
  //     />
  //   );

  //   return ret;
  // };

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
          {/* <Group mt={"xs"} grow>
            {createTextField("name")}
          </Group> */}

          <Grid mt={"xs"}>
            <Grid.Col>
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

export default FinalTaskSettings;
