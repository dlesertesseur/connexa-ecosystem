import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../Components/Logo";

export function SignUp() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },

    validate: {
      firstName: (val) => (val ? null : t("validation.required")),
      lastName: (val) => (val ? null : t("validation.required")),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : t("validation.emailFormat")),
      password: (val) => (val.length <= 6 ? t("validation.passwordFormat") : null),
      terms: (val) => (val ? null : t("validation.terms")),
    },
  });

  return (
    <Container size={420} my={40}>
      <Logo />
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        {t("signUp.title")}
      </Title>

      <Text color="dimmed" size="sm" align="left" mt={5}>
        {t("signUp.message")}
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(() => {
            navigate("/menu");
          })}
        >
          <TextInput
            label={t("label.firstName")}
            placeholder={t("placeholder.firstName")}
            onChange={(event) => form.setFieldValue("firstName", event.currentTarget.value)}
            error={form.errors.firstName}
          />

          <TextInput
            label={t("label.lastName")}
            placeholder={t("placeholder.lastName")}
            mt="md"
            onChange={(event) => form.setFieldValue("lastName", event.currentTarget.value)}
            error={form.errors.lastName}
          />

          <TextInput
            label={t("label.email")}
            placeholder={t("placeholder.email")}
            mt="md"
            onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
            error={form.errors.email}
          />
          <PasswordInput
            label={t("label.password")}
            placeholder={t("placeholder.password")}
            autoComplete="off"
            mt="md"
            onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
            error={form.errors.password}
          />

          <Group position="apart" mt="md">
            <Checkbox
              label={t("label.conditions")}
              onChange={(event) => form.setFieldValue("terms", event.currentTarget.value)}
              error={form.errors.terms}
            />
          </Group>

          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>

          <Text color="dimmed" size="sm" align="center" mt={5}>
            {t("auth.haveAccount") + " "}
            <Anchor href="#" size="sm" onClick={(event) => navigate("/")}>
              {t("button.signIn")}
            </Anchor>
          </Text>
        </form>
      </Paper>
    </Container>
  );
}
