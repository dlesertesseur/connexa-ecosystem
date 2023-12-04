import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { HEADER_HIGHT } from "../../../Constants";

import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { saveBusinessProcessModel } from "../../../DataAccess/BusinessProcessModel";
import uuid from "react-uuid";

export function CreatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const { setError, setReload } = useContext(AbmStateContext);
  const [working, setWorking] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      description: "",
      name: "",
      requiresEvent: false,
    },

    validate: {
      description: (val) => (val ? null : t("validation.required")),
      name: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("businessProcessModel.label." + field)}
        placeholder={t("businessProcessModel.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createCheckBoxField = (field) => {
    const ret = (
      <Checkbox
        labelPosition="left"
        label={t("businessProcessModel.label." + field)}
        placeholder={t("businessProcessModel.placeholder." + field)}
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
      id: uuid(),
      token: user.token,
      name: values.name,
      description: values.description,
      status: bpStatus[0].id,
      tasks: [],
      transitions: [],
      initialTaskId: null,
    };
    setWorking(true);
    try {
      const ret = await saveBusinessProcessModel(params);
      setWorking(false);

      if (ret.error) {
        setWorking(false);
        setError(ret.error);
      } else {
        setReload(Date.now());
        navigate("../");
      }
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
          {t("businessProcessModel.title.create")}
        </Title>

        <form
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          {height ? (
            <>
              <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT - 72 }}>
                <Group mb={"md"} grow>
                  {createTextField("name")}
                </Group>
                <Group mb={"md"} grow>
                  {createTextField("description")}
                </Group>
                <Group mb={"md"} grow>
                  {createCheckBoxField("requiresEvent")}
                </Group>
              </ScrollArea>
              <Group position="right" mt="xl" mb="xs">
                <Button type="submit">{t("button.accept")}</Button>
                <Button onClick={onClose}>{t("button.cancel")}</Button>
              </Group>
            </>
          ) : null}
        </form>
      </Container>
    </Container>
  );
}
