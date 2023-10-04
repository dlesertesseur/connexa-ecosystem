import ResponceNotification from "../../../Modal/ResponceNotification";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Select } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { deleteRole, findRoleById } from "../../../DataAccess/Roles";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useForm } from "@mantine/form";
import { findAllContext } from "../../../DataAccess/Context";

export function DeletePage() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth.value);
  
  const { t } = useTranslation();
  const { setReload, selectedRowId } = useContext(AbmStateContext);
  const [working, setWorking] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [contexts, setContexts] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
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
        disabled
        label={t("crud.role.label." + field)}
        placeholder={t("crud.role.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectField = (field) => {
    const ret = (
      <Select
        disabled
        label={t("crud.role.label." + field)}
        data={contexts.map((c) => {
          return { value: c.id, label: c.name };
        })}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onDelete = async (values) => {
    const params = {
      token: user.token,
      data: { id: selectedRowId },
    };

    try {
      setWorking(true);
      const ret = await deleteRole(params);

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

  const onConfirm = () => {
    onDelete();
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

      <DeleteConfirmation
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
        title={t("notification.title")}
        text={t("notification.delete")}
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
          {t("crud.role.title.delete")}
        </Title>

        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group grow mb={"md"}>
            {createTextField("groupName")}
          </Group>
          <Group mb={"xs"}>{createSelectField("context")}</Group>

          <Group position="right" mt="xl" mb="xs">
            <Button
              onClick={() => {
                setConfirmModalOpen(true);
              }}
            >
              {t("button.accept")}
            </Button>
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
