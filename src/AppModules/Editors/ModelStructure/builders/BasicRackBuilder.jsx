import { TextInput, Button, NumberInput, Stack, Group, Grid, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { STRUCTURE_TYPE_RACK_BASIC } from "../../../../Constants/structures";
import { AbmStateContext } from "../Context";

export function BasicRackBuilder({ opened, close }) {
  const { onCreate } = useContext(AbmStateContext);
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: "",
      numberOfModulesX: 1,
      numberOfModulesZ: 1,

      beamLength: 2.44,
      beamHeight: 0.1,
      beamDepth: 0.065,

      baseHeight: 0.01,
      columnHeight: 3,
      columnSide: 0.1,
      uprightDepth: 1.3,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      numberOfModulesX: (val) => (val ? null : t("validation.required")),
      numberOfModulesZ: (val) => (val ? null : t("validation.required")),
      beamLength: (val) => (val ? null : t("validation.required")),
      beamDepth: (val) => (val ? null : t("validation.required")),
      beamHeight: (val) => (val ? null : t("validation.required")),
      baseHeight: (val) => (val ? null : t("validation.required")),
      columnHeight: (val) => (val ? null : t("validation.required")),
      columnSide: (val) => (val ? null : t("validation.required")),
      uprightDepth: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("editor.modelStructure.label." + field)}
        placeholder={t("editor.modelStructure.placeholder." + field)}
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
        placeholder={t("editor.modelStructure.placeholder." + field)}
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
        placeholder={t("editor.modelStructure.placeholder." + field)}
        mt="xs"
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  return (
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.items.racking.basic")}>
      <Stack>
        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values, STRUCTURE_TYPE_RACK_BASIC);
            close();
          })}
        >
          <Group grow mb="lg">
            {createTextField("name")}
          </Group>

          <Grid>
            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberControlField("numberOfModulesX")}
                {createNumberField("beamLength")}
                {createNumberField("columnSide")}
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberControlField("numberOfModulesZ")}
                {createNumberField("beamHeight")}
                {createNumberField("columnHeight")}
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberField("baseHeight")}
                {createNumberField("beamDepth")}
                {createNumberField("uprightDepth")}
              </Stack>
            </Grid.Col>
          </Grid>

          <Group position="right" mt="xl" mb="xs">
            <Button type="submit">{t("button.create")}</Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
}
