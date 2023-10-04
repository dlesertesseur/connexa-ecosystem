import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { createVariable } from "../../../DataAccess/Variables";

export function CreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload } = useContext(AbmStateContext);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const form = useForm({
    initialValues: {
      name: "",
      value: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      value: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.variables.label." + field)}
        placeholder={t("crud.variables.placeholder." + field).startsWith("crud.") ? "" : t("crud.variables.placeholder." + field)}
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
      const ret = await createVariable(params);
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
          {t("crud.variables.title.create")}
        </Title>

        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group grow mb={"md"}>
            {createTextField("value")}
          </Group>
          
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
