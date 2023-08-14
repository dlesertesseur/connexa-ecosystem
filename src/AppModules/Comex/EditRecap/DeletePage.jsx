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
  deleteComexRecap,
  findAllComexCountryPorts,
  findAllComexCountrySuppliers,
  findComexRecapById,
} from "../../../DataAccess/ComexRecap";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";

export function DeletePage() {
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
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

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
      apikey: user.token,
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

    console.log("*** INITIALIZE LIST DELETE ***");
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
      apikey: user.token,
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
      apikey: user.token,
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

    validate: {},
  });

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

  const createTextField = (field, disabled = false) => {
    const ret = (
      <TextInput
        disabled={disabled}
        w={"100%"}
        label={t("comex.recap.label." + field)}
        placeholder={t("comex.recap.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createNumberField = (field, disabled = false) => {
    const ret = (
      <NumberInput
        disabled={disabled}
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

  const onDelete = async (values) => {
    const params = {
      token: user.token,
      id: selectedRowId,
    };

    setWorking(true);
    try {
      await deleteComexRecap(params);
      setWorking(false);
      setReload(Date.now());
      navigate("../");
    } catch (error) {
      setWorking(false);
      setError(error);
    }
  };

  const onConfirm = () => {
    onDelete();
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <LoadingOverlay overlayOpacity={0.5} visible={working} />

      <DeleteConfirmation
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
        title={t("notification.title")}
        text={t("notification.delete")}
      />

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
          {t("comex.recap.title.delete")}
        </Title>

        <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT }}>
          <form
            onSubmit={form.onSubmit((values) => {
              setConfirmModalOpen(true);
            })}
          >
            <Group mb={"md"} grow>
              {createSelect("campaign", true, campaignList)}
              {createSelect("department", true, departmentList)}
            </Group>
            <Group mb={"md"} grow>
              {createTextField("description", true)}
            </Group>
            <Group mb={"md"} grow>
              {createSelectOriginCountry("originCountry", true, countriesList)}
              {createSelectDestinationCountry("destinationCountry", true, countriesList)}
            </Group>

            <Group mb={"md"} grow>
              {createSelect("originShippingPort", true, originShippingPortList)}
              {createSelect("destinationShippingPort", true, destinationShippingPortList)}
            </Group>

            <Group mb={"md"} grow>
              {createSelect("supplier", true, suppliersList)}
              {createSelect("transportType", true, transportTypeList)}
            </Group>

            <Group mb={"md"} grow>
              {createSelect("incoterm", true, incotermsList)}
              {createSelect("currency", true, currencyList)}
            </Group>

            <Group mb={"md"} grow>
              {createSelect("importationType", true, importationTypesList)}
              {createNumberField("productionTime", true)}
            </Group>

            <Group mb={"md"} grow>
              {createSelect("status", true, statusList)}
              {createSelect("paymentTerms", true, paymentTermsList)}
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
