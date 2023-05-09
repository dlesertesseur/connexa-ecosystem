import ResponceNotification from "../../../Modal/ResponceNotification";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, remove, findCategoryById } from "../../../Features/Category";
import { useNavigate } from "react-router-dom";
import { actions } from "../../../Constants";

export function DeletePage() {
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

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
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
    if (appState === actions.deleted) {
      navigate(-1);
    }
  }, [appState, navigate]);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        disabled
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
        disabled
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

  const onDelete = () => {
    const params = {
      token: user.token,
      id: category.id
    };
    dispatch(remove(params));
  };

  const onClose = () => {
    dispatch(clearError());
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
          {t("crud.category.title.delete")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
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
