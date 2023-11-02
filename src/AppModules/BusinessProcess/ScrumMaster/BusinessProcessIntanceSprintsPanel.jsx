import React, { useContext, useState } from "react";
import {
  ActionIcon,
  Box,
  Container,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { convertMilisegToYYYYMMDD } from "../../../Util";
import { AbmStateContext } from "./Context";
import { findBusinessProcessInstanceById } from "../../../DataAccess/BusinessProcessModel";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useViewportSize } from "@mantine/hooks";
import { scrumMasterSaveSprints } from "../../../DataAccess/ScrumMaster";
import HeaderPanel from "./HeaderPanel";

const BusinessProcessIntanceSprintsPanel = ({ businessProcessInstanceId, businessProcessInstanceName, onBack }) => {
  const { t } = useTranslation();
  const { height } = useViewportSize();
  const { user } = useSelector((state) => state.auth.value);

  const [instance, setInstance] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [saving, setSaving] = useState(false);
  const [baseDate] = useState(Date.now());

  const { setError } = useContext(AbmStateContext);

  const form = useForm({
    initialValues: {},
    validate: {},
  });

  const getData = async () => {
    const params = { token: user.token, id: businessProcessInstanceId };

    try {
      const ret = await findBusinessProcessInstanceById(params);
      if (ret.error) {
        console.log(ret.error);
      } else {
        if (ret?.sprints) {
          const sortedSprints = ret.sprints;
          sortedSprints.sort((a, b) => a.number - b.number);
          setSprints(sortedSprints);
        }
        setInstance(ret);
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (businessProcessInstanceId) {
      getData();
    }
  }, [businessProcessInstanceId]);

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
      ret = convertMilisegToYYYYMMDD(baseDate + totalDays * 24 * 60 * 60 * 1000);
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
      ret = baseDate + totalDays * 24 * 60 * 60 * 1000;
    }
    return ret;
  };

  const onSave = async () => {
    const values = form.values;
    const fields = Object.keys(values);
    let hasError = false;

    for (let index = 0; index < fields.length; index++) {
      if (!values[fields[index]]) {
        form.setFieldError(fields[index], t("validation.required"));
        hasError = true;
      }
    }

    if (!hasError) {
      const sprints = instance.sprints;
      for (let index = 0; index < sprints.length; index++) {
        sprints[index].durationInDays = form.getInputProps(sprints[index].name).value;
        sprints[index]["startDate"] = calculateMiliseconds(index);
        sprints[index]["endDate"] = calculateMiliseconds(index + 1);
      }

      const params = {
        token: user.token,
        userId: user.id,
        businessProcessInstanceId: businessProcessInstanceId,
        sprints: sprints,
      };

      setSaving(true);
      try {
        const ret = await scrumMasterSaveSprints(params);
        setSaving(false);

        if (ret.error) {
          setSaving(false);
          setError(ret.error);
        }
      } catch (error) {
        setSaving(false);
        setError(error);
      }
    }
  };

  return (
    <Stack spacing={"xs"}>
      <HeaderPanel
        businessProcessInstanceName={businessProcessInstanceName}
        onBack={onBack}
        title={t("businessProcessInstances.title.configSprintTimes")}
      >
        <ActionIcon
          disabled={saving}
          color="blue"
          variant="filled"
          onClick={() => {
            onSave();
          }}
        >
          <IconDeviceFloppy size="20" />
        </ActionIcon>
      </HeaderPanel>

      <Stack w={"100%"} spacing={"xs"} mt={"xs"} s>
        <form autoComplete="false">
          <Container size={"lg"}>
            <ScrollArea offsetScrollbars h={height - 264}>
              <LoadingOverlay visible={saving} zIndex={1000} />
              {sprints.map((s, index) => {
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

                      <NumberInput
                        // allowNegative={false}
                        // clampBehavior="strict"
                        label={t("businessProcessInstances.label.duration")}
                        {...form.getInputProps(s.name)}
                      />
                    </Group>
                  </Paper>
                );
                return ret;
              })}
            </ScrollArea>
          </Container>
        </form>
      </Stack>
    </Stack>
  );
};

export default BusinessProcessIntanceSprintsPanel;
