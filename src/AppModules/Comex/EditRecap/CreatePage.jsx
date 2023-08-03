import { Title, Container, Button, Group, Select, LoadingOverlay, ScrollArea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { AbmStateContext } from "./Context";
import { HEADER_HIGHT } from "../../../Constants";
import { createComexRecap } from "../../../DataAccess/ComexRecap";

export function CreatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const [working, setWorking] = useState(false);

  const [countriesList, setCountriesList] = useState(null);
  const [suppliersList, setSuppliersList] = useState(null);
  const [campaignList, setCampaignList] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState(null);

  const navigate = useNavigate();

  const { setReload, campaigns, countries } = useContext(AbmStateContext);

  useEffect(() => {
    let ret = countries.map((c) => {
      const obj = { value: c.code, label: c.country };
      return obj;
    });
    setCountriesList(ret);

    ret = campaigns.map((c) => {
      const obj = { value: c.id, label: c.event };
      return obj;
    });
    setCampaignList(ret);
  }, [countries, campaigns]);

  useEffect(() => {
    const country = countries.find((c) => c.code === selectedCountry);
    if (country) {
      const ret = country.providers.map((p) => {
        const obj = { value: p.code, label: p.name };
        return obj;
      });
      setSuppliersList(ret);
    }
  }, [selectedCountry]);

  const form = useForm({
    initialValues: {
      description: "",
      campaign: "",
      supplier: null,
      country: null,
    },

    validate: {
      description: (val) => (val ? null : t("validation.required")),
      campaign: (val) => (val ? null : t("validation.required")),
      supplier: (val) => (val ? null : t("validation.required")),
      country: (val) => (val ? null : t("validation.required")),
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
          {t("comex.recap.title.create")}
        </Title>

        <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT }}>
          <form
            onSubmit={form.onSubmit((values) => {
              onCreate(values);
            })}
          >
            <Group mb={"md"} grow>
              {createSelect("campaign", campaignList ? false : true, campaignList)}
            </Group>
            <Group mb={"md"} grow>
              {createTextField("description")}
            </Group>
            <Group mb={"md"} grow>
              {createSelectCountry("country", countriesList ? false : true, countriesList)}
              {createSelect("supplier", suppliersList ? false : true, suppliersList)}
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
