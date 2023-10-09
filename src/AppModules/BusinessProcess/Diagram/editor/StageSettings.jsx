import React from "react";
import { AlphaSlider, Button, Group, Modal, NumberInput, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { rgbaToHexAndAlpha } from "../../../../Util";
import { config } from "../../../../Constants/config";
import CustomColorPicker from "../../../../Components/CustomColorPicker";

const StageSettings = ({ open, close, updateNode, node }) => {
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: "",
      color: "",
      alpha: "",
      stageNumber:0,
      duration:1
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      stageNumber: (val) => (val ? null : t("validation.required")),
      // color: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    form.setFieldValue("name", node.data.label);

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
            {createNumberField("stageNumber")}
            {createNumberField("duration")}
          </Group>

          <Stack mt={"md"} spacing={"xs"}>
            <CustomColorPicker {...form.getInputProps("color")} swatchesPerRow={18} format={"rgba"} />
            <AlphaSlider
              color={form.getInputProps("color").value}
              {...form.getInputProps("alpha")}
              onChangeEnd={(evt) => {}}
            />
          </Stack>

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
