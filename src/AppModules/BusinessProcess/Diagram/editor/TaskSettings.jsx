import React from "react";
import {
  AlphaSlider,
  Button,
  Checkbox,
  Grid,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import { useEffect } from "react";
import { rgbaToHexAndAlpha } from "../../../../Util";
import { config } from "../../../../Constants/config";
import CustomColorPicker from "../../../../Components/CustomColorPicker";

const TaskSettings = ({ open, close, updateNode, node }) => {
  const { t } = useTranslation();
  const { roles, sprints } = useContext(AbmStateContext);
  const [data, setData] = useState(null);

  const form = useForm({
    initialValues: {
      name: "",
      role: "",
      color: "rgba(255,255,255,0.4)",
      alpha: "",
      borderColor: "rgba(0,0,0,0.99)",
      automatic: false,
      // applicationPath: "",
      serviceUrl: "",
      sprint: "",
      duration:1
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),

      // applicationPath: (val) => {
      //   let ret = val ? null : t("validation.required");
      //   if (!form.getInputProps("automatic").value) {
      //     ret;
      //   } else {
      //     ret = null;
      //   }
      //   return ret;
      // },

      serviceUrl: (val) => {
        let ret = val ? null : t("validation.required");
        if (form.getInputProps("automatic").value) {
          ret;
        } else {
          ret = null;
        }
        return ret;
      },
    },
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

    if (node.data.sprint) {
      const sprints = node.data.sprint;
      const ret = sprints.map(s => s.id);
      form.setFieldValue("sprint", ret);
    } else {
      form.setFieldValue("sprint", null);
    }

    if (node.data.color) {
      const colorInfo = rgbaToHexAndAlpha(node.data.color);
      if (colorInfo) {
        form.setFieldValue("color", colorInfo.color);
        form.setFieldValue("alpha", colorInfo.alpha);
      } else {
        form.setFieldValue("color", config.ARR_COLORS[0]);
        form.setFieldValue("alpha", 0.2);
      }
    } else {
      form.setFieldValue("color", config.ARR_COLORS[0]);
      form.setFieldValue("alpha", 0.2);
    }

    if (node.data.borderColor) {
      const colorInfo = rgbaToHexAndAlpha(node.data.borderColor);
      if (colorInfo) {
        form.setFieldValue("borderColor", colorInfo.color);
      } else {
        form.setFieldValue("borderColor", config.ARR_COLORS[1]);
      }
    } else {
      form.setFieldValue("borderColor", config.ARR_COLORS[1]);
    }

    form.setFieldValue("automatic", node.data.automatic);
    form.setFieldValue("duration", node.data.duration);
    form.setFieldValue("serviceUrl", node.data.serviceUrl);
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
        <form    autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            updateTask(values);
          })}
        >
          <Group mt={"xs"} grow>
            {createTextField("name")}
          </Group>

          <Grid mt={"xs"}>
            <Grid.Col span={6}>
              <Select
                label={t("businessProcessModel.label.rolesList")}
                placeholder={t("businessProcessModel.placeholder.role")}
                data={data}
                {...form.getInputProps("role")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <MultiSelect
                maxSelectedValues={3}
                label={t("businessProcessModel.label.sprint")}
                placeholder={t("businessProcessModel.placeholder.sprint")}
                data={sprints}
                {...form.getInputProps("sprint")}
              />
            </Grid.Col>
          </Grid>

          <Grid mt={"xs"}>
            <Grid.Col span={6}>
              <Checkbox label={t("businessProcessModel.label.automatic")} {...form.getInputProps("automatic")} />
            </Grid.Col>
          </Grid>

          <Group mt={"xs"} w={160}>
            {createNumberField("duration")}
          </Group>

          <Group mt={"xs"} grow>
            {createTextField("serviceUrl", !form.getInputProps("automatic").value)}
          </Group>

          <Grid mt={"xs"}>
            <Grid.Col span={6}>
              <Stack mt={"xs"} spacing={"xs"}>
                <CustomColorPicker {...form.getInputProps("color")} swatchesPerRow={15} format={"rgba"} />
                <AlphaSlider
                  color={form.getInputProps("color").value}
                  {...form.getInputProps("alpha")}
                  onChangeEnd={(evt) => {}}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
              <Stack mt={"xs"} spacing={"xs"}>
                <CustomColorPicker
                  {...form.getInputProps("borderColor")}
                  swatchesPerRow={15}
                  format={"rgba"}
                  text={t("businessProcessModel.label.borderColor")}
                />
              </Stack>
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
