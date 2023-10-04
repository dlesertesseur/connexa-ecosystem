import { TextInput, Title, Container, Group, Stack, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT } from "../../../Constants";
import { useEffect } from "react";
import { AbmStateContext } from "./Context";
import { useContext } from "react";
import ButtonsPanel from "./ButtonsPanel";

export function Step2({ title, active, setActive, onCancel }) {
  const { t } = useTranslation();
  const { wizardData, setWizardData } = useContext(AbmStateContext);
  const wSize = useWindowSize();

  const form = useForm({
    initialValues: {
      nid: "",
      lastname: "",
      firstname: "",
      // phone: "",
      email: "",
      password: "",
    },

    validate: {
      nid: (val) => (/^\d{8,10}$/.test(val) ? null : t("validation.idNumberFormat")),
      lastname: (val) => (val ? null : t("validation.required")),
      firstname: (val) => (val ? null : t("validation.required")),
      // phone: (val) =>
      //   /^[a-zA-Z0-9\-().\s]{10,16}$/.test(val)
      //     ? null
      //     : t("validation.phoneNumberFormat"),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : t("validation.emailFormat")),
      password: (val) => (val.length <= 6 ? t("validation.passwordFormat") : null),
    },
  });

  useEffect(() => {
    if (wizardData && wizardData.step2) {
      form.setFieldValue("nid", wizardData.step2.nid);
      form.setFieldValue("lastname", wizardData.step2.lastname);
      form.setFieldValue("firstname", wizardData.step2.firstname);
      form.setFieldValue("email", wizardData.step2.email);
      form.setFieldValue("password", wizardData.step2.password);
    }
  }, [wizardData]);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.user.label." + field)}
        placeholder={t("crud.user.placeholder." + field).startsWith("crud.") ? "" : t("crud.user.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createPasswordField = (field) => {
    const ret = (
      <PasswordInput
        w={200}
        label={t("crud.user.label." + field)}
        autoComplete="off"
        placeholder={t("crud.user.placeholder." + field).startsWith("crud.") ? "" : t("crud.user.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const validate = () => {
    form.validate();
    if (form.isValid()) {
      const data = { ...wizardData };

      const step2 = {};
      step2.nid = form.getInputProps("nid").value;
      step2.lastname = form.getInputProps("lastname").value;
      step2.firstname = form.getInputProps("firstname").value;
      step2.email = form.getInputProps("email").value;
      step2.password = form.getInputProps("password").value;

      data.step2 = step2;

      setWizardData(data);
      setActive(active + 1);
    }
  };

  const nextStep = () => {
    validate();
  };

  const prevStep = () => {
    setActive(active - 1);
  };

  return (
    <Stack
      justify="space-between"
      spacing="xs"
      h={wSize.height - HEADER_HIGHT}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
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

        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          <Group mb={"md"}>{createTextField("nid")}</Group>

          <Group grow mb={"md"}>
            {createTextField("lastname")}
          </Group>

          <Group grow mb={"md"}>
            {createTextField("firstname")}
          </Group>

          {/* <Group mb={"md"}>{createTextField("phone")}</Group> */}

          <Group grow mb={"md"}>
            {createTextField("email")}
          </Group>

          <Group mb={"md"}>
            {createPasswordField("password")}
          </Group>
        </form>
      </Container>

      {wSize?.height ? <ButtonsPanel onCancel={onCancel} nextStep={nextStep} prevStep={prevStep} /> : null}
    </Stack>
  );
}
