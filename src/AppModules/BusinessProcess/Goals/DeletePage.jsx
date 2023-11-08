import ResponceNotification from "../../../Modal/ResponceNotification";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";
import { Title, Container, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteBusinessGoal, findBusinessGoalById } from "../../../DataAccess/BusinessGoal";
import { useSelector } from "react-redux";
import { AbmStateContext } from "./Context";
import { DatePicker } from "@mantine/dates";
import "dayjs/locale/es";
import "dayjs/locale/en";

export function DeletePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload, selectedRowId } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [working, setWorking] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      // description: "",
      startDate: null,
      endDate: null,
    },

    validate: {},
  });

  const getData = async () => {
    const params = {
      token: user.token,
      id: selectedRowId,
    };

    setWorking(true);

    const ret = await findBusinessGoalById(params);
    form.setFieldValue("name", ret.name);
    // form.setFieldValue("description", ret.description);
    form.setFieldValue("startDate", new Date(ret.startDate));
    form.setFieldValue("endDate", new Date(ret.endDate));

    setWorking(false);
  };

  useEffect(() => {
    getData();
  }, [user]);

  const onDelete = async () => {
    const params = {
      token: user.token,
      id: selectedRowId,
    };

    setWorking(true);
    try {
      const ret = await deleteBusinessGoal(params);
      if (ret.error) {
        setWorking(false);
        setErrorMessage(ret.message);
      } else {
        setErrorMessage(null);
        setWorking(false);

        setReload(Date.now());
        navigate("../");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setWorking(false);
  };

  const onConfirm = () => {
    onDelete();
  };

  const createTextField = (field) => {
    const ret = (
      <TextInput
        disabled
        label={t("crud.businessGoal.label." + field)}
        placeholder={
          t("crud.businessGoal.placeholder." + field).startsWith("crud.")
            ? ""
            : t("crud.businessGoal.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createDateField = (field) => {
    const ret = (
      <DatePicker
        disabled
        locale={i18n.language}
        inputFormat="YYYY/MM/DD"
        firstDayOfWeek="sunday"
        label={t("crud.businessGoal.label." + field)}
        placeholder={t("crud.businessGoal.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
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
          {t("crud.businessGoal.title.delete")}
        </Title>

        <form
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name", true)}
          </Group>
          {/* <Group grow mb={"md"}>
            {createTextField("description", true)}
          </Group> */}
          <Group grow mb={"md"}>
            {createDateField("startDate", true)}
            {createDateField("endDate", true)}
          </Group>
          <Group position="right" mt="xl" mb="xs">
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={(event) => {
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
