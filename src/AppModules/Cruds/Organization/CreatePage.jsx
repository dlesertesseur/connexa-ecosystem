import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "../../../DataAccess/Organization";

export function CreatePage({ user, back, onLoadGrid }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
    },
  });

  const [working, setWorking] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [response, setResponse] = useState(null);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.organization.label." + field)}
        placeholder={
          t("crud.organization.placeholder." + field).startsWith("crud.")
            ? ""
            : t("crud.organization.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onCreate = (values) => {
    setWorking(true);

    const params = {
      token: user.token,
      data: values,
    };
    createOrganization(params)
      .then((ret) => {
        setWorking(false);

        if (ret.error) {
          setResponse({
            code: ret.status,
            title: ret.error,
            text: ret.status ? ret.message : t("message.create"),
          });
          setResponseModalOpen(true);
        } else {
          if (ret.status) {
            setResponse({
              code: ret.status,
              title: ret.status ? t("status.error") : t("status.ok"),
              text: ret.status ? ret.message : t("message.create"),
            });
            setResponseModalOpen(true);
          } else {
            onLoadGrid();
            navigate(back);
          }
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
          {t("crud.organization.title.create")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group grow mb={"md"}>
            {createTextField("description")}
          </Group>

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
