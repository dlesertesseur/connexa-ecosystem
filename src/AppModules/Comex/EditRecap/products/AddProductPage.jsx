import { Title, Container, Button, Group, Select, LoadingOverlay, ScrollArea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { HEADER_HIGHT } from "../../../../Constants";
import { AbmStateContext } from "../Context";

export function AddProductPage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const [working, setWorking] = useState(false);

  const [departmentsList, setDepartmentsList] = useState(null);
  const [modalitiesList, setModalitiesList] = useState(null);
  const [factoryList, setFactoryList] = useState(null);
  const [paymentTermsList, setPaymentTermsList] = useState(null);
  const [shippingPortList, setShippingPortList] = useState(null);
  const [productionTimesList, setProductionTimesList] = useState(null);

  const [List, setList] = useState(null);

  const navigate = useNavigate();

  const { setReload, departments, modalities, factories, paymentTerms, shippingPorts, productionTimes } = useContext(AbmStateContext);

  useEffect(() => {
    let ret = departments.map((c) => {
      const obj = { value: c.code, label: c.name };
      return obj;
    });
    setDepartmentsList(ret);

    ret = modalities.map((c) => {
      const obj = { value: c.code, label: c.name };
      return obj;
    });
    setModalitiesList(ret);

    ret = factories.map((c) => {
      const obj = { value: c.code, label: c.name };
      return obj;
    });
    setFactoryList(ret);

    ret = paymentTerms.map((c) => {
      const obj = { value: c.code, label: c.name };
      return obj;
    });
    setPaymentTermsList(ret);

    ret = shippingPorts.map((c) => {
      const obj = { value: c.code, label: c.name };
      return obj;
    });
    setShippingPortList(ret);

    ret = productionTimes.map((c) => {
      const obj = { value: c.code, label: c.value };
      return obj;
    });
    setProductionTimesList(ret);

  }, [departments, modalities]);

  const form = useForm({
    initialValues: {
      modality:null,
      sku: null,
      description: null,
      factory:null,
      department:null,
      vendorHost:"", 
      paymentTerms:null,
      shippingPort:null,
      productionTimes:null
    },

    validate: {
      modality: (val) => (val ? null : t("validation.required")),
      sku: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
      factory: (val) => (val ? null : t("validation.required")),
      department: (val) => (val ? null : t("validation.required")),
      vendorHost: (val) => (val ? null : t("validation.required")),
      paymentTerms: (val) => (val ? null : t("validation.required")),
      shippingPort: (val) => (val ? null : t("validation.required")),
      productionTimes: (val) => (val ? null : t("validation.required"))
    },
  });

  const createSelectCountry = (field, disabled, data) => {
    const ret = (
      <Select
        label={t("comex.recap.label." + field)}
        data={data ? data : []}
        disabled={disabled}
        placeholder={t("comex.recap.placeholder." + field)}
        {...form.getInputProps(field)}
        onChange={(env) => {
          form.setFieldValue(field, env);
          form.setFieldValue("supplier", null);
          setSelectedCountry(env);
        }}
      />
    );

    return ret;
  };

  const createSelect = (field, disabled, data) => {
    const ret = (
      <Select
        label={t("comex.recap.products.label." + field)}
        data={data ? data : []}
        disabled={disabled}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("comex.recap.products.label." + field)}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  const onCreate = async (values) => {
    const params = {
      token: user.token,
      body: { ...values },
    };

    console.log("parameters -> ", params);

    setWorking(true);
    try {
      await createComexRecap(params);
      setWorking(false);
      setReload(Date.now());
      navigate("../");
    } catch (error) {
      setWorking(false);
      setError(error);
    }
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
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
          {t("comex.recap.products.title.add")}
        </Title>

        <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT - 140 }}>
          <form
            onSubmit={form.onSubmit((values) => {
              onCreate(values);
            })}
          >
            <Group mb={"md"}>
              {createSelect("modality", modalitiesList ? false : true, modalitiesList)}
            </Group>
            <Group mb={"md"}>
              {createTextField("sku")}
            </Group>
            <Group mb={"md"} grow>
              {createTextField("description")}
            </Group>
            <Group mb={"md"}>
              {createSelect("department", departmentsList ? false : true, departmentsList)}
            </Group>
            <Group mb={"md"} grow>
              {createSelect("factory", factoryList ? false : true, factoryList)}
            </Group>
            <Group mb={"md"} grow>
              {createTextField("vendorHost")}
              {createSelect("paymentTerms", paymentTermsList ? false : true, paymentTermsList)}
            </Group>
            <Group mb={"md"} grow>
              {createSelect("shippingPort", shippingPortList ? false : true, shippingPortList)}
            </Group>
            <Group mb={"md"}>
              {createSelect("productionTimes", productionTimesList ? false : true, productionTimesList)}
            </Group>

            <Group position="right" mt="xl" mb="xs">
              <Button type="submit">{t("button.accept")}</Button>
              <Button onClick={onClose}>{t("button.cancel")}</Button>
            </Group>
          </form>
        </ScrollArea>
      </Container>
    </Container>
  );
}
