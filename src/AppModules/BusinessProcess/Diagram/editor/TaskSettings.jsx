import React from "react";
import {
  AlphaSlider,
  Button,
  Checkbox,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Tabs,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import { useEffect } from "react";
import { rgbaToHexAndAlpha } from "../../../../Util";
import { config } from "../../../../Constants/config";
import { IconSettings } from "@tabler/icons-react";
import { IconSettingsAutomation } from "@tabler/icons-react";
import CustomColorPicker from "../../../../Components/CustomColorPicker";

const TaskSettings = ({ open, close, updateNode, node }) => {
  const { t } = useTranslation();
  const { roles } = useContext(AbmStateContext);
  const [data, setData] = useState(null);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      role: "",
      color: "rgba(255,255,255,0.4)",
      alpha: "",
      borderColor: "rgba(0,0,0,0.99)",
      automatic: false,
      serviceUrl: "",
      duration: 1,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
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
    form.setFieldValue("description", node.data.description);

    if (node.data.role) {
      form.setFieldValue("role", node.data.role.id);
    } else {
      form.setFieldValue("role", null);
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
      <form
        autoComplete="false"
        onSubmit={form.onSubmit((values) => {
          updateTask(values);
        })}
      >
        <Tabs variant="outline" defaultValue="definition" h={440}>
          <Tabs.List>
            <Tabs.Tab value="definition" icon={<IconSettings size={16}/>}>
              {t("businessProcessModel.tab.definition")}
            </Tabs.Tab>
            <Tabs.Tab value="process" icon={<IconSettingsAutomation size={16}/>}>
              {t("businessProcessModel.tab.process")}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="definition">
            <Stack w={"100%"} spacing={"xs"}>
              <Group mt={"xs"} grow>
                {createTextField("name")}
              </Group>

              <Group mt={"xs"} grow>
                {createTextArea("description")}
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
                <Grid.Col span={6}>{createNumberField("duration")}</Grid.Col>
              </Grid>

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
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="process">
            <Stack w={"100%"} spacing={"xs"}>
              <Grid mt={"xs"}>
                <Grid.Col span={6}>
                  <Checkbox label={t("businessProcessModel.label.automatic")} {...form.getInputProps("automatic")} />
                </Grid.Col>
              </Grid>

              <Group mt={"xs"} grow>
                {createTextArea("serviceUrl", !form.getInputProps("automatic").value)}
              </Group>

              <Group mt={"xs"} grow>
                {createTextField("functionNane", !form.getInputProps("automatic").value)}
              </Group>

              <Group mt={"xs"} grow>
                {createTextField("paramsInHeader", !form.getInputProps("automatic").value)}
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>

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
    </Modal>
  );
};

export default TaskSettings;
