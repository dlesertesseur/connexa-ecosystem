import ResponceNotification from "../../../Modal/ResponceNotification";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";
import {
  TextInput,
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRole } from "../../../Features/Role";
import { actions } from "../../../Constants";

export function DeletePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { t } = useTranslation();
  const [working, setWorking] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const { user } = useSelector((state) => state.auth.value);
  const { contexts, action, selectedRole, error, errorMessage } = useSelector(
    (state) => state.role.value
  );

  const form = useForm({
    initialValues: {
      name: "",
      context: "",
    },
  });

  useEffect(() => {
    if(action === actions.deleted){
      setWorking(false);
      navigate(-1);
    }
  },[action, navigate])

  useEffect(() => {
    if (selectedRole) {
      setWorking(false);
      form.setFieldValue("name", selectedRole.name);
      form.setFieldValue("context", selectedRole.context.id);
    }else{
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole]);
  
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

  const onDelete = () => {
    setWorking(true);

    const params = {
      token: user.token,
      id: selectedRole.id,
    };
    dispatch(deleteRole(params));
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
        code={""}
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

        <form
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group mb={"xs"}>{createSelectField("context")}</Group>

          <Group position="right" mt="xl" mb="xs">
            <Button
              onClick={(event) => {
                navigate(-1);
              }}
            >
              {t("button.cancel")}
            </Button>
            <Button onClick={() => {onDelete()}}>{t("button.accept")}</Button>
          </Group>
        </form>
      </Container>
    </Container>
  );
}
