import { Title, Container, Button, Group, Select, LoadingOverlay, ScrollArea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { AbmStateContext } from "./Context";
import { HEADER_HIGHT } from "../../../Constants";
import { deleteComexRecap, findComexRecapById } from "../../../DataAccess/ComexRecap";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";

export function DeletePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const [working, setWorking] = useState(false);

  const [countriesList, setCountriesList] = useState(null);
  const [suppliersList, setSuppliersList] = useState(null);
  const [campaignList, setCampaignList] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [recap, setRecap] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState(null);

  const navigate = useNavigate();

  const { setReload, campaigns, countries, selectedRowId } = useContext(AbmStateContext);

  const getData = async () => {
    let ret = countries.map((c) => {
      const obj = { value: c.code, label: c.country };
      return obj;
    });
    setCountriesList(ret);

    ret = campaigns?.map((c) => {
      const obj = { value: c.id, label: c.name };
      return obj;
    });
    setCampaignList(ret);

    const params = {
      token: user.token,
      id: selectedRowId,
    };
    ret = await findComexRecapById(params);
    setRecap(ret);
  };

  useEffect(() => {
    getData();
  }, [countries, campaigns, selectedRowId]);

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

  useEffect(() => {
    if (recap) {

      form.setFieldValue("description", recap.description);
      form.setFieldValue("campaign", recap.campaign.id);
      form.setFieldValue("country", recap.country.code);
      form.setFieldValue("supplier", recap.supplier.code);

      setSelectedCountry(recap.country.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recap]);

  const form = useForm({
    initialValues: {
      description: "",
      campaign: "",
      supplier: null,
      country: null,
    },

    validate: {},
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

  const createTextField = (field, disabled) => {
    const ret = (
      <TextInput
        w={"100%"}
        disabled={disabled}
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
      body: { ...values },
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
            </Group>
            <Group mb={"md"} grow>
              {createTextField("description", true)}
            </Group>
            <Group mb={"md"} grow>
              {createSelectCountry("country", true, countriesList)}
              {createSelect("supplier", true, suppliersList)}
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
