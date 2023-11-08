import ResponceNotification from "../../../Modal/ResponceNotification";
import { Title, Container, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findBusinessGoalById, updateBusinessGoal } from "../../../DataAccess/BusinessGoal";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { DatePicker } from "@mantine/dates";
import "dayjs/locale/es";
import "dayjs/locale/en";

export function UpdatePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload, selectedRowId } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [working, setWorking] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      // description: "",
      startDate: null,
      endDate: null,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      // description: (val) => (val ? null : t("validation.required")),
      startDate: (val) => (val ? null : t("validation.required")),
      endDate: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    const params = {
      token: user.token,
      id: selectedRowId,
    };

    setWorking(true);

    const ret = await findBusinessGoalById(params);
    form.setFieldValue("name", ret.name);
    //form.setFieldValue("description", ret.description);
    form.setFieldValue("startDate", new Date(ret.startDate));
    form.setFieldValue("endDate", new Date(ret.endDate));

    setWorking(false);
  };

  useEffect(() => {
    getData();
  }, [user]);

  const onUpdate = async (values) => {
    const params = {
      token: user.token,
      name: values.name,
      startDate: values.startDate.getTime(),
      endDate: values.endDate.getTime(),
      id: selectedRowId,
    };

    setWorking(true);
    try {
      const ret = await updateBusinessGoal(params);
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

  const createTextField = (field) => {
    const ret = (
      <TextInput
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
          {t("crud.organization.title.update")}
        </Title>

        <form
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onUpdate(values);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          {/* <Group grow mb={"md"}>
            {createTextField("description")}
          </Group> */}
          <Group grow mb={"md"}>
            {createDateField("startDate")}
            {createDateField("endDate")}
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
