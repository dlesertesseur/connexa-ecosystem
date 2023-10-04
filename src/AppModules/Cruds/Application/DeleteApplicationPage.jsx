import ResponceNotification from "../../../Modal/ResponceNotification";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";
import {
  TextInput,
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteApplication,
  findApplicationById,
} from "../../../DataAccess/Applications";

export function DeleteApplicationPage({
  user,
  back,
  applicationId,
  onLoadGrid,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [application, setApplication] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [working, setWorking] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      path: "",
      icon: "",
    },

    validate: {},
  });

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
        disabled
        label={t("crud.application.label." + field)}
        placeholder={t("crud.application.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onDelete = () => {
    setWorking(true);

    const params = {
      token: user.token,
      id: application.id,
    };
    deleteApplication(params)
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
        setResponse({
          code: error.status,
          title: t("status.error"),
          text: error.message,
        });
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
          {t("crud.application.title.delete")}
        </Title>

        <form   autoComplete="false">
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group grow mb={"md"}>
            {createTextField("description")}
          </Group>
          <Group grow mb={"md"}>
            {createTextField("path")}
          </Group>

          <Group mb={"md"}>{createTextField("icon")}</Group>

          <Group position="right" mt="xl" mb="xs">
            <Button
              onClick={(event) => {
                navigate(back);
              }}
            >
              {t("button.cancel")}
            </Button>
            <Button onClick={() => setConfirmModalOpen(true)}>
              {t("button.accept")}
            </Button>
          </Group>
        </form>
      </Container>
    </Container>
  );
}
