import { TextInput, Title, Container, Button, Group, LoadingOverlay, Stack, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findRackById, updateRack } from "../../../DataAccess/Racks";
import ResponceNotification from "../../../Modal/ResponceNotification";

export function UpdateRackPage({ user, siteId, floorId, rackId, back, onFilter }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [rack, setRack] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [response, setResponse] = useState(null);

  const form = useForm({
    initialValues: {
      name: "",
      visible: false,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
    },
  });

  useEffect(() => {
    setWorking(true);

    const params = {
      token: user.token,
      siteId: siteId,
      floorId: floorId,
      rackId: rackId,
    };
    findRackById(params).then((ret) => {
      setWorking(false);
      setRack(ret);
      form.setFieldValue("name", ret.name);
      form.setFieldValue("visible", ret.visible);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorId, rackId, siteId, user]);

  const [working, setWorking] = useState(false);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        width={"lg"}
        label={t("crud.storageStructure.label." + field)}
        placeholder={t("crud.storageStructure.placeholder." + field)}
        mt="xs"
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onUpdate = (data) => {
    setWorking(true);

    const params = {
      token: user.token,
      siteId: siteId,
      floorId: floorId,
      data: data,
    };
    updateRack(params)
      .then((ret) => {

        setWorking(false);

        if(ret.status){
          setResponse({
            code: ret.status,
            title: ret.status ? t("status.error"): t("status.ok"),
            text: ret.status ? ret.message : t("message.update") ,
          });
          setResponseModalOpen(true);
        }else{
          onFilter();
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
    onFilter();
    navigate(back);
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <ResponceNotification opened={responseModalOpen} onClose={onClose} code={response?.code} title={response?.title} text={response?.text} />
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
          {t("crud.storageStructure.title.update")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            const data = { ...rack };
            data.name = values.name;
            data.visible = values.visible;
            onUpdate(data);
          })}
        >
          <Stack mb="xl">
            {createTextField("name")}
            <Checkbox label={t("crud.storageStructure.label.visible")} 
            {...form.getInputProps('visible', { type: 'checkbox' })}
            mt="xs" />
          </Stack>

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
