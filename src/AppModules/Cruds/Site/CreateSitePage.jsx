import ResponceNotification from "../../../Modal/ResponceNotification";
import { TextInput, Title, Container, Button, Group, LoadingOverlay, Select, Stack, ScrollArea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSite } from "../../../DataAccess/Sites";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT } from "../../../Constants";
import { countries } from "../../../Constants/countries";
import { radius, storeType } from "../../../Constants/DATA";

export function CreateSitePage({ user, back, onLoadGrid, contexts }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const wSize = useWindowSize();
  const [working, setWorking] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [response, setResponse] = useState(null);

  const [countriesList] = useState(
    countries?.map((c) => {
      return { value: c.id, label: c.name };
    })
  );

  const [contextList] = useState(
    contexts?.map((c) => {
      return { value: c.id, label: c.name };
    })
  );

  const [radiusList] = useState(
    radius.map((r) => {
      return { value: r.value, label: r.label };
    })
  );

  const [storeTypeList] = useState(
    storeType.map((s) => {
      return { value: s.value, label: s.label };
    })
  );

  const [country, setCountry] = useState(null);
  const [context, setContext] = useState(null);
  const [province, setProvince] = useState(null);
  const [provinces, setProvinces] = useState([]);

  const selectProvince = (event) => {
    form.setFieldValue("province", event);
    setProvince(event);
  };

  const selectContext = (event) => {
    setContext(event);
    form.setFieldValue("context", event);

    /*TIPO TIENDA*/
    if (event !== 3) {
      form.setFieldValue("type", "no type");
    }
  };

  const selectCountry = (event) => {
    setCountry(event);

    form.setFieldValue("country", event);

    const ret = countries.find((country) => {
      return country.id === event;
    });

    if (ret?.provinces) {
      const list = ret.provinces.map((c) => {
        return { value: c.id, label: c.name };
      });

      setProvince(null);
      setProvinces(list);
    } else {
      setProvinces(null);
    }
  };

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      phone: "",
      context: "",
      city: "",
      country: "",
      province: "",
      type: "",
      latitude: "",
      longitude: "",
      actionRatio: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
      phone: (val) => (val ? null : t("validation.required")),
      context: (val) => (val ? null : t("validation.required")),
      city: (val) => (val ? null : t("validation.required")),
      country: (val) => (val ? null : t("validation.required")),
      province: (val) => (val ? null : t("validation.required")),
      type: (val) => (val ? null : t("validation.required")),
      latitude: (val) => (val ? null : t("validation.required")),
      longitude: (val) => (val ? null : t("validation.required")),
      actionRatio: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <Stack align="flex-start" h={80}>
        <TextInput
          w={"100%"}
          label={t("crud.site.label." + field)}
          placeholder={t("crud.site.placeholder." + field)}
          {...form.getInputProps(field)}
        />
      </Stack>
    );

    return ret;
  };

  const createNumberField = (field) => {
    const ret = (
      <Stack align="flex-start" h={80}>
        <TextInput
          label={t("crud.site.label." + field)}
          placeholder={t("crud.site.placeholder." + field)}
          {...form.getInputProps(field)}
        />
      </Stack>
    );

    return ret;
  };

  const createSelectFieldControled = (field, value, setValue, error, data = []) => {
    const ret = (
      <Stack align="flex-start" h={80}>
        <Select
          label={t("crud.site.label." + field)}
          placeholder={t("crud.site.placeholder." + field)}
          data={data}
          value={value}
          error={error}
          onChange={setValue}
        />
      </Stack>
    );

    return ret;
  };

  const createSelectField = (field, data = []) => {
    const ret = (
      <Stack align="flex-start" h={80}>
        <Select
          label={t("crud.site.label." + field)}
          placeholder={t("crud.site.placeholder." + field)}
          data={data}
          {...form.getInputProps(field)}
        />
      </Stack>
    );

    return ret;
  };

  const onCreate = (values) => {

    setWorking(true);
    const params = {
      token: user.token,
      data: values,
    };
    createSite(params)
      .then((ret) => {
        setWorking(false);

        if (ret.status) {
          setResponse({
            code: ret.status,
            title: ret.status ? t("status.error") : t("status.ok"),
            text: ret.status ? ret.message : t("message.create"),
          });
          setResponseModalOpen(true);
        } else {
          onLoadGrid();
          navigate(back);
        }
      })
      .catch((error) => {
        setResponse({ code: error.status, title: t("status.error"), text: error.message });
        setResponseModalOpen(true);
      });
  };

  const onClose = () => {
    setResponseModalOpen(false);
    onLoadGrid();
    navigate(back);
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <ResponceNotification
        opened={responseModalOpen}
        onClose={onClose}
        code={response?.code}
        title={response?.title}
        text={response?.text}
      />
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
          {t("crud.site.title.create")}
        </Title>

        <ScrollArea h={wSize.height - HEADER_HIGHT}>
          <form
            onSubmit={form.onSubmit((values) => {
              onCreate(values);
            })}
          >
            <Group grow mb={"md"}>
              {createTextField("name")}
            </Group>
            <Group grow mb={"md"}>
              {createTextField("description")}
            </Group>
            <Group mb={"md"}>{createTextField("phone")}</Group>

            <Group mb={"md"}>
              {createSelectFieldControled(
                "country",
                country,
                selectCountry,
                form.getInputProps("country").error,
                countriesList
              )}
              {createSelectFieldControled(
                "province",
                province,
                selectProvince,
                form.getInputProps("province").error,
                provinces
              )}
              {createTextField("city")}
            </Group>
            <Group mb={"md"}>
              {createNumberField("latitude")}
              {createNumberField("longitude")}
            </Group>

            <Group mb={"md"}>
              {createSelectFieldControled(
                "context",
                context,
                selectContext,
                form.getInputProps("context").error,
                contextList
              )}

              {/* SI ES IGUAL A TIENDA */}
              {form.getInputProps("context")?.value === 3 ? createSelectField("type", storeTypeList) : null}
            </Group>
            <Group mb={"md"}>{createSelectField("actionRatio", radiusList)}</Group>

            <Group position="right" mt="xl" mb="xs">
              <Button
                onClick={(event) => {
                  navigate(back);
                }}
              >
                {t("button.cancel")}
              </Button>
              <Button type="submit">{t("button.accept")}</Button>
            </Group>
          </form>
        </ScrollArea>
      </Container>
    </Container>
  );
}
