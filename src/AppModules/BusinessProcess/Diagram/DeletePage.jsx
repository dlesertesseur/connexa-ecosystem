import DeleteConfirmation from "../../../Modal/DeleteConfirmation";
import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Skeleton } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { AbmStateContext } from "./Context";
import { HEADER_HIGHT } from "../../../Constants";
import { deleteBusinessProcessModel, findBusinessProcessModelById } from "../../../DataAccess/BusinessProcessModel";

export function DeletePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [businessProcessModel, setBusinessProcessModel] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const navigate = useNavigate();
  const { selectedRowId, setReload, setError } = useContext(AbmStateContext);

  const form = useForm({
    initialValues: {
      description: "",
      name: "",
    },

    validate: {},
  });

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findBusinessProcessModelById(params);
    setBusinessProcessModel(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  const createTextField = (field) => {
    const ret = businessProcessModel ? (
      <TextInput
        disabled={true}
        label={t("businessProcessModel.label." + field)}
        placeholder={t("businessProcessModel.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    ) : (
      <Skeleton visible={true} h={40}></Skeleton>
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
      await deleteBusinessProcessModel(params);
      setWorking(false);
      setReload(Date.now());
      navigate("../");
    } catch (error) {
      setWorking(false);
      setError(error);
    }
  };

  useEffect(() => {
    const f = async () => {
      if (businessProcessModel) {
        form.setFieldValue("name", businessProcessModel.name);
        form.setFieldValue("description", businessProcessModel.description);
      }
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessProcessModel]);

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
          {t("businessProcessModel.title.delete")}
        </Title>

        <form autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
          })}
        >
          {height ? (
            <>
              <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT - 72 }}>
                <Group mb={"md"} grow>
                  {createTextField("name")}
                </Group>
                <Group mb={"md"} grow>
                  {createTextField("description")}
                </Group>
              </ScrollArea>
              <Group position="right" mt="xl" mb="xs">
                <Button type="submit">{t("button.accept")}</Button>
                <Button onClick={onClose}>{t("button.cancel")}</Button>
              </Group>
            </>
          ) : null}
        </form>
      </Container>
    </Container>
  );
}
