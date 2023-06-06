import { TextInput, Button, NumberInput, Stack, Group, Grid, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import { STRUCTURE_TYPE_SHELVING } from "../../../../Constants/structures";

export function ShelvesBuilder({ opened, close }) {
  const { onCreate } = useContext(AbmStateContext);
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: "",
      numberOfModules: 1,
      moduleWidth: 1.3,
      moduleHeight: 2.0,
      moduleDepth: 0.6,
      baseHeight: 0.1,
      shelfHeight: 0.04,
      verticalPanelWidth: 0.04,
      numberOfShelvesByModule: 3,
      panelThickness: 0.04,
      spaceHeight: 0.4,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      numberOfModules: (val) => (val ? null : t("validation.required")),
      moduleWidth: (val) => (val ? null : t("validation.required")),
      moduleHeight: (val) => (val ? null : t("validation.required")),
      moduleDepth: (val) => (val ? null : t("validation.required")),
      baseHeight: (val) => (val ? null : t("validation.required")),
      shelfHeight: (val) => (val ? null : t("validation.required")),
      verticalPanelWidth: (val) => (val ? null : t("validation.required")),
      numberOfShelvesByModule: (val) => (val ? null : t("validation.required")),
      panelThickness: (val) => (val ? null : t("validation.required")),
      spaceHeight: (val) => (val ? null : t("validation.required")),
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
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.shelving")}>
      <Stack>
        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values, STRUCTURE_TYPE_SHELVING);
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
                {createNumberField("moduleWidth")}
                {createNumberField("moduleHeight")}
                {createNumberField("moduleDepth")}
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Stack align="center" justify="flex-start">
                {createNumberField("baseHeight")}
                {createNumberField("shelfHeight")}
                {createNumberField("verticalPanelWidth")}
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack justify="flex-start">
                {createNumberControlField("numberOfShelvesByModule")}
                {createNumberField("panelThickness")}
                {createNumberField("spaceHeight")}
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
