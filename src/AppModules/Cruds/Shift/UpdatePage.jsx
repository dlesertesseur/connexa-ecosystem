import ResponceNotification from "../../../Modal/ResponceNotification";
import moment from "moment/moment";
import {
  Title,
  Container,
  Button,
  Group,
  Select,
  LoadingOverlay,
  Timeline,
  Text,
  Grid,
  ScrollArea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { hours, shiftDurations, pauseDurations, jobType, pauseType, radius } from "../../../Constants/DATA";
import { useContext, useEffect, useState } from "react";
import { IconClock, IconToolsKitchen2, IconToolsKitchen2Off } from "@tabler/icons-react";
import { formatDateToDDMMYYYY } from "../../../Util";
import { findAllWorkersByOrganization } from "../../../DataAccess/Worker";
import { findShiftById, updateShift } from "../../../DataAccess/Shift";
import { currency } from "../../../Constants";
import { AbmStateContext } from "./Context";
import "dayjs/locale/es";
import "dayjs/locale/en";

export function UpdatePage() {
  const { t } = useTranslation();
  const { user, organizationSelected } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const [error, setError] = useState(null);
  const [working, setWoking] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [shift, setShift] = useState();

  const navigate = useNavigate();

  const { setReload, selectedDate, store, selectedRowId } = useContext(AbmStateContext);

  useEffect(() => {
    const params = {
      token: user.token,
      organizationId: organizationSelected.id,
    };

    findAllWorkersByOrganization(params)
      .then((ret) => {
        setWorkers(ret);
        console.log("update findAllWorkersByOrganization ->", ret);
      })
      .catch((error) => {
        setError(error);
      });
  }, [organizationSelected, user]);

  useEffect(() => {
    const params = {
      token: user.token,
      storeId: store.id,
      shiftId: selectedRowId,
    };

    findShiftById(params)
      .then((ret) => {
        setShift(ret);
        console.log("update findShiftById ->", ret);
      })
      .catch((error) => {
        setError(error);
      });
  }, [selectedRowId, store, user]);

  useEffect(() => {
    if (shift) {

      const shiftStart = moment(shift.startDateAndTime);
      const shiftEnd = moment(shift.endDateAndTime);
      const shiftDurationsInMinutes = shiftEnd.diff(shiftStart);

      const pauseStart = moment(shift.pauseStartDateAndTime);
      const pauseEnd = moment(shift.pauseEndDateAndTime);
      const pauseDurationsInMinutes = pauseEnd.diff(pauseStart);

      form.setFieldValue("startTime",shift.startDateAndTime.substring(11, 16));
      form.setFieldValue("durationsInHours",(shiftDurationsInMinutes/1000/60/60));
      form.setFieldValue("pauseType",shift.pauseName);
      form.setFieldValue("pauseStartTime",shift.pauseStartDateAndTime.substring(11, 16));
      form.setFieldValue("pauseDurationsInMinutes",(pauseDurationsInMinutes/1000/60));
      form.setFieldValue("worker",shift.workerId);
      form.setFieldValue("radius",shift.siteRadiusInMeters);
      form.setFieldValue("jobType",shift.job);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift]);

  const form = useForm({
    initialValues: {
      startTime: null,
      durationsInHours: null,
      pauseType: null,
      pauseStartTime: null,
      pauseDurationsInMinutes: null,
      worker: null,
      radius: null,
    },

    validate: {
      startTime: (val) => (val ? null : t("validation.required")),
      durationsInHours: (val) => (val ? null : t("validation.required")),
      pauseType: (val) => (val ? null : t("validation.required")),
      pauseStartTime: (val) => (val ? null : t("validation.required")),
      pauseDurationsInMinutes: (val) => (val ? null : t("validation.required")),
      jobType: (val) => (val ? null : t("validation.required")),
      worker: (val) => (val ? null : t("validation.required")),
    },
  });

  const createSelectHours = (field) => {
    const ret = (
      <Select
        label={t("crud.shift.label." + field)}
        data={hours}
        {...form.getInputProps(field)}
        placeholder={
          t("crud.shift.placeholder." + field).startsWith("crud.") ? "" : t("crud.shift.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectShiftDuration = (field) => {
    const ret = (
      <Select
        label={t("crud.shift.label." + field)}
        data={shiftDurations}
        {...form.getInputProps(field)}
        placeholder={
          t("crud.shift.placeholder." + field).startsWith("crud.") ? "" : t("crud.shift.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectWorker = (field) => {
    const list = workers.map((r) => {
      const obj = {
        value: r.worker.id,
        label: r.worker.lastname + ", " + r.worker.firstname + " (" + r.worker.nid + ")",
      };
      return obj;
    });
    const ret = (
      <Select
        label={t("crud.shift.label." + field)}
        data={list}
        {...form.getInputProps(field)}
        placeholder={
          t("crud.shift.placeholder." + field).startsWith("crud.") ? "" : t("crud.shift.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectPauseDuration = (field) => {
    const ret = (
      <Select
        label={t("crud.shift.label." + field)}
        data={pauseDurations}
        {...form.getInputProps(field)}
        placeholder={
          t("crud.shift.placeholder." + field).startsWith("crud.") ? "" : t("crud.shift.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectRadius = (field) => {
    const ret = (
      <Select
        label={t("crud.shift.label." + field)}
        data={radius}
        {...form.getInputProps(field)}
        placeholder={
          t("crud.shift.placeholder." + field).startsWith("crud.") ? "" : t("crud.shift.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectJobType = (field) => {
    const ret = (
      <Select
        label={t("crud.shift.label." + field)}
        data={jobType}
        {...form.getInputProps(field)}
        placeholder={
          t("crud.shift.placeholder." + field).startsWith("crud.") ? "" : t("crud.shift.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelectPauseType = (field) => {
    const ret = (
      <Select
        label={t("crud.shift.label." + field)}
        data={pauseType}
        {...form.getInputProps(field)}
        placeholder={
          t("crud.shift.placeholder." + field).startsWith("crud.") ? "" : t("crud.shift.placeholder." + field)
        }
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onUpdate = (values) => {
    const params = {
      token: user.token,
      storeId: store.id,
      body: {
        id:shift.id,
        job: values.jobType,
        siteLatitude: store.latitude,
        siteLongitude: store.longitude,
        siteRadiusInMeters: values.radius,
        address: store.address,
        pause: true,
        pauseName: form.getInputProps("pauseType").value,
        status: "ASSIGNED",
        visible: true,
        amount: 0,
        hourlyAmount: 0,
        currency: currency.pesos,
        workerId: values.worker,
        type: "PRIVATE",
        requirements: null,
        notes: null,
        startDate: moment(selectedDate).format("YYYYMMDD"),
        endDate: calculateEndDateShift(),
        startDateAndTime: calculateStartShift(),
        endDateAndTime: calculateEndShift(),
        pauseStartDateAndTime: calculateStartPause(),
        pauseEndDateAndTime: calculateEndPause(),
        siteName: store.name,
      },
    };
    setWoking(true);
    updateShift(params)
      .then((ret) => {
        console.log("updateShift ->", ret);
        setWoking(false);
        setReload(Date.now());
        navigate("../");
      })
      .catch((error) => {
        setError(error);
        setWoking(false);
      });
  };

  const onClose = () => {
    navigate("../");
  };

  const calculateEndPause = () => {
    const start = form.getInputProps("pauseStartTime").value;
    const startShift = form.getInputProps("startTime").value;
    const duration = form.getInputProps("pauseDurationsInMinutes").value;
    let sd = null;

    if(startShift > start){
      //Next day
      const day = moment(selectedDate).add(1, "d");
      sd = moment(day.format("DDMMYYYY") + " " + start, "DDMMYYYY HH:mm:ss").add(duration, "m");
    }else{
      sd = moment(formatDateToDDMMYYYY(selectedDate) + " " + start, "DDMMYYYY HH:mm:ss").add(duration, "m");
    }

    return sd.format("YYYY-MM-DD HH:mm:ss");
  };

  const calculateStartPause = () => {
    const start = form.getInputProps("pauseStartTime").value;
    const startShift = form.getInputProps("startTime").value;
    let sd = null;
    if(startShift > start){
      //Next day
      const day = moment(selectedDate).add(1, "d");
      sd = moment(day.format("DDMMYYYY") + " " + start, "DDMMYYYY HH:mm:ss");
    }else{
      sd = moment(formatDateToDDMMYYYY(selectedDate) + " " + start, "DDMMYYYY HH:mm:ss");
    }
    return sd.format("YYYY-MM-DD HH:mm:ss");
  };

  const calculateEndShift = () => {
    const start = form.getInputProps("pauseStartTime").value;
    const startShift = form.getInputProps("startTime").value;
    let sd = null;
    if(startShift > start){
      //Next day
      const day = moment(selectedDate).add(1, "d");
      sd = moment(day.format("DDMMYYYY") + " " + start, "DDMMYYYY HH:mm:ss");
    }else{
      sd = moment(formatDateToDDMMYYYY(selectedDate) + " " + start, "DDMMYYYY HH:mm:ss");
    }
    return sd.format("YYYY-MM-DD HH:mm:ss");
  };

  const calculateEndDateShift = () => {
    const start = form.getInputProps("startTime").value;
    const duration = form.getInputProps("durationsInHours").value;
    let sd = moment(formatDateToDDMMYYYY(selectedDate) + " " + start, "DDMMYYYY HH:mm:ss").add(duration, "h");
    return sd.format("YYYYMMDD");
  };

  const calculateStartShift = () => {
    const start = form.getInputProps("startTime").value;
    let sd = moment(formatDateToDDMMYYYY(selectedDate) + " " + start, "DDMMYYYY HH:mm:ss");
    return sd.format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      {error ? <ResponceNotification opened={error} onClose={onClose} title={error} text={error} /> : null}

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
          {t("crud.shift.title.update")}
        </Title>

        <ScrollArea type="scroll" style={{ width: "100%", height: height - 250 }}>
          <form   autoComplete="false"
            onSubmit={form.onSubmit((values) => {
              onUpdate(values);
            })}
          >
            <Grid>
              <Grid.Col span={6}>
                <Group position="left" sx={{ alignItems: "flex-start" }}>
                  <Group mb={"md"}>{createSelectHours("startTime")}</Group>
                  <Group mb={"md"}>{createSelectShiftDuration("durationsInHours")}</Group>
                  <Group mb={"md"}>{createSelectJobType("jobType")}</Group>
                  <Group mb={"md"}>{createSelectHours("pauseStartTime")}</Group>
                  <Group mb={"md"}>{createSelectPauseDuration("pauseDurationsInMinutes")}</Group>
                  <Group mb={"md"}>{createSelectPauseType("pauseType")}</Group>
                  <Group mb={"xl"}>{createSelectRadius("radius")}</Group>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group position="center">
                  <Timeline bulletSize={28} lineWidth={2} mt={"md"}>
                    <Timeline.Item bullet={<IconClock size={20} />} title={calculateStartShift()}>
                      <Text color="dimmed" size="sm"></Text>
                      <Text size="xs" mt={4}>
                        {t("crud.shift.label.timeline1")}
                      </Text>
                    </Timeline.Item>

                    <Timeline.Item bullet={<IconToolsKitchen2 size={20} />} title={calculateStartPause()}>
                      <Text color="dimmed" size="sm"></Text>
                      <Text size="xs" mt={4}>
                        {t("crud.shift.label.timeline2")}{" "}
                        {form.getInputProps("pauseType").value
                          ? form.getInputProps("pauseType").value
                          : t("crud.shift.label.pause")}
                      </Text>
                    </Timeline.Item>

                    <Timeline.Item bullet={<IconToolsKitchen2Off size={20} />} title={calculateEndPause()}>
                      <Text color="dimmed" size="sm"></Text>
                      <Text size="xs" mt={4}>
                        {t("crud.shift.label.timeline3")}{" "}
                        {form.getInputProps("pauseType").value
                          ? form.getInputProps("pauseType").value
                          : t("crud.shift.label.pause")}
                      </Text>
                    </Timeline.Item>

                    <Timeline.Item bullet={<IconClock size={20} />} title={calculateEndShift()}>
                      <Text color="dimmed" size="sm"></Text>
                      <Text size="xs" mt={4}>
                        {t("crud.shift.label.timeline4")}
                      </Text>
                    </Timeline.Item>
                  </Timeline>
                </Group>
              </Grid.Col>
            </Grid>
            <Group grow mb={"md"}>
              {createSelectWorker("worker")}
            </Group>
            <Group position="right" mt="xl" mb="xs">
              <Button
                onClick={(event) => {
                  navigate("../");
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
