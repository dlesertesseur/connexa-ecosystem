import ResponceNotification from "../../../Modal/ResponceNotification";
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
import { updateRole } from "../../../Features/Role";
import { actions } from "../../../Constants";

export function UpdatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth.value);
  const { contexts, action, selectedRole, error, errorMessage } = useSelector(
    (state) => state.role.value
  );

  const form = useForm({
    initialValues: {
      name: "",
      context: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      context: (val) => (val ? null : t("validation.required")),
    },
  });

  const [working, setWorking] = useState(false);

  useEffect(() => {
    if(action === actions.updated){
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
        label={t("crud.role.label." + field)}
        placeholder={
          t("crud.role.placeholder." + field).startsWith("crud.")
            ? ""
            : t("crud.role.placeholder." + field)
        }
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

  const onUpdate = (values) => {
    setWorking(true);

    const params = {
      token: user.token,
      data: values,
    };
    dispatch(updateRole(params));
  };

  const onClose = () => {
    navigate(-1);
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
            const toSend = { ...selectedRole };
            toSend.name = values.name;
            toSend.context = values.context;
            onUpdate(toSend);
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
            <Button type="submit">{t("button.accept")}</Button>
          </Group>
        </form>
      </Container>
    </Container>
  );
}
