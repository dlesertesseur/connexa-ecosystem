import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findSiteById, updateSite } from "../../../DataAccess/Sites";

export function UpdateSitePage({ user, back, siteId, onLoadGrid, contexts }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);

  const form = useForm({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      context: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      address: (val) => (val ? null : t("validation.required")),
      phone: (val) => (val ? null : t("validation.required")),
      context: (val) => (val ? null : t("validation.required")),
    },
  });

  const [working, setWorking] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    setWorking(true);

    const params = {
      token: user.token,
      siteId: siteId,
    };
    findSiteById(params).then((ret) => {
      setWorking(false);
      setSite(ret);

      form.setFieldValue("name", ret.name);
      form.setFieldValue("address", ret.address);
      form.setFieldValue("phone", ret.phone);
      form.setFieldValue("context", ret.context.id);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, user]);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.site.label." + field)}
        placeholder={t("crud.site.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectField = (field) => {
    const ret = (
      <Select
        label={t("crud.site.label." + field)}
        placeholder={t("crud.site.placeholder." + field)}
        data={contexts.map(c => { 
          return({ value: c.id, label: c.name });
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
    updateSite(params)
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
          {t("crud.site.title.update")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            const data = { ...site };
            data.name = values.name;
            data.address = values.address;
            data.phone = values.phone;
            data.context = contexts.find(f => f.id === values.context);
            onUpdate(data);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group grow mb={"md"}>
            {createTextField("address")}
          </Group>
          <Group mb={"md"}>{createTextField("phone")}</Group>

          <Group mb={"md"}>{createSelectField("context")}</Group>

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
