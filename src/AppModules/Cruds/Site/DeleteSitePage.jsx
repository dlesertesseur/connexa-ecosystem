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
import ResponceNotification from "../../../Modal/ResponceNotification";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteSite, findSiteById } from "../../../DataAccess/Sites";
import { hours, radius, statusList, storeType } from "../../../Constants/DATA";
import { useWindowSize } from "../../../Hook";
import { countries } from "../../../Constants/countries";
import DeleteConfirmation from "../../../Modal/DeleteConfirmation";
import DailySchedule from "../../../Components/DailySchedule";
import { HEADER_HIGHT } from "../../../Constants";

export function DeleteSitePage({ user, back, siteId, onLoadGrid, contexts }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const wSize = useWindowSize();
  const [working, setWorking] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [site, setSite] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

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
  const [mTimes, setMTimes] = useState(null);

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
          disabled={true}
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
          disabled={true}
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
          disabled={true}
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
          disabled={true}
          {...form.getInputProps(field)}
        />
      </Stack>
    );

    return ret;
  };

  const onDelete = () => {
    setWorking(true);

    const params = {
      token: user.token,
      id: site.id,
    };
    deleteSite(params)
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

  const onConfirm = () => {
    onDelete();
  };

  const validateFiled = (value) => {
    return value ? value : "";
  }

  const getData = async () => {
    setWorking(true);

    const params = {
      token: user.token,
      siteId: siteId,
    };

    try {
      const ret = await findSiteById(params);
      setSite(ret);

      form.setFieldValue("name", validateFiled(ret.name));
      form.setFieldValue("address", validateFiled(ret.address));
      form.setFieldValue("phones", validateFiled(ret.phones));
      form.setFieldValue("contextId", validateFiled(ret.context.id));
      form.setFieldValue("city", validateFiled(ret.city));
      form.setFieldValue("country", validateFiled(ret.country));
      form.setFieldValue("province", validateFiled(ret.province));
      form.setFieldValue("type", validateFiled(ret.type));
      form.setFieldValue("latitude", validateFiled(ret.latitude));
      form.setFieldValue("longitude", validateFiled(ret.longitude));
      form.setFieldValue("radius_in_meters", validateFiled(ret.radius_in_meters));
      form.setFieldValue("status", validateFiled(ret.status));
      form.setFieldValue("monday", validateFiled(ret.monday));
      form.setFieldValue("tuesday", validateFiled(ret.tuesday));
      form.setFieldValue("wednesday", validateFiled(ret.wednesday));
      form.setFieldValue("thursday", validateFiled(ret.thursday));
      form.setFieldValue("friday", validateFiled(ret.friday));
      form.setFieldValue("saturday", validateFiled(ret.saturday));
      form.setFieldValue("sunday", validateFiled(ret.sunday));

      if (ret.country) {
        selectCountry(ret.country);
      }
      if (ret.province) {
        selectProvince(ret.province);
      }
      if (ret.context) {
        selectContext(ret.context.id);
      }

      const defaultTime = "06:00-20:30";
      const m = new Map();
      m.set("monday", ret.monday ? ret.monday.split("-") : defaultTime);
      m.set("tuesday", ret.tuesday ? ret.tuesday.split("-") : defaultTime);
      m.set("wednesday", ret.wednesday ? ret.wednesday.split("-") : defaultTime);
      m.set("thursday", ret.thursday ? ret.thursday.split("-") : defaultTime);
      m.set("friday", ret.friday ? ret.friday.split("-") : defaultTime);
      m.set("saturday", ret.saturday ? ret.saturday.split("-") : defaultTime);
      m.set("sunday", ret.sunday ? ret.sunday.split("-") : defaultTime);

      setMTimes(m);
    } catch (error) {
      console.log("error -> ", error);
      setResponse({ code: error.status, title: t("status.error"), text: error.message });
      setResponseModalOpen(true);
    }

    setWorking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  useEffect(() => {
    getData();
  }, [siteId, user]);

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <ResponceNotification
        opened={responseModalOpen}
        onClose={onClose}
        code={response?.code}
        title={response?.title}
        text={response?.text}
      />

      <DeleteConfirmation
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
        title={t("notification.title")}
        text={t("notification.delete")}
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
          {t("crud.site.title.delete")}
        </Title>

        <ScrollArea h={wSize.height - HEADER_HIGHT} pr={"md"}>
          <form   autoComplete="false"
            onSubmit={form.onSubmit((values) => {
              setConfirmModalOpen(true);
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

            {mTimes ? (
              <Paper withBorder p={"xs"}>
                <DailySchedule
                  dayName={t("datesOfWeek.monday")}
                  openingTimeTitle={t("label.openingTime")}
                  closingTimeTitle={t("label.closingTime")}
                  openingTimeList={hours}
                  closingTimeList={hours}
                  form={form}
                  defaultOpen={mTimes ? mTimes.get("monday")[0] : null}
                  defaultClose={mTimes ? mTimes.get("monday")[1] : null}
                  field={"monday"}
                  disabled={true}
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
                  defaultOpen={mTimes ? mTimes.get("tuesday")[0] : null}
                  defaultClose={mTimes ? mTimes.get("tuesday")[1] : null}
                  disabled={true}
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
                  defaultOpen={mTimes ? mTimes.get("wednesday")[0] : null}
                  defaultClose={mTimes ? mTimes.get("wednesday")[1] : null}
                  disabled={true}
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
                  defaultOpen={mTimes ? mTimes.get("thursday")[0] : null}
                  defaultClose={mTimes ? mTimes.get("thursday")[1] : null}
                  disabled={true}
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
                  defaultOpen={mTimes ? mTimes.get("friday")[0] : null}
                  defaultClose={mTimes ? mTimes.get("friday")[1] : null}
                  disabled={true}
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
                  defaultOpen={mTimes ? mTimes.get("saturday")[0] : null}
                  defaultClose={mTimes ? mTimes.get("saturday")[1] : null}
                  disabled={true}
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
                  defaultOpen={mTimes ? mTimes.get("sunday")[0] : null}
                  defaultClose={mTimes ? mTimes.get("sunday")[1] : null}
                  disabled={true}
                />
              </Paper>
            ) : null}

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
