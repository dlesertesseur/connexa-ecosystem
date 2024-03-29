import ResponceNotification from "../../../Modal/ResponceNotification";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  findOrganizationById,
  updateOrganization,
} from "../../../DataAccess/Organization";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { AbmStateContext } from "./Context";

export function UpdatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload, selectedRowId } = useContext(AbmStateContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [working, setWorking] = useState(false);

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

  const getData = async () => {
    const params = {
      token: user.token,
      id: selectedRowId,
    };

    setWorking(true);

    const ret = await findOrganizationById(params);
    form.setFieldValue("name", ret.name);
    form.setFieldValue("description", ret.description);

    setWorking(false);
  };

  useEffect(() => {
    getData();
  }, [user]);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.organization.label." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onUpdate = async (values) => {
    
    const params = {
      token: user.token,
      data: values,
      id: selectedRowId
    };
    
    setWorking(true);
    try {
      const ret = await updateOrganization(params);
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
      setErrorMessage(error);
    }
    setWorking(false);
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

        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onUpdate(values);
          })}
        >
          <Group grow mb={"md"}>
            {createTextField("name")}
          </Group>
          <Group grow mb={"md"}>
            {createTextField("description")}
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
