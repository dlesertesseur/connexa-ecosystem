import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findFloorById, updateFloor } from "../../../DataAccess/Floors";

export function UpdateFloorPage({ user, siteId, floorId, back, onFilter }) {
  // const theme = useMantineTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [floor, setFloor] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
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
        width={"lg"}
        label={t("crud.floor.label." + field)}
        placeholder={t("crud.floor.placeholder." + field)}
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
      data: data,
    };
    updateFloor(params)
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
          navigate(back);
          onFilter();
        }
      })
      .catch((error) => {
        setResponse({ code: error.status, title: t("status.error"), text: error.message });
        setResponseModalOpen(true);
      });
  };

  const onClose = () => {
    setResponseModalOpen(false);
    navigate(back);
    onFilter();
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
          {t("crud.floor.title.update")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            const data = { ...floor };
            data.name = values.name;
            data.description = values.description;
            onUpdate(data);
          })}
        >
          <Group grow mb="lg">
            {createTextField("name")}
          </Group>
          <Group grow mb="lg">
            {createTextField("description")}
          </Group>

          {/* <Group grow mb="lg">
            <Dropzone
              onDrop={(files) => console.log("accepted files", files)}
              onReject={(files) => console.log("rejected files", files)}
              maxSize={3 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
            >
              <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: "none" }}>
                <Dropzone.Accept>
                  <IconUpload
                    size={50}
                    stroke={1.5}
                    color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={50} stroke={1.5} color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={50} stroke={1.5} />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    {t("label.dropZone")}
                  </Text>
                  <Text size="sm" color="dimmed" inline mt={7}>
                    {t("label.dropZoneSub")}
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </Group> */}

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
