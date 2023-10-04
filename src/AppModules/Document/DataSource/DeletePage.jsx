import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { AbmStateContext } from "./Context";
import { HEADER_HIGHT } from "../../../Constants";
import { deleteDataSource, findDataSourceById } from "../../../DataAccess/DataSource";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";

export function DeletePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const [working, setWorking] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [entity, setEntity] = useState(null);
  const navigate = useNavigate();

  const { setReload, selectedRowId, setError } = useContext(AbmStateContext);

  const getData = async () => {
    const params = {
      token: user.token,
      id: selectedRowId,
    };
    const entity = await findDataSourceById(params);
    setEntity(entity);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  const form = useForm({
    initialValues: {
      code: "",
      name: "",
      description: "",
    },

    validate: {},
  });

  useEffect(() => {
    const f = async () => {
      if (entity) {
        form.setFieldValue("code", entity.code);
        form.setFieldValue("name", entity.name);
        form.setFieldValue("description", entity.description);
      }
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  const createTextField = (field, disabled = false) => {
    const ret = (
      <TextInput
        disabled
        w={"100%"}
        label={t("dataSource.label." + field)}
        placeholder={t("dataSource.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createTextArea = (field) => {
    const ret = (
      <Textarea
        disabled
        w={"100%"}
        label={t("dataSource.label." + field)}
        placeholder={t("dataSource.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  const onDelete = async (values) => {
    const params = {
      token: user.token,
      id: selectedRowId,
    };

    setWorking(true);
    try {
      await deleteDataSource(params);
      setWorking(false);
      setReload(Date.now());
      navigate("../");
    } catch (error) {
      setWorking(false);
      setError(error);
    }
  };

  const onConfirm = () => {
    onDelete();
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <LoadingOverlay overlayOpacity={0.5} visible={working} />

      <DeleteConfirmation
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
        title={t("notification.title")}
        text={t("notification.delete")}
      />

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
          {t("dataSource.title.delete")}
        </Title>

        <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT }}>
          <form   autoComplete="false"
            onSubmit={form.onSubmit((values) => {
              setConfirmModalOpen(true);
            })}
          >
            <Group grow mb={"md"} w={"50%"}>
              {createTextField("code")}
            </Group>

            <Group mb={"md"} grow>
              {createTextField("name", true)}
            </Group>

            <Group mb={"md"} grow>
              {createTextArea("description", true)}
            </Group>

            <Group position="right" mt="xl" mb="xs">
              <Button type="submit">{t("button.accept")}</Button>
              <Button onClick={onClose}>{t("button.cancel")}</Button>
            </Group>
          </form>
        </ScrollArea>
      </Container>
    </Container>
  );
}
