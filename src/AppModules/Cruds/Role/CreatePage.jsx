import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { findAllContext } from "../../../DataAccess/Context";
import { createRole } from "../../../DataAccess/Roles";
import { useContext } from "react";
import { AbmStateContext } from "./Context";

export function CreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload } = useContext(AbmStateContext);
  const [contexts, setContexts] = useState([]);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
    };

    const contexts = await findAllContext(params);
    setContexts(contexts);
  };

  useEffect(() => {
    getData();
  }, [user]);

  const form = useForm({
    initialValues: {
      name: "",
      groupName: "",
      context: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      groupName: (val) => (val ? null : t("validation.required")),
      context: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.role.label." + field)}
        placeholder={t("crud.role.placeholder." + field).startsWith("crud.") ? "" : t("crud.role.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectField = (field) => {
    const ret = (
      <Select
        label={t("crud.role.label." + field)}
        data={contexts.map((c) => {
          return { value: c.id, label: c.name };
        })}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onCreate = async (values) => {
    const params = {
      token: user.token,
      data: values,
    };

    setWorking(true);
    try {
      const ret = await createRole(params);
      if (ret.error) {
        setWorking(false);
        setError(true);
        setErrorMessage(ret.message);
      } else {
        setError(false);
        setErrorMessage(null);
        setWorking(false);

        setReload(Date.now());
        navigate("../");
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error);
    }
    setWorking(false);
    setReload(Date.now());
    navigate("../");
  };

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <ResponceNotification opened={error} onClose={onClose} code={errorMessage} title={t("status.error")} text={errorMessage} />
      <LoadingOverlay overlayOpacity={0.5} visible={working} />
      <Container size={"sm"}>
        <Title
          mb={"lg"}
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {t("crud.role.title.create")}
        </Title>

        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group mb={"md"}>
            {createTextField("groupName")}
          </Group>
          <Group mb={"xs"}>{createSelectField("context")}</Group>

          <Group position="right" mt="xl" mb="xs">
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={(event) => {
                navigate(-1);
              }}
            >
              {t("button.cancel")}
            </Button>
          </Group>
        </form>
      </Container>
    </Container>
  );
}
