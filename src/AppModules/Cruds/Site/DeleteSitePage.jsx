import { TextInput, Title, Container, Button, Group, LoadingOverlay, Select } from "@mantine/core";
import ResponceNotification from "../../../Modal/ResponceNotification";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteSite, findSiteById } from "../../../DataAccess/Sites";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";

export function DeleteSitePage({ user, back, siteId, onLoadGrid, contexts }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [site, setSite] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [working, setWorking] = useState(false);

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
        disabled
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
        disabled
        label={t("crud.site.label." + field)}
        placeholder={t("crud.site.placeholder." + field)}
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

    console.log("########### onDelete ###########");

    const params = {
      token: user.token,
      siteId: site.id,
    };
    deleteSite(params)
      .then((ret) => {
        setWorking(false);

        if (ret.status) {
          setResponse({
            code: ret.status,
            title: ret.status ? t("status.error") : t("status.ok"),
            text: ret.status ? ret.message : t("message.delete"),
          });
          setResponseModalOpen(true);
        } else {
          navigate(back);
          onLoadGrid();
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

  const onConfirm = () => {
    onDelete();
    navigate(back);
    onLoadGrid();
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
          {t("crud.site.title.delete")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
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
