import { Title, Container, Group, TextInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT } from "../../../Constants";
import { useEffect } from "react";
import ButtonsPanel from "./ButtonsPanel";

export function Step1({ title, active, setActive, onCancel }) {
  const wSize = useWindowSize();
  const { t } = useTranslation();
  const { wizardData, setWizardData } = useContext(AbmStateContext);
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.organization.label." + field)}
        placeholder={
          t("crud.organization.placeholder." + field).startsWith("crud.")
            ? ""
            : t("crud.organization.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };


  useEffect(() => {
    if (wizardData) {
      form.setFieldValue("name", wizardData?.step1.name);
      form.setFieldValue("description", wizardData?.step1.description);
    }
  }, [wizardData]);

  const validate = () => {
    form.validate();
    if (form.isValid()) {

      const data = {...wizardData};

      const step1 = {};
      step1.name = form.getInputProps("name").value;
      step1.description = form.getInputProps("description").value;

      data.step1 = step1;

      setWizardData(data);
      setActive(active + 1);
    }
  };

  const nextStep = () => {
    validate();
  };

  return (
    <Stack
      justify="space-between"
      spacing="xs"
      h={wSize.height - HEADER_HIGHT}
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
      })}
    >
      <Container size={"sm"} w={"100%"}>
        <Title
          mt={"lg"}
          mb={"lg"}
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {title}
        </Title>

        <form>
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group grow mb={"md"}>
            {createTextField("description")}
          </Group>
        </form>
      </Container>
      {wSize?.height ? (
        <ButtonsPanel onCancel={onCancel} nextStep={nextStep} />
      ) : null}
    </Stack>
  );
}
