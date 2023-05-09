import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteFloor, findFloorById } from "../../../DataAccess/Floors";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";

export function DeleteFloorPage({ user, siteId, floorId, back, onFilter }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [floor, setFloor] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [response, setResponse] = useState(null);

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

  useEffect(() => {
    setWorking(true);

    const params = {
      token: user.token,
      siteId: siteId,
      floorId: floorId,
    };
    findFloorById(params).then((ret) => {
      setWorking(false);
      setFloor(ret);
      form.setFieldValue("name", ret.name);
      form.setFieldValue("description", ret.description);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorId, siteId, user]);

  const [working, setWorking] = useState(false);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        disabled={true}
        width={"lg"}
        label={t("crud.floor.label." + field)}
        placeholder={t("crud.floor.placeholder." + field)}
        mt="xs"
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
      siteId: siteId,
      floorId: floor.id,
    };
    deleteFloor(params)
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
          onFilter();
        }
      })
      .catch((error) => {
        setResponse({ code: error.status, title: t("status.error"), text: error.message });
        setResponseModalOpen(true);
      });
  };

  const onBack = () => {
    setConfirmModalOpen(false);
    navigate(back);
    onFilter();
  };

  const onConfirm = () => {
    onDelete();
    navigate(back);
    onFilter();
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <ResponceNotification
        opened={responseModalOpen}
        onClose={onBack}
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

      <Container sx={{ width: "60%" }}>
        <Title
          mb={"lg"}
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {t("crud.floor.title.delete")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
          })}
        >
          <Group grow mb="lg">
            {createTextField("name")}
          </Group>
          <Group grow mb="lg">
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
