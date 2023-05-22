import ResponceNotification from "../../../Modal/ResponceNotification";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Select, ScrollArea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mantine/dates";
import { clearError, findAllCountries, findWorkerById, remove } from "../../../Features/Worker";
import { useViewportSize } from "@mantine/hooks";

export function DeletePage() {
  const { t, i18n } = useTranslation();
  const { user, organizationSelected } = useSelector((state) => state.auth.value);
  const {
    countries,
    error,
    errorCode,
    errorMessage,
    updating,
    selectedRowId,
    loadingCountries,
    loadingWorker,
    worker,
  } = useSelector((state) => state.worker.value);
  const { height } = useViewportSize();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    const params = { token: user.token };
    dispatch(findAllCountries(params));
  }, [dispatch, user]);

  useEffect(() => {
    const params = { token: user.token, id: selectedRowId };
    dispatch(findWorkerById(params));
  }, [dispatch, selectedRowId, user]);

  const form = useForm({
    initialValues: {
      nid: "",
      lastname: "",
      firstname: "",
      address: "",
      phone: "",
      email: "",
      country: "",
      city: "",
      status: "",
      active: "",
      birthDate: "",
    },

    validate: {},
  });

  useEffect(() => {
    if (worker) {
      form.setFieldValue("nid", worker.nid);
      form.setFieldValue("lastname", worker.lastname);
      form.setFieldValue("firstname", worker.firstname);
      form.setFieldValue("address", worker.address);
      form.setFieldValue("phone", worker.phone);
      form.setFieldValue("email", worker.email);
      form.setFieldValue("country", worker.country);
      form.setFieldValue("city", worker.city);
      form.setFieldValue("status", worker.status);
      form.setFieldValue("active", worker.active);
      form.setFieldValue("birthDate", new Date(worker.birthDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker]);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        disabled={true}
        label={t("crud.worker.label." + field)}
        placeholder={
          t("crud.worker.placeholder." + field).startsWith("crud.") ? "" : t("crud.worker.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createDateField = (field) => {
    const ret = (
      <DatePicker
        disabled={true}
        locale={i18n.language}
        inputFormat="DD/MM/YYYY"
        firstDayOfWeek="sunday"
        label={t("crud.worker.label." + field)}
        placeholder={
          t("crud.worker.placeholder." + field).startsWith("crud.") ? "" : t("crud.worker.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectCountries = () => {
    const list = countries?.map((c) => {
      return { value: c.name, label: c.name };
    });
    const ret = (
      <Select
        label={t("crud.worker.label.country")}
        data={list ? list : []}
        {...form.getInputProps("country")}
        disabled={true}
      />
    );

    return ret;
  };

  const createSelectCities = () => {
    let ret = null;
    if (form.values?.country) {
      const c = countries.find((p) => p.name === form.values?.country);
      if (c) {
        const list = c.provinces.map((p) => {
          return { value: p.name, label: p.name };
        });
        ret = (
          <Select
            label={t("crud.worker.label.city")}
            data={list ? list : []}
            {...form.getInputProps("city")}
            disabled={true}
          />
        );
      }
    }

    return ret;
  };

  const onDelete = () => {
    const params = {
      token: user.token,
      id: worker.id,
      organizationId:organizationSelected.id
    };
    dispatch(remove(params));
  };

  const onClose = () => {
    dispatch(clearError());
    navigate("../");
  };

  const onConfirm = () => {
    onDelete();
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      {error ? (
        <ResponceNotification opened={error} onClose={onClose} code={errorCode} title={error} text={errorMessage} />
      ) : null}

      <DeleteConfirmation
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
        title={t("notification.title")}
        text={t("notification.delete")}
      />

      <LoadingOverlay overlayOpacity={0.5} visible={loadingCountries || updating || loadingWorker} />
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
          {t("crud.worker.title.delete")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
          })}
        >
          <ScrollArea style={{ flex: 1, height: height - 300 }}>
            <Group mb={"md"}>{createTextField("nid")}</Group>

            <Group grow mb={"md"}>
              {createTextField("lastname")}
            </Group>

            <Group grow mb={"md"}>
              {createTextField("firstname")}
            </Group>

            <Group mb={"md"}>{createDateField("birthDate")}</Group>

            <Group grow mb={"md"}>
              {createTextField("address")}
            </Group>

            <Group mb={"md"}>{createTextField("phone")}</Group>

            <Group grow mb={"md"}>
              {createTextField("email")}
            </Group>

            <Group mb={"md"}>{createSelectCountries()}</Group>

            {form.values?.country ? <Group mb={"md"}>{createSelectCities()}</Group> : null}
          </ScrollArea>
          <Group position="right" mt="xl" mb="xs">
            <Button
              onClick={(event) => {
                navigate("../");
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
