import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Container,
  Group,
  Button,
  Alert,
  Stack,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { signIn } from "../Features/Auth";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons";
import Logo from "../Components/Logo";
import { Text } from "react-konva";

export function SignIn() {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  const { user, loading, error } = useSelector((state) => state.auth.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.token) {
      navigate("/menu");
    }
  }, [navigate, user]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    // CANBIAR LA VALIDACION DE LA CLAVE a minimo 6 caracteres
    validate: {
      email: (val) =>
        /^\S+@\S+$/.test(val) ? null : t("validation.emailFormat"),
      password: (val) =>
        val.length <= 2 ? t("validation.passwordFormat") : null,
    },
  });

  return (
    <Center p={"xl"}>
      <Stack m={"xl"} p={"xl"} align="center">
        {/* <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          {t("auth.title")}
        </Title>
        <Text color="dimmed" size="sm" align="center">
          {t("auth.doNotHaveAccount") + " "}
          <Anchor href="#" size="sm" onClick={(event) => navigate("/signUp")}>
            {t("auth.createAccount")}
          </Anchor>
        </Text> */}

        <Paper
          withBorder
          shadow="md"
          p={30}
          radius="md"
          bg={theme.colors.gray[0]}
        >
          <Logo />
          <form
            onSubmit={form.onSubmit((values) => {
              dispatch(
                signIn({ email: values.email, password: values.password })
              );
            })}
          >
            <TextInput
              label={t("label.email")}
              placeholder={t("placeholder.email")}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email}
            />
            <PasswordInput
              label={t("label.password")}
              placeholder={t("placeholder.password")}
              autoComplete="off"
              mt="md"
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={form.errors.password}
            />

            <Group position="apart" mt="md">
              <Checkbox label={t("label.keepMeConnected")} />
              <Anchor
                onClick={(event) => event.preventDefault()}
                href="#"
                size="sm"
              >
                {t("auth.forgotPassword")}
              </Anchor>
            </Group>
            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={loading}
              loaderPosition={"left"}
            >
              {t("button.signIn")}
            </Button>
          </form>
          {error ? (
            <Alert
              mt={"sm"}
              icon={<IconAlertCircle size={16} />}
              title={t("errors.title")}
              color="red"
              variant="filled"
            >
              {error.message}
            </Alert>
          ) : null}

          {/* <Group mt={"xl"}>
            <Text lineClamp={1}>
              zeeTrex
            </Text>
          </Group> */}
        </Paper>
      </Stack>
    </Center>
  );
}
