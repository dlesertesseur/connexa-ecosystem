import ResponceNotification from "../../../Modal/ResponceNotification";
import {
  TextInput,
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
  Alert,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons-react";
import { findUserByEmail } from "../../../DataAccess/User";

export function FindUser() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [alreadyExists, setAlreadyExists] = useState(false);

  const form = useForm({
    initialValues: {
      //nid: "",
      email: "",
    },

    validate: {
      //nid: (val) => (/^\d{8,10}$/.test(val) ? null : t("validation.idNumberFormat")),
      email: (val) =>
        /^\S+@\S+$/.test(val) ? null : t("validation.emailFormat"),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <Group w={"100%"}>
        <TextInput
          w={"100%"}
          label={t("crud.user.label." + field)}
          placeholder={
            t("crud.user.placeholder." + field).startsWith("crud.")
              ? ""
              : t("crud.user.placeholder." + field)
          }
          {...form.getInputProps(field)}
        />
      </Group>
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  const ths = () => {
    const cols = t("crud.user.findUserColumns", { returnObjects: true });
    return (
      <tr>
        <th>{cols[0]}</th>
        <th>{cols[1]}</th>
      </tr>
    );
  };

  const onSeek = async (values) => {
    const params = {
      token: user.token,
      email: values.email,
    };

    setLoading(true);
    try {
      const found = await findUserByEmail(params);

      if (found.error) {
        setAlreadyExists(false);
        setErrorMessage(found.error);
        setErrorCode(found.status);
      } else {
        setAlreadyExists(true);
        setErrorMessage(null);
        setErrorCode(null);
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };
  
  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      {error && errorCode !== 404 ? (
        <ResponceNotification
          opened={error}
          onClose={onClose}
          code={errorCode}
          title={error}
          text={errorMessage}
        />
      ) : null}

      <LoadingOverlay overlayOpacity={0.5} visible={loading} />
      <Container size={"xs"}>
        <Title
          mb={"lg"}
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {t("crud.user.title.findUser")}
        </Title>
        <form
          onSubmit={form.onSubmit((values) => {
            onSeek(values);
          })}
        >
          <Paper shadow="xs" p="md">
            <Group mb={"md"}>{createTextField("email")}</Group>
            <Group position="right" mt="xl">
              <Button
                onClick={(event) => {
                  navigate("../");
                }}
              >
                {t("button.cancel")}
              </Button>
              <Button type="submit">{t("button.seek")}</Button>
            </Group>
          </Paper>
        </form>

        {errorCode === 404 ? (
          <Alert
            icon={<IconAlertCircle size={16} />}
            my="lg"
            title={t("notification.title")}
            variant="outline"
          >
            {t("notification.createUser")}
            <Group position="right" mt="xl">
              <Button
                onClick={() => {
                  navigate("createUser");
                }}
              >
                {t("button.create")}
              </Button>
            </Group>
          </Alert>
        ) : null}

        {alreadyExists ? (
          <Alert
            icon={<IconAlertCircle size={16} />}
            my="lg"
            title={t("notification.title")}
            variant="filled"
            color={"red"}
          >
            {t("notification.userAllreadyExist")}
          </Alert>
        ) : null}
      </Container>
    </Container>
  );
}
