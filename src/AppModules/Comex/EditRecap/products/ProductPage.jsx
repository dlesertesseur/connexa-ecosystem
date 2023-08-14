import { Title, Container, Button, Group, Select, LoadingOverlay, ScrollArea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { CRUD_PAGE_MODE, HEADER_HIGHT } from "../../../../Constants";
import { AbmStateContext } from "../Context";

export function ProductPage({ mode = CRUD_PAGE_MODE.new }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const [working, setWorking] = useState(false);

  const [departmentsList, setDepartmentsList] = useState(null);
  const [categoriesList, setCategoriesList] = useState(null);
  const [subcategoriesList, setSubcategoriesList] = useState(null);
  const [recap, setRecap] = useState(null);

  const [List, setList] = useState(null);

  const navigate = useNavigate();

  const { setReload, departments, selectedRowId } =
    useContext(AbmStateContext);

  // useEffect(() => {
  //   let ret = departments.map((c) => {
  //     const obj = { value: c.code, label: c.name };
  //     return obj;
  //   });
  //   setDepartmentsList(ret);

  //   ret = modalities?.map((c) => {
  //     const obj = { value: c.id, label: c.name };
  //     return obj;
  //   });
  //   setModalitiesList(ret);

  //   ret = factories.map((c) => {
  //     const obj = { value: c.code, label: c.name };
  //     return obj;
  //   });
  //   setFactoryList(ret);

  //   ret = paymentTerms.map((c) => {
  //     const obj = { value: c.id, label: c.name };
  //     return obj;
  //   });
  //   setPaymentTermsList(ret);

  //   ret = productionTimes.map((c) => {
  //     const obj = { value: c.code, label: c.value };
  //     return obj;
  //   });
  //   setProductionTimesList(ret);

  //   if (mode === CRUD_PAGE_MODE.update || mode === CRUD_PAGE_MODE.delete) {
  //     getData();
  //   }
  // }, [departments, modalities]);

  const selectCategory = async (category) => {
    // const params = {
    //   token: user.token,
    //   apikey: user.token,
    //   categoryId: category,
    // };
    // const ports = await findAllde(params);
    // let ret = ports.map((p) => {
    //   const obj = { value: p.id, label: p.name };
    //   return obj;
    // });
    // setCategoriesList(ret);
  };

  const getData = async () => {
    const params = {
      token: user.token,
      id: selectedRowId,
    };
    ret = await findComexRecapById(params);
    setRecap(ret);
  };

  const form = useForm({
    initialValues: {
      modality: null,
      sku: "",
      description: "",
      factory: null,
      department: null,
      vendorHost: "",
      paymentTerms: null,
      shippingPort: null,
      productionTimes: null,
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
      productionTimes: (val) => (val ? null : t("validation.required")),
    },
  });

  useEffect(() => {
    if (mode === CRUD_PAGE_MODE.update || mode === CRUD_PAGE_MODE.delete) {
      if (recap) {
        // form.setFieldValue("description", recap.description);
        // form.setFieldValue("campaign", recap.campaign.id);
        // form.setFieldValue("country", recap.country.code);
        // form.setFieldValue("supplier", recap.supplier.code);
        // setSelectedCountry(recap.country.code);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recap]);

  const createSelect = (field, data) => {
    let disabled = null;

    if (mode === CRUD_PAGE_MODE.delete) {
      disabled = true;
    } else {
      disabled = data ? false : true;
    }
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
    const disabled = mode === CRUD_PAGE_MODE.delete ? true : false;

    const ret = (
      <TextInput
        disabled={disabled}
        label={t("comex.recap.products.label." + field)}
        placeholder={t("comex.recap.products.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectCategory = (field, disabled, data) => {
    const ret = (
      <Select
        label={t("comex.recap.label." + field)}
        data={data ? data : []}
        disabled={disabled}
        placeholder={t("comex.recap.placeholder." + field)}
        {...form.getInputProps(field)}
        onChange={(env) => {
          form.setFieldValue(field, env);
          categoriesList(env);
        }}
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

        <ScrollArea type="scroll" px={"md"} style={{ width: "100%", height: height - HEADER_HIGHT - 140 }}>
          <form
            onSubmit={form.onSubmit((values) => {
              //onCreate(values);
            })}
          >
            <Group mb={"md"}>{createSelectCategory("department", categoryList ? false : true, categoryList)}</Group>
            <Group mb={"md"}>{createTextField("sku")}</Group>
            <Group mb={"md"} grow>
              {createTextField("description")}
            </Group>
            <Group mb={"md"}>{createSelect("department", departmentsList)}</Group>
            <Group mb={"md"} grow>
              {createSelect("factory", factoryList)}
            </Group>
            <Group mb={"md"} grow>
              {createTextField("vendorHost")}
              {createSelect("paymentTerms", paymentTermsList)}
            </Group>
            <Group mb={"md"} grow>
              {createSelect("shippingPort", shippingPortList)}
            </Group>
            <Group mb={"md"}>{createSelect("productionTimes", productionTimesList)}</Group>

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
