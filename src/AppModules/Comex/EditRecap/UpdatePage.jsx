import {
  Title,
  Container,
  Button,
  Group,
  Select,
  LoadingOverlay,
  ScrollArea,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { AbmStateContext } from "./Context";
import { HEADER_HIGHT } from "../../../Constants";
import {
  updateComexRecap,
  findAllComexCountryPorts,
  findAllComexCountrySuppliers,
  findComexRecapById,
} from "../../../DataAccess/ComexRecap";
import { config } from "../../../Constants/config";

export function UpdatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const [working, setWorking] = useState(false);

  const [countriesList, setCountriesList] = useState(null);
  const [suppliersList, setSuppliersList] = useState(null);
  const [campaignList, setCampaignList] = useState(null);
  const [originShippingPortList, setOriginShippingPortList] = useState(null);
  const [destinationShippingPortList, setDestinationShippingPortList] = useState(null);
  const [importationTypesList, setImportationTypesList] = useState(null);
  const [incotermsList, setIncotermsList] = useState(null);
  const [currencyList, setCurrencyList] = useState(null);
  const [paymentTermsList, setPaymentTermsList] = useState(null);
  const [statusList, setStatusList] = useState(null);
  const [departmentList, setDepartmentList] = useState(null);
  const [transportTypeList, setTransportTypeList] = useState(null);
  const [recap, setRecap] = useState(null);
  const navigate = useNavigate();

  const {
    setReload,
    campaigns,
    countries,
    importationTypes,
    incoterms,
    currencies,
    paymentTerms,
    status,
    departments,
    transportationType,
    selectedRowId,
  } = useContext(AbmStateContext);

  const getData = async () => {
    const params = {
      token: user.token,
      apikey : config.COMEX_API_KEY,
      id: selectedRowId,
    };
    const recaps = await findComexRecapById(params);
    if (recaps && recaps.length > 0) {
      setRecap(recaps[0]);
    }
  };

  useEffect(() => {
    let ret = countries.map((c) => {
      const obj = { value: c.id, label: c.name };
      return obj;
    });
    setCountriesList(ret);

    ret = campaigns?.map((c) => {
      const obj = { value: c.id, label: c.name };
      return obj;
    });
    setCampaignList(ret);

    ret = importationTypes?.map((c) => {
      const obj = { value: c.id, label: c.name };
      return obj;
    });
    setImportationTypesList(ret);

    ret = incoterms?.map((c) => {
      const obj = { value: c.id, label: c.name };
      return obj;
    });
    setIncotermsList(ret);

    ret = currencies?.map((c) => {
      const obj = { value: c.id, label: `${c.name} (${c.abbreviation})` };
      return obj;
    });
    setCurrencyList(ret);

    ret = status?.map((c) => {
      const obj = { value: c.id, label: c.name };
      return obj;
    });
    setStatusList(ret);

    ret = paymentTerms?.map((c) => {
      const obj = { value: c.id, label: c.name };
      return obj;
    });
    setPaymentTermsList(ret);

    ret = departments?.map((c) => {
      const obj = { value: c.id, label: c.name };
      return obj;
    });
    setDepartmentList(ret);

    ret = transportationType?.map((c) => {
      const obj = { value: c.id, label: c.name };
      return obj;
    });
    setTransportTypeList(ret);

    console.log("*** INITIALIZE LIST UPDATE ***");

    getData();
  }, [
    campaigns,
    countries,
    importationTypes,
    incoterms,
    currencies,
    paymentTerms,
    status,
    departments,
    transportationType,
    selectedRowId,
  ]);

  const selectOriginCountry = async (country) => {
    const params = {
      token: user.token,
      apikey : config.COMEX_API_KEY,
      countryId: country,
    };
    const ports = await findAllComexCountryPorts(params);
    let ret = ports.map((p) => {
      const obj = { value: p.id, label: p.name };
      return obj;
    });
    setOriginShippingPortList(ret);

    const suppliers = await findAllComexCountrySuppliers(params);
    ret = suppliers.map((s) => {
      const obj = { value: s.id, label: s.name };
      return obj;
    });
    setSuppliersList(ret);
  };

  const selectDestinationCountry = async (country) => {
    const params = {
      token: user.token,
      apikey : config.COMEX_API_KEY,
      countryId: country,
    };
    const ports = await findAllComexCountryPorts(params);

    let ret = ports.map((p) => {
      const obj = { value: p.id, label: p.name };
      return obj;
    });
    setDestinationShippingPortList(ret);
  };

  const form = useForm({
    initialValues: {
      description: "",
      campaign: null,
      supplier: null,
      originCountry: null,
      destinationCountry: null,
      originShippingPort: null,
      destinationShippingPort: null,
      importationType: null,
      productionTime: null,
      incoterm: null,
      currency: null,
      status: null,
      paymentTerms: null,
      department: null,
      transportType: null,
    },

    validate: {
      description: (val) => (val ? null : t("validation.required")),
      campaign: (val) => (val ? null : t("validation.required")),
      supplier: (val) => (val ? null : t("validation.required")),
      originCountry: (val) => (val ? null : t("validation.required")),
      destinationCountry: (val) => (val ? null : t("validation.required")),
      originShippingPort: (val) => (val ? null : t("validation.required")),
      destinationShippingPort: (val) => (val ? null : t("validation.required")),
      importationType: (val) => (val ? null : t("validation.required")),
      productionTime: (val) => (val ? null : t("validation.required")),
      incoterm: (val) => (val ? null : t("validation.required")),
      currency: (val) => (val ? null : t("validation.required")),
      status: (val) => (val ? null : t("validation.required")),
      paymentTerms: (val) => (val ? null : t("validation.required")),
      department: (val) => (val ? null : t("validation.required")),
      transportType: (val) => (val ? null : t("validation.required")),
    },
  });

  const createSelectOriginCountry = (field, disabled, data) => {
    const ret = (
      <Select
        label={t("comex.recap.label." + field)}
        data={data ? data : []}
        disabled={disabled}
        placeholder={t("comex.recap.placeholder." + field)}
        {...form.getInputProps(field)}
        onChange={(env) => {
          form.setFieldValue(field, env);
          selectOriginCountry(env);
        }}
      />
    );

    return ret;
  };

  const createSelectDestinationCountry = (field, disabled, data) => {
    const ret = (
      <Select
        label={t("comex.recap.label." + field)}
        data={data ? data : []}
        disabled={disabled}
        placeholder={t("comex.recap.placeholder." + field)}
        {...form.getInputProps(field)}
        onChange={(env) => {
          form.setFieldValue(field, env);
          selectDestinationCountry(env);
        }}
      />
    );

    return ret;
  };

  const createSelect = (field, disabled, data) => {
    const ret = (
      <Select
        label={t("comex.recap.label." + field)}
        data={data ? data : []}
        disabled={disabled}
        placeholder={t("comex.recap.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createTextField = (field) => {
    const ret = (
      <TextInput
        w={"100%"}
        label={t("comex.recap.label." + field)}
        placeholder={t("comex.recap.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createNumberField = (field) => {
    const ret = (
      <NumberInput
        w={"100%"}
        label={t("comex.recap.label." + field)}
        placeholder={t("comex.recap.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  const assignData = async () => {
    const params = {
      token: user.token,
      apikey : config.COMEX_API_KEY,
      id: selectedRowId,
    };
    const recaps = await findComexRecapById(params);
    if (recaps && recaps.length > 0) {
      setRecap(recaps[0]);
    }
  };

  useEffect(() => {
    const f = async () => {
      if (recap) {
        form.setFieldValue("description", recap.description);
        form.setFieldValue("campaign", recap.campaign.id);
        form.setFieldValue("originCountry", recap.originCountry.id);
        form.setFieldValue("destinationCountry", recap.destinationCountry.id);
        form.setFieldValue("importationType", recap.importationType.id);
        form.setFieldValue("productionTime", recap.totalManufacturingTimeInDays);
        form.setFieldValue("incoterm", recap.incoterm.id);
        form.setFieldValue("currency", recap.currency.id);
        form.setFieldValue("status", recap.status);
        form.setFieldValue("paymentTerms", recap.paymentTerm.id);
        form.setFieldValue("department", recap.department.id);
        form.setFieldValue("transportType", recap.transportationMode.id);

        await selectDestinationCountry(recap.destinationCountry.id);
        await selectOriginCountry(recap.originCountry.id);

        form.setFieldValue("supplier", recap.supplier.id);
        form.setFieldValue("originShippingPort", recap.originPort.id);
        form.setFieldValue("destinationShippingPort", recap.destinationPort.id);
      }
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recap]);

  const onUpdate = async (values) => {
    const params = {
      token: user.token,
      body: { ...values },
    };

    setWorking(true);
    try {
      await updateComexRecap(params);
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
          {t("comex.recap.title.update")}
        </Title>

        <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT }}>
          <form
            onSubmit={form.onSubmit((values) => {
              onUpdate(values);
            })}
          >
            <Group mb={"md"} grow>
              {createSelect("campaign", campaignList ? false : true, campaignList)}
              {createSelect("department", departmentList ? false : true, departmentList)}
            </Group>
            <Group mb={"md"} grow>
              {createTextField("description")}
            </Group>
            <Group mb={"md"} grow>
              {createSelectOriginCountry("originCountry", countriesList ? false : true, countriesList)}
              {createSelectDestinationCountry("destinationCountry", countriesList ? false : true, countriesList)}
            </Group>

            <Group mb={"md"} grow>
              {createSelect("originShippingPort", originShippingPortList ? false : true, originShippingPortList)}
              {createSelect(
                "destinationShippingPort",
                destinationShippingPortList ? false : true,
                destinationShippingPortList
              )}
            </Group>

            <Group mb={"md"} grow>
              {createSelect("supplier", suppliersList ? false : true, suppliersList)}
              {createSelect("transportType", transportTypeList ? false : true, transportTypeList)}
            </Group>

            <Group mb={"md"} grow>
              {createSelect("incoterm", incotermsList ? false : true, incotermsList)}
              {createSelect("currency", currencyList ? false : true, currencyList)}
            </Group>

            <Group mb={"md"} grow>
              {createSelect("importationType", importationTypesList ? false : true, importationTypesList)}
              {createNumberField("productionTime")}
            </Group>

            <Group mb={"md"} grow>
              {createSelect("status", statusList ? false : true, statusList)}
              {createSelect("paymentTerms", paymentTermsList ? false : true, paymentTermsList)}
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
