import React, { useContext, useState } from "react";
import { Button, Group, Modal, NumberInput, Paper, ScrollArea, Stack, Text, TextInput, Title } from "@mantine/core";
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

const ConfigSprintTimesDialog = ({ open, close, title, businessProcessModelId }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);

  const [instance, setInstance] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [baseDate] = useState(Date.now());

  const { setError } = useContext(AbmStateContext);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
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

  const getData = async () => {
    let params = {
      token: user.token,
      userId: user.id,
      name: "",
      description: "",
      businessProcessModelId: businessProcessModelId,
    };

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
        <Group mt={"xs"} grow>
          {createTextField("name")}
        </Group>
        <Group mt={"xs"} mb={"xs"} grow>
          {createTextField("description")}
        </Group>

        <Title order={5}>{t("businessProcessInstances.label.sprints")}</Title>
        <form
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onSave(values);
          })}
        >
          <ScrollArea h={400}>
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
