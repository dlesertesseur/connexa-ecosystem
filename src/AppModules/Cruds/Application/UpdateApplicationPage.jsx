import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findApplicationById, updateApplication } from "../../../DataAccess/Applications";

export function UpdateApplicationPage({ user, back, applicationId, onLoadGrid }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      path: "",
      icon: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
      path: (val) => (val ? null : t("validation.required")),
      icon: (val) => (val ? null : t("validation.required")),
    },
  });

  const [working, setWorking] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    setWorking(true);

    const params = {
      token: user.token,
      id: applicationId,
    };

    findApplicationById(params).then((ret) => {
      setWorking(false);
      setApplication(ret);

      form.setFieldValue("name", ret.name);
      form.setFieldValue("description", ret.description);
      form.setFieldValue("path", ret.path);
      form.setFieldValue("icon", ret.icon);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId, user]);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.application.label." + field)}
        placeholder={t("crud.application.placeholder." + field).startsWith("crud.") ? "" : t("crud.application.placeholder." + field)}
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
    updateApplication(params)
      .then((ret) => {
        setWorking(false);

        if (ret.status) {
          setResponse({
            code: ret.status,
            title: ret.status ? t("status.error") : t("status.ok"),
            text: ret.status ? ret.message : t("message.update"),
          });
          setResponseModalOpen(true);
        } else {
          onLoadGrid();
          navigate(back);
        }
      })
      .catch((error) => {
        setResponse({ code: error.status, title: t("status.error"), text: error.message });
        setResponseModalOpen(true);
      });
  };

  const onClose = () => {
    setResponseModalOpen(false);
    onLoadGrid();
    navigate(back);
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <ResponceNotification
        opened={responseModalOpen}
        onClose={onClose}
        code={response?.code}
        title={response?.title}
        text={response?.text}
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
          {t("crud.application.title.update")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            const data = { ...application };
            data.name = values.name;
            data.description = values.description;
            data.path = values.path;
            data.icon = values.icon;
            onUpdate(data);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group grow mb={"md"}>
            {createTextField("description")}
          </Group>
          <Group grow mb={"md"}>{createTextField("path")}</Group>

          <Group mb={"md"}>{createTextField("icon")}</Group>

          <Group position="right" mt="xl" mb="xs">
            <Button
              onClick={(event) => {
                navigate(back);
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
