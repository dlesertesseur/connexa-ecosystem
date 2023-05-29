import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { findRoleById, updateRole } from "../../../DataAccess/Roles";
import { findAllContext } from "../../../DataAccess/Context";

export function UpdatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload, selectedRowId } = useContext(AbmStateContext);
  const [contexts, setContexts] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [working, setWorking] = useState(false);
  const [role, setRole] = useState(null);

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

  const getData = async () => {
    if (selectedRowId) {
      const params = {
        token: user.token,
        id: selectedRowId,
      };

      try {
        const contexts = await findAllContext(params);
        setContexts(contexts);

        const role = await findRoleById(params);
        setRole(role);

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
    if (role) {
      form.setFieldValue("name", role.name);
      form.setFieldValue("groupName", role.groupName);
      form.setFieldValue("context", role.context.id);
    }
  }, [role]);

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

  const onUpdate = async (values) => {
    const params = {
      token: user.token,
      data: {...values, id:selectedRowId},
    };

    try {
      setWorking(true);
      const ret = await updateRole(params);

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
          {t("crud.role.title.update")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onUpdate(values);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group mb={"md"}>{createTextField("groupName")}</Group>
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
