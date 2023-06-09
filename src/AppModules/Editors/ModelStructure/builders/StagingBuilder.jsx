import { TextInput, Button, NumberInput, Stack, Group, Grid, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { STRUCTURE_TYPE_STAGING } from "../../../../Constants/structures";
import { AbmStateContext } from "../Context";

export function StagingBuilder({ opened, close }) {
  const { onCreate } = useContext(AbmStateContext);
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: "",
      numberOfModulesX: 1,
      numberOfModulesZ: 1,
      moduleWidth: 1.5,
      moduleDepth: 1.5,
      baseHeight: 0.01,
      separationX: 0.05,
      separationZ: 0.05,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      numberOfModulesX: (val) => (val ? null : t("validation.required")),
      numberOfModulesZ: (val) => (val ? null : t("validation.required")),
      moduleWidth: (val) => (val ? null : t("validation.required")),
      moduleDepth: (val) => (val ? null : t("validation.required")),
      baseHeight: (val) => (val ? null : t("validation.required")),
      separationX: (val) => (val ? null : t("validation.required")),
      separationZ: (val) => (val ? null : t("validation.required")),
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
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.items.racking.staging")}>
      <Stack>
        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values, STRUCTURE_TYPE_STAGING);
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
                {createNumberField("separationX")}
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberControlField("numberOfModulesZ")}
                {createNumberField("moduleDepth")}
                {createNumberField("separationZ")}
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberField("baseHeight")}
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
