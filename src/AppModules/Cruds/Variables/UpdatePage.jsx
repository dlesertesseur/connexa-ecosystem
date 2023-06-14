import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { findVariableById, updateVariable } from "../../../DataAccess/Variables";

export function UpdatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload, selectedRowId } = useContext(AbmStateContext);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [working, setWorking] = useState(false);
  const [variable, setVariable] = useState(null);

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

  const getData = async () => {
    if (selectedRowId) {
      const params = {
        token: user.token,
        id: selectedRowId,
      };

      try {
        const variable = await findVariableById(params);
        setVariable(variable);

        setError(false);
        setErrorMessage(null);
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  useEffect(() => {
    if (variable) {
      form.setFieldValue("name", variable.name);
      form.setFieldValue("value", variable.value);
    }
  }, [variable]);

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

  const onUpdate = async (values) => {
    const params = {
      token: user.token,
      data: { ...values, id: selectedRowId },
    };

    try {
      setWorking(true);
      const ret = await updateVariable(params);

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
      setWorking(false);
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <ResponceNotification
        opened={error}
        onClose={onClose}
        code={errorMessage}
        title={t("status.error")}
        text={errorMessage}
      />

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
          {t("crud.variables.title.update")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onUpdate(values);
          })}
        >
          <Group grow mb={"md"}>{createTextField("name")}</Group>
          <Group grow mb={"md"}>{createTextField("value")}</Group>

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
