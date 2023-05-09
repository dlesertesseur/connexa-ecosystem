import ResponceNotification from "../../../Modal/ResponceNotification";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findAllBrands } from "../../../Features/Brand";
import { clearError, findAllCountries, findProductById, remove } from "../../../Features/Product";
import { useNavigate } from "react-router-dom";
import { actions } from "../../../Constants";

export function DeletePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { brands } = useSelector((state) => state.brand.value);
  const { countries, error, errorCode, errorMessage, processing, selectedRowId, product, appState } = useSelector(
    (state) => state.product.value
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    const parameters = {
      token: user.token,
    };
    dispatch(findAllBrands(parameters));
    dispatch(findAllCountries(parameters));
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedRowId) {
      const params = {
        token: user.token,
        id: selectedRowId,
      };
      dispatch(findProductById(params));
    }
  }, [dispatch, selectedRowId, user]);

  useEffect(() => {
    if (product) {
      form.setFieldValue("sku", product.sku);
      form.setFieldValue("ean", product.ean);
      form.setFieldValue("description", product.description);
      form.setFieldValue("brand", product.brand.id);
      form.setFieldValue("countryOfOrigin", product.countryOfOrigin.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    if(appState === actions.deleted){
      navigate(-1);
    }
  }, [appState, navigate]);

  const form = useForm({
    initialValues: {
      sku: "",
      ean: "",
      description: "",
      brand: "",
      countryOfOrigin: "",
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        disabled={true}
        label={t("crud.product.label." + field)}
        placeholder={
          t("crud.product.placeholder." + field).startsWith("crud.") ? "" : t("crud.product.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectField = (field, data) => {
    const list = data?.map((c) => {
      return { value: c.id, label: c.name };
    });
    const ret = (
      <Select
        disabled
        label={t("crud.product.label." + field)}
        data={list ? list : []}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onDelete = () => {
    const params = {
      token: user.token,
      id: product.id
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
          {t("crud.product.title.delete")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
          })}
        >
          <Group mb={"md"}>{createTextField("sku")}</Group>
          <Group mb={"md"}>{createTextField("ean")}</Group>
          <Group grow mb={"md"}>
            {createTextField("description")}
          </Group>
          <Group mb={"md"}>{createSelectField("brand", brands)}</Group>
          <Group mb={"md"}>{createSelectField("countryOfOrigin", countries)}</Group>
          <Group position="right" mt="xl" mb="xs">
            <Button
              onClick={(event) => {
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
