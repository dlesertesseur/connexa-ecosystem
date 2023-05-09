import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { clearError, create } from "../../../Features/Category";
import { useNavigate } from "react-router-dom";
import { actions } from "../../../Constants";

export function CreatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { error, errorCode, errorMessage, appState, processing, categoriesRoot } = useSelector((state) => state.category.value);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (appState === actions.created) {
      navigate(-1);
    }
  }, [appState, navigate]);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      //description: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("crud.category.label." + field)}
        placeholder={
          t("crud.category.placeholder." + field).startsWith("crud.") ? "" : t("crud.category.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createTextAreaField = (field) => {
    const ret = (
      <Textarea
        minRows={3}
        maxRows={6}
        label={t("crud.category.label." + field)}
        placeholder={
          t("crud.category.placeholder." + field).startsWith("crud.") ? "" : t("crud.category.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onCreate = (values) => {
    const params = {
      token: user.token,
      name: values.name,
      description: values.description,
      parentId:categoriesRoot.id
    };

    dispatch(create(params));
  };

  const onClose = () => {
    dispatch(clearError());
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      {error ? (
        <ResponceNotification opened={error} onClose={onClose} code={errorCode} title={error} text={errorMessage} />
      ) : null}

      <LoadingOverlay overlayOpacity={0.5} visible={processing} />
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
          {t("crud.category.title.create")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          <Group mb={"md"} grow>
            {createTextField("name")}
          </Group>
          <Group mb={"md"} grow>
            {createTextAreaField("description")}
          </Group>

          <Group position="right" mt="xl" mb="xs">
            <Button
              onClick={(event) => {
                navigate(-1);
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
