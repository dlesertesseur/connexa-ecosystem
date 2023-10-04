import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Group,
  Button,
  Alert,
  Stack,
  Center,
  useMantineTheme,
  Image,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { signIn } from "../Features/Auth";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons-react";
import Logo from "../Components/Logo";
import LanguageSelector from "../Components/LanguageSelector";
import { config } from "../Constants/config";

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
      email: (val) => (/^\S+@\S+$/.test(val) ? null : t("validation.emailFormat")),
      password: (val) => (val.length <= 2 ? t("validation.passwordFormat") : null),
    },
  });

  return (
    <Center p={"xl"}>
      {user?.token ? (
        <LoadingOverlay overlayOpacity={0.5} visible={true} />
      ) : (
        <Stack m={"xl"} p={"xl"} align="center">
          <Paper sx={{ width: 400 }} withBorder shadow="md" p={30} radius="md" bg={theme.colors.gray[0]}>
            <Logo width={150} />
            <form
              autoComplete="false"
              onSubmit={form.onSubmit((values) => {
                dispatch(signIn({ email: values.email, password: values.password }));
              })}
            >
              <TextInput
                label={t("label.email")}
                placeholder={t("placeholder.email")}
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
                <Checkbox label={t("label.keepMeConnected")} />
                <Anchor onClick={(event) => event.preventDefault()} href="#" size="sm">
                  {t("auth.forgotPassword")}
                </Anchor>
              </Group>
              <Button type="submit" fullWidth mt="xl" loading={loading} loaderPosition={"left"}>
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

            <Group grow mt={"xl"}>
              <LanguageSelector />
            </Group>
          </Paper>

          <Group position="apart" mt={"xl"}>
            <Image
              src={config.PUBLIC_URL + "/logos/zeetrex.png"}
              alt="logo"
              width={100}
              component="a"
              href={t("label.url")}
              target="_blank"
            />
            <Text size={"xs"} weight={500} color="gray">
              {t("label.copyright")}
            </Text>
          </Group>
        </Stack>
      )}
    </Center>
  );
}
