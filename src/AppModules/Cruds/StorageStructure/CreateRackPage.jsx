import {
  TextInput,
  Title,
  Container,
  Button,
  NumberInput,
  Stack,
  Group,
  Grid,
  Notification,
  LoadingOverlay,
  ScrollArea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { IconBellRinging } from "@tabler/icons";
import { useState } from "react";
import { createRack } from "../../../DataAccess/Racks";
import { useNavigate } from "react-router-dom";
import ResponceNotification from "../../../Modal/ResponceNotification";

export function CreateRackPage({ user, siteId, floorId, back, onFilter }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      numberOfModules: 1,
      moduleWidth: 1.3,
      moduleHeight: 2.0,
      moduleDepth: 0.6,
      baseHeight: 0.1,
      shelfHeight: 0.04,
      verticalPanelWidth: 0.04,
      numberOfShelvesByModule: 3,
      panelWidth: 1.3,
      spaceHeight: 0.4,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      numberOfModules: (val) => (val ? null : t("validation.required")),
      moduleWidth: (val) => (val ? null : t("validation.required")),
      moduleHeight: (val) => (val ? null : t("validation.required")),
      moduleDepth: (val) => (val ? null : t("validation.required")),
      baseHeight: (val) => (val ? null : t("validation.required")),
      shelfHeight: (val) => (val ? null : t("validation.required")),
      verticalPanelWidth: (val) => (val ? null : t("validation.required")),
      numberOfShelvesByModule: (val) => (val ? null : t("validation.required")),
      panelWidth: (val) => (val ? null : t("validation.required")),
      spaceHeight: (val) => (val ? null : t("validation.required")),
    },
  });

  const [working, setWorking] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [response, setResponse] = useState(null);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.storageStructure.label." + field)}
        placeholder={t("crud.storageStructure.placeholder." + field)}
        mt="xs"
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createNumberField = (field) => {
    const ret = (
      <TextInput
        type={"number"}
        label={t("crud.storageStructure.label." + field)}
        placeholder={t("crud.storageStructure.placeholder." + field)}
        mt="xs"
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createNumberControlField = (field) => {
    const ret = (
      <NumberInput
        label={t("crud.storageStructure.label." + field)}
        placeholder={t("crud.storageStructure.placeholder." + field)}
        mt="xs"
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onCreate = (values) => {
    setWorking(true);

    const params = {
      token: user.token,
      siteId: siteId,
      floorId: floorId,
      data: values,
    };
    
    createRack(params)
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
    <Container size={"xl"}>
      <ScrollArea>
        <Container>
          <ResponceNotification
            opened={responseModalOpen}
            onClose={onClose}
            code={response?.code}
            title={response?.title}
            text={response?.text}
          />

          <LoadingOverlay overlayOpacity={0.5} visible={working} />
          <Title
            mb={"lg"}
            order={2}
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 700,
            })}
          >
            {t("crud.storageStructure.title.create")}
          </Title>

          <Notification
            icon={<IconBellRinging size={18} />}
            disallowClose
            color="blue"
            title={t("notification.title")}
            mb={"xs"}
          >
            {t("crud.storageStructure.message.create")}
          </Notification>

          <form
            onSubmit={form.onSubmit((values) => {
              onCreate(values);
            })}
          >
            <Group grow mb="lg">
              {createTextField("name")}
            </Group>

            <Grid>
              <Grid.Col span={4}>
                <Stack align="center" justify="flex-start">
                  {createNumberControlField("numberOfModules")}
                  {createNumberField("moduleWidth")}
                  {createNumberField("moduleHeight")}
                  {createNumberField("moduleDepth")}
                </Stack>
              </Grid.Col>

              <Grid.Col span={4}>
                <Stack align="center" justify="flex-start">
                  {createNumberField("baseHeight")}
                  {createNumberField("shelfHeight")}
                  {createNumberField("verticalPanelWidth")}
                </Stack>
              </Grid.Col>
              <Grid.Col span={4}>
                <Stack justify="flex-start">
                  {createNumberControlField("numberOfShelvesByModule")}
                  {createNumberField("panelWidth")}
                  {createNumberField("spaceHeight")}
                </Stack>
              </Grid.Col>
            </Grid>

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
      </ScrollArea>
    </Container>
  );
}
