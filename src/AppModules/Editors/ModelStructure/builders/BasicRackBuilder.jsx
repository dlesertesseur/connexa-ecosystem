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

      moduleWidth: 2.44,
      moduleDepth: 1.3,

      baseHeight: 0.01,
      columnHeight: 3,
      columnSide: 0.1,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      numberOfModulesX: (val) => (val ? null : t("validation.required")),
      numberOfModulesZ: (val) => (val ? null : t("validation.required")),
      moduleWidth: (val) => (val ? null : t("validation.required")),
      moduleDepth: (val) => (val ? null : t("validation.required")),
      baseHeight: (val) => (val ? null : t("validation.required")),
      columnHeight: (val) => (val ? null : t("validation.required")),
      columnSide: (val) => (val ? null : t("validation.required")),
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
                {createNumberField("moduleWidth")}
                {createNumberField("columnSide")}
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberControlField("numberOfModulesZ")}
                {createNumberField("moduleDepth")}
                {createNumberField("columnHeight")}
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberField("baseHeight")}
              </Stack>
            </Grid.Col>
          </Grid>

          <Group position="right">
            <Button type="submit">{t("button.create")}</Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
}
