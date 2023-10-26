import React, { useState } from "react";
import { Button, Group, Modal, NumberInput, ScrollArea, Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { findBusinessProcessInstanceById } from "../../../../DataAccess/BusinessProcessModel";
import { useSelector } from "react-redux";

const ConfigSprintTimesDialog = ({ open, close, processInstanceId }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);

  const [instance, setInstance] = useState(null);

  const form = useForm({
    initialValues: {
      // name: "",
      // description: "",
    },

    validate: {
      // name: (val) => (val ? null : t("validation.required")),
      // description: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    let params = {
      token: user.token,
      id: processInstanceId,
    };

    try {
      const ret = await findBusinessProcessInstanceById(params);
      if (ret.error) {
        console.log(ret.error);
      } else {
        console.log("ConfigSprintTimesDialog findBusinessProcessInstanceById -> ", ret);
        setInstance(ret);
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (processInstanceId) {
      getData();
      console.log("ConfigSprintTimesDialog processInstanceId -> ", processInstanceId);
    }
  }, [processInstanceId]);

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  useEffect(() => {
    if (instance) {
      instance.sprints?.map((s) => {
        form.setFieldValue(s.name, s.durationInDays);
      });
    }
  }, [instance]);

  return (
    <Modal
      size={"lg"}
      opened={open}
      onClose={() => {
        close();
      }}
      title={t("businessProcessInstances.title.configSprintTimes")}
      centered
    >
      <Stack w={"100%"} spacing={"xs"}>
        <Title order={4}>{t("businessProcessInstances.label.sprints")}</Title>
        <form
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            console.log(values);
          })}
        >
          <ScrollArea h={400}>
            {instance?.sprints?.map((s) => {
              const ret = (
                <Group mt={"xs"} grow>
                  <NumberInput key={s.id} label={s.name} description={s.description} {...form.getInputProps(s.name)} />
                </Group>
              );
              return ret;
            })}
          </ScrollArea>

          <Group position="right" mt={"xl"}>
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={() => {
                close();
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
