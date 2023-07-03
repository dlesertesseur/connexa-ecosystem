import DeleteConfirmation from "../../../../Modal/DeleteConfirmation";
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
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AbmStateContext } from "./Context";
import { deleteGraph, findAllGraphHeaderById, findGraphById } from "../../../../DataAccess/Graph";
import ResponceNotification from "../../../../Modal/ResponceNotification";

export function DeletePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { site, floor, refresh, selectedRowId, initilizeContext } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [working, setWorking] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const form = useForm({
    initialValues: {
      description: "",
    },

    validate: {},
  });

  const getData = async () => {
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
      graphId: selectedRowId,
    };

    setWorking(true);

    const ret = await findAllGraphHeaderById(params);

    form.setFieldValue("description", ret.description);

    setWorking(false);
  };

  useEffect(() => {
    getData();
  }, [user]);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        disabled
        label={t("crud.floorGrapthEditor.label." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onDelete = async () => {
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
      graphId: selectedRowId
    };

    setWorking(true);

    try {
      const ret = await deleteGraph(params);
      if (ret.error) {
        setWorking(false);
        setErrorMessage(ret.message);
      } else {
        setErrorMessage(null);
        setWorking(false);
        refresh();
        navigate("../");
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setWorking(false);
  };

  const onConfirm = () => {
    onDelete();
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <ResponceNotification
        opened={errorMessage ? true : false}
        onClose={() => {
          setErrorMessage(null);
        }}
        code={errorMessage}
        title={t("status.error")}
        text={errorMessage}
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
          {t("crud.floorGrapthEditor.title.delete")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("description")}
          </Group>

          <Group position="right" mt="xl" mb="xs">
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={(event) => {
                initilizeContext();
                navigate("../");
              }}
            >
              {t("button.cancel")}
            </Button>
          </Group>
        </form>
      </Container>
    </Container>
  );
}
