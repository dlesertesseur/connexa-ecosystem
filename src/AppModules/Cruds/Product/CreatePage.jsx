import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { findAllBrands } from "../../../Features/Brand";
import { clearError, create, findAllCountries } from "../../../Features/Product";
import { useNavigate } from "react-router-dom";
import { actions } from "../../../Constants";

export function CreatePage({ onLoadGrid }) {
  const { t } = useTranslation();
  const { user, projectSelected } = useSelector((state) => state.auth.value);
  const { brands } = useSelector((state) => state.brand.value);
  const { countries, error, errorCode, errorMessage, appState, processing } = useSelector((state) => state.product.value);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const parameters = {
      token: user.token,
    };
    dispatch(findAllBrands(parameters));
    dispatch(findAllCountries(parameters));
  }, [dispatch, user]);


  useEffect(() => {
    if(appState === actions.created){
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

    validate: {
      sku: (val) => (val ? null : t("validation.required")),
      ean: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
      brand: (val) => (val ? null : t("validation.required")),
      countryOfOrigin: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
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
      <Select label={t("crud.product.label." + field)} data={list ? list : []} {...form.getInputProps(field)} />
    );

    return ret;
  };

  const onCreate = (values) => {
    const params = {
      token: user.token,
      sku: values.sku,
      ean: values.ean,
      description: values.description,
      brandId: values.brand,
      price: 0,
      currency: "PESO",
      status: "Activo",
      projectId: projectSelected.id,
      countryOfOriginId: values.countryOfOrigin,
      measurementTypeIdForContent: "Q",
      measurementUnitIdForContent: "UNIDADES",
      measurementTypeIdForSale: "Q",
      measurementUnitIdForSale: "UNIDADES",
      measurementTypeIdForPrice: "Q",
      measurementUnitIdForPrice: "UNIDADES",
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
          {t("crud.product.title.create")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
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
