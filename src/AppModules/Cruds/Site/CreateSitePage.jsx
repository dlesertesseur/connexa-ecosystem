import ResponceNotification from "../../../Modal/ResponceNotification";
import {
  TextInput,
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  ScrollArea,
  Paper,
  Space,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSite } from "../../../DataAccess/Sites";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT } from "../../../Constants";
import { countries } from "../../../Constants/countries";
import { hours, radius, statusList, storeType } from "../../../Constants/DATA";
import DailySchedule from "../../../Components/DailySchedule";

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

  const [storeTypeList] = useState(storeType);

  const [country, setCountry] = useState(null);
  const [contextId, setContextId] = useState(null);
  const [province, setProvince] = useState(null);
  const [provinces, setProvinces] = useState([]);

  const selectProvince = (event) => {
    form.setFieldValue("province", event);
    setProvince(event);
  };

  const selectContext = (event) => {
    setContextId(event);
    form.setFieldValue("contextId", event);

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
        return { value: c.name, label: c.name };
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
      address: "",
      phones: "",
      contextId: "",
      city: "",
      country: "",
      province: "",
      type: "",
      latitude: "",
      longitude: "",
      radius_in_meters: "",
      status: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      address: (val) => (val ? null : t("validation.required")),
      phones: (val) => (val ? null : t("validation.required")),
      contextId: (val) => (val ? null : t("validation.required")),
      city: (val) => (val ? null : t("validation.required")),
      country: (val) => (val ? null : t("validation.required")),
      province: (val) => (val ? null : t("validation.required")),
      type: (val) => (val ? null : t("validation.required")),
      latitude: (val) => (val ? null : t("validation.required")),
      longitude: (val) => (val ? null : t("validation.required")),
      radius_in_meters: (val) => (val ? null : t("validation.required")),
      status: (val) => (val ? null : t("validation.required")),
      monday: (val) => (val ? null : t("validation.required")),
      tuesday: (val) => (val ? null : t("validation.required")),
      wednesday: (val) => (val ? null : t("validation.required")),
      thursday: (val) => (val ? null : t("validation.required")),
      friday: (val) => (val ? null : t("validation.required")),
      saturday: (val) => (val ? null : t("validation.required")),
      sunday: (val) => (val ? null : t("validation.required")),
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
        onLoadGrid();
        navigate(back);
      })
      .catch((error) => {
        console.log("createSite error -> ", error);
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

        <ScrollArea h={wSize.height - HEADER_HIGHT} pr={"md"}>
          <form   autoComplete="false"
            onSubmit={form.onSubmit((values) => {
              onCreate(values);
            })}
          >
            <Group grow mb={"md"}>
              {createTextField("name")}
            </Group>
            <Group grow mb={"md"}>
              {createTextField("address")}
            </Group>

            <Group mb={"md"}>{createTextField("phones")}</Group>

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
                "contextId",
                contextId,
                selectContext,
                form.getInputProps("contextId").error,
                contextList
              )}

              {/* SI ES IGUAL A TIENDA */}
              {form.getInputProps("contextId")?.value === 3 ? createSelectField("type", storeTypeList) : null}
            </Group>
            <Group mb={"md"}>{createSelectField("radius_in_meters", radiusList)}</Group>
            <Group mb={"md"}>{createSelectField("status", statusList)}</Group>

            <Paper withBorder p={"xs"}>
              <DailySchedule
                dayName={t("datesOfWeek.monday")}
                openingTimeTitle={t("label.openingTime")}
                closingTimeTitle={t("label.closingTime")}
                openingTimeList={hours}
                closingTimeList={hours}
                form={form}
                field={"monday"}
              />
              <Space m={"md"} />
              <DailySchedule
                dayName={t("datesOfWeek.tuesday")}
                openingTimeTitle={t("label.openingTime")}
                closingTimeTitle={t("label.closingTime")}
                openingTimeList={hours}
                closingTimeList={hours}
                form={form}
                field={"tuesday"}
              />
              <Space m={"md"} />
              <DailySchedule
                dayName={t("datesOfWeek.wednesday")}
                openingTimeTitle={t("label.openingTime")}
                closingTimeTitle={t("label.closingTime")}
                openingTimeList={hours}
                closingTimeList={hours}
                form={form}
                field={"wednesday"}
              />
              <Space m={"md"} />
              <DailySchedule
                dayName={t("datesOfWeek.thursday")}
                openingTimeTitle={t("label.openingTime")}
                closingTimeTitle={t("label.closingTime")}
                openingTimeList={hours}
                closingTimeList={hours}
                form={form}
                field={"thursday"}
              />
              <Space m={"md"} />
              <DailySchedule
                dayName={t("datesOfWeek.friday")}
                openingTimeTitle={t("label.openingTime")}
                closingTimeTitle={t("label.closingTime")}
                openingTimeList={hours}
                closingTimeList={hours}
                form={form}
                field={"friday"}
              />
              <Space m={"md"} />
              <DailySchedule
                dayName={t("datesOfWeek.saturday")}
                openingTimeTitle={t("label.openingTime")}
                closingTimeTitle={t("label.closingTime")}
                openingTimeList={hours}
                closingTimeList={hours}
                form={form}
                field={"saturday"}
              />
              <Space m={"md"} />
              <DailySchedule
                dayName={t("datesOfWeek.sunday")}
                openingTimeTitle={t("label.openingTime")}
                closingTimeTitle={t("label.closingTime")}
                openingTimeList={hours}
                closingTimeList={hours}
                form={form}
                field={"sunday"}
              />
            </Paper>

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
