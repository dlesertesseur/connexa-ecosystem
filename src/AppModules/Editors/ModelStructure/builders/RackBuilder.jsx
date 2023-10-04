import { TextInput, Button, NumberInput, Stack, Group, Grid, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { STRUCTURE_TYPE_RACK } from "../../../../Constants/structures";
import { useContext } from "react";
import { AbmStateContext } from "../Context";

export function RackBuilder({ opened, close }) {
  const { onCreate } = useContext(AbmStateContext);
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: "",
      numberOfModules: 1,
      beamLength: 2.44,
      maxLoadHeight: 1.5,
      uprightDepth: 1.2,
      baseHeight: 0.01,
      levels: 3,
      columnSide: 0.1,
      beamDepth: 0.065,
      beamHeight: 0.1,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      numberOfModules: (val) => (val ? null : t("validation.required")),
      beamLength: (val) => (val ? null : t("validation.required")),
      maxLoadHeight: (val) => (val ? null : t("validation.required")),
      uprightDepth: (val) => (val ? null : t("validation.required")),
      baseHeight: (val) => (val ? null : t("validation.required")),
      levels: (val) => (val ? null : t("validation.required")),
      beamDepth: (val) => (val ? null : t("validation.required")),
      beamHeight: (val) => (val ? null : t("validation.required")),
      columnSide: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("editor.modelStructure.label." + field)}
        placeholder={t("editor.modelStructure.placeholder.aValue")}
        mt="xs"
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createNumberField = (field) => {
    const ret = (
      <TextInput
        type={"number"}
        label={t("editor.modelStructure.label." + field)}
        placeholder={t("editor.modelStructure.placeholder.aValue")}
        mt="xs"
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createNumberControlField = (field) => {
    const ret = (
      <NumberInput
        label={t("editor.modelStructure.label." + field)}
        placeholder={t("editor.modelStructure.placeholder.aValue")}
        mt="xs"
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  return (
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.racking")}>
      <Stack>
        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onCreate(values, STRUCTURE_TYPE_RACK);
            close();
          })}
        >
          <Group grow mb="lg">
            {createTextField("name")}
          </Group>

          <Grid>
            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberControlField("numberOfModules")}
                {createNumberField("beamLength")}
                {createNumberField("columnSide")}
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberField("maxLoadHeight")}
                {createNumberField("beamHeight")}
                {createNumberField("baseHeight")}
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberField("uprightDepth")}
                {createNumberField("beamDepth")}
                {createNumberControlField("levels")}
              </Stack>
            </Grid.Col>
          </Grid>

          <Group position="right">
            <Button type="submit" mt={"xs"}>{t("button.create")}</Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
}
