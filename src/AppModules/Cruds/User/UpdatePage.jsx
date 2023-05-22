import ResponceNotification from "../../../Modal/ResponceNotification";
import {
  TextInput,
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
  Select,
  ScrollArea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useViewportSize } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mantine/dates";
import { findAllCountries } from "../../../DataAccess/User";
import { useState } from "react";

export function UpdatePage({ selectedRowId }) {
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [userFound, setUserFound] = useState([]);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const navigate = useNavigate();

  const findCountries = async () => {
    const params = { token: user.token };
    const coutries = await findAllCountries(params);
    setCountries(coutries);
  };

  useEffect(() => {
    findCountries();
  }, [user]);

  const findUser = async (params) => {
    console.log("UpdatePage findUser() ->", params);

    setLoading(true);
    try {

      //Cambiar por findById
      const found = await findUserByEmail(params);

      console.log("UpdatePage findUser() ->", found);

      setUserFound(found);
    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const params = { token: user.token, id: selectedRowId };
    findUser(params);
  }, [selectedRowId, user]);

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

    validate: {
      nid: (val) =>
        /^\d{8,10}$/.test(val) ? null : t("validation.idNumberFormat"),
      lastname: (val) => (val ? null : t("validation.required")),
      firstname: (val) => (val ? null : t("validation.required")),
      address: (val) => (val ? null : t("validation.required")),
      phone: (val) =>
        /^[a-zA-Z0-9\-().\s]{10,16}$/.test(val)
          ? null
          : t("validation.phoneNumberFormat"),
      email: (val) =>
        /^\S+@\S+$/.test(val) ? null : t("validation.emailFormat"),
      country: (val) => (val ? null : t("validation.required")),
      city: (val) => (val ? null : t("validation.required")),
      birthDate: (val) => (val ? null : t("validation.required")),
    },
  });

  useEffect(() => {
    if (userFound) {
      form.setFieldValue("nid", userFound.nid);
      form.setFieldValue("lastname", userFound.lastname);
      form.setFieldValue("firstname", userFound.firstname);
      form.setFieldValue("address", userFound.address);
      form.setFieldValue("phone", userFound.phone);
      form.setFieldValue("email", userFound.email);
      form.setFieldValue("country", userFound.country);
      form.setFieldValue("city", userFound.city);
      form.setFieldValue("status", userFound.status);
      form.setFieldValue("active", userFound.active);
      form.setFieldValue("birthDate", new Date(userFound.birthDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFound]);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.user.label." + field)}
        placeholder={
          t("crud.user.placeholder." + field).startsWith("crud.")
            ? ""
            : t("crud.user.placeholder." + field)
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
        label={t("crud.user.label." + field)}
        placeholder={
          t("crud.user.placeholder." + field).startsWith("crud.")
            ? ""
            : t("crud.user.placeholder." + field)
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
        label={t("crud.user.label.country")}
        data={list ? list : []}
        {...form.getInputProps("country")}
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
            label={t("crud.user.label.city")}
            data={list ? list : []}
            {...form.getInputProps("city")}
          />
        );
      }
    }

    return ret;
  };

  const onUpdate = (values) => {
    const params = {
      token: user.token,
      values: values,
    };
    // update(params));
  };

  const onClose = () => {
    navigate("../");
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      {error ? (
        <ResponceNotification
          opened={error}
          onClose={onClose}
          code={errorCode}
          title={error}
          text={errorMessage}
        />
      ) : null}

      <LoadingOverlay
        overlayOpacity={0.5}
        visible={loading}
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
          {t("crud.user.title.create")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onUpdate({ ...values, id: userFound.id });
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

            {form.values?.country ? (
              <Group mb={"md"}>{createSelectCities()}</Group>
            ) : null}
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
