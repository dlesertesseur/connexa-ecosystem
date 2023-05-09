import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { clearError, findCategoryById, update } from "../../../Features/Category";
import { useDispatch, useSelector } from "react-redux";
import { actions} from "../../../Constants";
import { useNavigate } from "react-router-dom";

export function UpdatePage() {
  const { t } = useTranslation();
  const { user,} = useSelector((state) => state.auth.value);
  const {
    error,
    errorCode,
    errorMessage,
    processing,
    selectedRowId,
    appState,
    category
  } = useSelector((state) => state.category.value);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedRowId) {
      const params = {
        token: user.token,
        id: selectedRowId,
      };
      dispatch(findCategoryById(params));
    }
  }, [dispatch, selectedRowId, user]);

  useEffect(() => {
    if (category) {
      form.setFieldValue("name", category.name);
      //form.setFieldValue("description", category.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

   useEffect(() => {
    if (appState === actions.updated) {
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
      // description: (val) => (val ? null : t("validation.required")),
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

  const onUpdate = (values) => {
    const params = {
      token: user.token,
      name: values.name,
      description: values.description,
      id: category.id,
    };

    dispatch(update(params));
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
          {t("crud.category.title.update")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onUpdate(values);
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
