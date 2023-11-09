import React, { useContext, useState } from "react";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { convertMilisegToYYYYMMDD } from "../../../../Util";
import {
  createBusinessProcessModelInstanceTemplate,
  saveBusinessProcessModelInstance,
} from "../../../../DataAccess/BusinessProcessModelInbox";
import { AbmStateContext } from "../Context";
import { findAllBusinessGoals } from "../../../../DataAccess/BusinessGoal";
import { DatePicker } from "@mantine/dates";

const ConfigSprintTimesDialog = ({ open, close, title, businessProcessModelId, asociateBusinessGoal = false }) => {
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [instance, setInstance] = useState(null);
  const [sprints, setSprints] = useState(null);
  const [goals, setGoals] = useState(null);
  const [baseDate, setBaseDate] = useState(new Date());
  const { setError } = useContext(AbmStateContext);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
      businessGoal : asociateBusinessGoal ? (val) => (val ? null : t("validation.required")) : null
    },
  });

  const createTextField = (field, disabled = false) => {
    const ret = (
      <TextInput
        disabled={disabled}
        label={t("businessProcessInstances.label." + field)}
        placeholder={t("businessProcessInstances.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createDateField = (field) => {
    const ret = (
      <DatePicker
        locale={i18n.language}
        inputFormat="YYYY/MM/DD"
        firstDayOfWeek="sunday"
        label={t("businessProcessInstances.label." + field)}
        placeholder={t("businessProcessInstances.placeholder." + field)}
        value={baseDate} onChange={setBaseDate} 
      />
    );

    return ret;
  };

  const createSelectField = (field, data) => {
    const ret = (
      <Select
        label={t("businessProcessInstances.label." + field)}
        data={data ? data : []}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const getData = async () => {
    let params = {
      token: user.token,
      userId: user.id,
      name: "",
      description: "",
      businessProcessModelId: businessProcessModelId,
    };

    setBaseDate(new Date());

    try {
      const ret = await createBusinessProcessModelInstanceTemplate(params);
      if (ret.error) {
        console.log(ret.error);
      } else {
        if (ret?.sprints) {
          const sortedSprints = ret.sprints;
          sortedSprints.sort((a, b) => a.number - b.number);
          setSprints(sortedSprints);
        }

        if (asociateBusinessGoal) {
          const goals = await findAllBusinessGoals(params);
          const list = goals.map((g) => {
            const ret = { value: g.id, label: g.name };
            return ret;
          });
          setGoals(list);
        }

        setInstance(ret);
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (businessProcessModelId && open) {
      getData();
    }
  }, [businessProcessModelId, open]);

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  useEffect(() => {
    if (sprints) {
      sprints.map((s) => {
        form.setFieldValue(s.name, s.durationInDays);
      });
    }
  }, [sprints]);

  const calculateDate = (actualIndex) => {
    let ret = null;
    let totalDays = 0;

    if (actualIndex >= 0) {
      for (let index = 0; index < actualIndex; index++) {
        const duration = form.getInputProps(sprints[index].name).value;
        if (duration) {
          totalDays += duration;
        }
      }
      ret = convertMilisegToYYYYMMDD(baseDate.getTime() + totalDays * 24 * 60 * 60 * 1000);
    }
    return ret;
  };

  const calculateMiliseconds = (actualIndex) => {
    let ret = null;
    let totalDays = 0;

    if (actualIndex >= 0) {
      for (let index = 0; index < actualIndex; index++) {
        const duration = form.getInputProps(sprints[index].name).value;
        if (duration) {
          totalDays += duration;
        }
      }
      ret = baseDate.getTime() + totalDays * 24 * 60 * 60 * 1000;
    }
    return ret;
  };

  const onSave = async (values) => {
    const fields = Object.keys(values);
    let hasError = false;

    for (let index = 0; index < fields.length; index++) {
      if (!values[fields[index]]) {
        form.setFieldError(fields[index], t("validation.required"));
        hasError = true;
      }
    }

    if (!hasError) {
      const ret = { ...instance };
      ret.name = values.name;
      ret.description = values.description;

      const sprints = ret.sprints;
      for (let index = 0; index < sprints.length; index++) {
        sprints[index].durationInDays = form.getInputProps(sprints[index].name).value;
        sprints[index]["startDate"] = calculateMiliseconds(index);
        sprints[index]["endDate"] = calculateMiliseconds(index + 1);
      }

      try {
        const params = {
          token: user.token,
          businessProcessModelId: businessProcessModelId,
          userId: user.id,
          businessProcessInstance: ret,
        };
        const data = await saveBusinessProcessModelInstance(params);

        console.log(data);

        if (data.error) {
          setError(data.error);
        }
        close();
      } catch (error) {
        setError(error);
      }
    }
  };

  const createHorizontalSprintCard = (s, index) => {
    const ret = (
      <Paper key={s.id} p={"xs"} withBorder mb={"xs"}>
        <Stack mb={"xs"}>
          <Title order={5}>{s.name}</Title>
          {s.description ? <Text size={"xs"}>{s.description} </Text> : null}
        </Stack>
        <Group position="apart">
          <Stack spacing={"xs"}>
            <Group position="apart">
              <Text size={"sm"} weight={"normal"}>
                {t("businessProcessInstances.label.startDate")}
              </Text>
              <Text size={"sm"} weight={"normal"}>
                {calculateDate(index)}
              </Text>
            </Group>

            <Group position="apart">
              <Text size={"sm"}>{t("businessProcessInstances.label.endDate")}</Text>
              <Text size={"sm"} weight={"normal"}>
                {calculateDate(index + 1)}
              </Text>
            </Group>
          </Stack>

          <NumberInput label={t("businessProcessInstances.label.duration")} {...form.getInputProps(s.name)} />
        </Group>
      </Paper>
    );

    return ret;
  };

  const createVerticalSprintCard = (s, index) => {
    const ret = (
      <Paper key={s.id} p={"xs"} withBorder mb={"xs"} w={200} bg={"gray.1"}>
        <Stack mb={"xs"}>
          <Title order={5}>{s.name}</Title>
          {s.description ? <Text size={"xs"}>{s.description} </Text> : null}
          <Group>
            <Text size={"sm"} weight={"normal"}>
              {t("businessProcessInstances.label.startDate")}
            </Text>
            <Text size={"sm"} weight={"normal"}>
              {calculateDate(index)}
            </Text>
          </Group>

          <Group>
            <Text size={"sm"}>{t("businessProcessInstances.label.endDate")}</Text>
            <Text size={"sm"} weight={"normal"}>
              {calculateDate(index + 1)}
            </Text>
          </Group>

          <Group>
            <NumberInput label={t("businessProcessInstances.label.duration")} {...form.getInputProps(s.name)} />
          </Group>
        </Stack>
      </Paper>
    );

    return ret;
  };

  return (
    <Modal
      size={"lg"}
      opened={open}
      onClose={() => {
        close();
      }}
      title={title}
      centered
    >
      <Stack w={"100%"} spacing={"xs"}>
        <form
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onSave(values);
          })}
        >
          <Stack h={"100%"} spacing={"xs"}>
            <Group grow mb={"xs"}>
              {createTextField("name")}
            </Group>
            <Group grow mb={"xs"}>
              {createTextField("description")}
            </Group>

            <Group mb={"xs"} grow>
              {asociateBusinessGoal ? createSelectField("businessGoal", goals) : null}
              {createDateField("startDate")}
            </Group>
            <Text size={"sm"} weight={600}>
              {t("businessProcessInstances.label.sprints")}
            </Text>

            <ScrollArea h={240} offsetScrollbars>
              {sprints ? (
                sprints.map((s, index) => {
                  const ret = createHorizontalSprintCard(s, index);
                  return ret;
                })
              ) : (
                <LoadingOverlay visible={true} />
              )}
            </ScrollArea>
          </Stack>
          <Group position="right" mt={"xl"}>
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={() => {
                close();
                setSprints([]);
              }}
            >
              {t("button.cancel")}
            </Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
};

export default ConfigSprintTimesDialog;
