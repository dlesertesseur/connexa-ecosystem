import ResponceNotification from "../../../Modal/ResponceNotification";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser, findUserById } from "../../../DataAccess/User";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useWindowSize } from "../../../Hook";

export function DeletePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload, selectedRowId } = useContext(AbmStateContext);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [userFound, setUserFound] = useState(null);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const findUser = async (params) => {
    setLoading(true);
    try {
      //Cambiar por findById
      const found = await findUserById(params);

      if (found.error) {
        setErrorMessage(found.error);
        setErrorCode(found.status);
        setUserFound(null);
      } else {
        setErrorMessage(null);
        setErrorCode(null);
        setUserFound(found);
      }
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
      // nid: "",
      lastname: "",
      firstname: "",
      // address: "",
      // phone: "",
      email: "",
      // country: "",
      // city: "",
      // status: "",
      // active: "",
      // birthDate: "",
    },

    validate: {},
  });

  useEffect(() => {
    if (userFound) {
      // form.setFieldValue("nid", userFound.nid);
      form.setFieldValue("lastname", userFound.lastname);
      form.setFieldValue("firstname", userFound.firstname);
      // form.setFieldValue("address", userFound.address);
      // form.setFieldValue("phone", userFound.phone);
      form.setFieldValue("email", userFound.email);
      // form.setFieldValue("country", userFound.country);
      // form.setFieldValue("city", userFound.city);
      // form.setFieldValue("status", userFound.status);
      //form.setFieldValue("active", userFound.active);
      // form.setFieldValue("birthDate", new Date(userFound.birthDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFound]);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        disabled={true}
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
  //       disabled={true}
  //       locale={i18n.language}
  //       inputFormat="DD/MM/YYYY"
  //       firstDayOfWeek="sunday"
  //       label={t("crud.user.label." + field)}
  //       placeholder={
  //         t("crud.user.placeholder." + field).startsWith("crud.") ? "" : t("crud.user.placeholder." + field)
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
  //       disabled={true}
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
  //           disabled={true}
  //         />
  //       );
  //     }
  //   }

  //   return ret;
  // };

  const onDelete = async () => {
    const params = {
      token: user.token,
      id: userFound.id,
    };
    await deleteUser(params);
    setReload(Date.now());
    navigate("../");
  };

  const onClose = () => {
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

      <LoadingOverlay overlayOpacity={0.5} visible={loading} />
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
          {t("crud.user.title.delete")}
        </Title>

        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
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

            {form.values?.country ? <Group mb={"md"}>{createSelectCities()}</Group> : null} */}
          </ScrollArea>
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
