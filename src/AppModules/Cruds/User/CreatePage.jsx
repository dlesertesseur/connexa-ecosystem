import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, ScrollArea, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { createUser, findAllCountries } from "../../../DataAccess/User";
import { useState } from "react";
import "dayjs/locale/es";
import "dayjs/locale/en";
import { AbmStateContext } from "./Context";
import { useContext } from "react";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT } from "../../../Constants";

export function CreatePage() {
  const { t, i18n } = useTranslation();
  const { setReload } = useContext(AbmStateContext);
  const { user } = useSelector((state) => state.auth.value);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [creating, setCreating] = useState(false);
  const [countries, setCountries] = useState([]);
  const wSize = useWindowSize();

  const navigate = useNavigate();

  const findCountries = async () => {
    const params = { token: user.token };
    const coutries = await findAllCountries(params);
    setCountries(coutries);
  };

  useEffect(() => {
    findCountries();
  }, [user]);

  const create = async (values) => {
    const params = { token: user.token, data: values };
    setCreating(true);
    await createUser(params);
    setCreating(false);
    setReload(Date.now());
    navigate("../../");
  };

  const form = useForm({
    initialValues: {
      // nid: "",
      lastname: "",
      firstname: "",
      // address: "",
      // phone: "",
      email: "",
      // country: "",
      // city: "",
      // status: "",
      active: "",
      // birthDate: "",
    },

    validate: {
      // nid: (val) => /^\d{8,10}$/.test(val) ? null : t("validation.idNumberFormat"),
      lastname: (val) => (val ? null : t("validation.required")),
      firstname: (val) => (val ? null : t("validation.required")),
      // address: (val) => (val ? null : t("validation.required")),
      // phone: (val) => /^[a-zA-Z0-9\-().\s]{10,16}$/.test(val) ? null : t("validation.phoneNumberFormat"),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : t("validation.emailFormat")),
      // country: (val) => (val ? null : t("validation.required")),
      // city: (val) => (val ? null : t("validation.required")),
      // birthDate: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.user.label." + field)}
        placeholder={t("crud.user.placeholder." + field).startsWith("crud.") ? "" : t("crud.user.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  // const createDateField = (field) => {
  //   const ret = (
  //     <DatePicker
  //       locale={i18n.language}
  //       inputFormat="YYYY/MM/DD"
  //       firstDayOfWeek="sunday"
  //       label={t("crud.user.label." + field)}
  //       placeholder={
  //         t("crud.user.placeholder." + field).startsWith("crud.")
  //           ? ""
  //           : t("crud.user.placeholder." + field)
  //       }
  //       {...form.getInputProps(field)}
  //     />
  //   );

  //   return ret;
  // };

  // const createSelectCountries = () => {
  //   const list = countries?.map((c) => {
  //     return { value: c.name, label: c.name };
  //   });
  //   const ret = (
  //     <Select
  //       label={t("crud.user.label.country")}
  //       data={list ? list : []}
  //       {...form.getInputProps("country")}
  //     />
  //   );

  //   return ret;
  // };

  // const createSelectCities = () => {
  //   let ret = null;
  //   if (form.values?.country) {
  //     const c = countries.find((p) => p.name === form.values?.country);
  //     if (c) {
  //       const list = c.provinces.map((p) => {
  //         return { value: p.name, label: p.name };
  //       });
  //       ret = (
  //         <Select
  //           label={t("crud.user.label.city")}
  //           data={list ? list : []}
  //           {...form.getInputProps("city")}
  //         />
  //       );
  //     }
  //   }

  //   return ret;
  // };

  const onCreate = (values) => {
    create(values);
  };

  const onClose = () => {
    navigate("../../");
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      {error ? (
        <ResponceNotification opened={error} onClose={onClose} code={errorCode} title={error} text={errorMessage} />
      ) : null}

      <LoadingOverlay overlayOpacity={0.5} visible={creating} />
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
          {t("crud.user.title.create")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          <ScrollArea style={{ flex: 1 }}>
            {/* <Group mb={"md"}>{createTextField("nid")}</Group> */}

            <Group grow mb={"md"}>
              {createTextField("lastname")}
            </Group>

            <Group grow mb={"md"}>
              {createTextField("firstname")}
            </Group>

            {/* <Group mb={"md"}>{createDateField("birthDate")}</Group>

            <Group grow mb={"md"}>
              {createTextField("address")}
            </Group>

            <Group mb={"md"}>{createTextField("phone")}</Group> */}

            <Group grow mb={"md"}>
              {createTextField("email")}
            </Group>

            {/* <Group mb={"md"}>{createSelectCountries()}</Group>

            {form.values?.country ? (
              <Group mb={"md"}>{createSelectCities()}</Group>
            ) : null} */}
          </ScrollArea>
          <Group position="right" mt="xl" mb="xs">
            <Button
              onClick={(event) => {
                navigate("../../");
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
