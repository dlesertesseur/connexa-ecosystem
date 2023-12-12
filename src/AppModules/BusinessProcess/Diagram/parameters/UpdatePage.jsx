import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AbmParametersStateContext } from "../Context";
import {
  findBusinessProcessModelParameterById,
  saveBusinessProcessModelParameter,
} from "../../../../DataAccess/BusinessProcessModel";

export function UpdatePage({ businessProcessId }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [projectParameter, setProjectParameter] = useState();
  const { setReloadParameters, selectedParameterId } = useContext(AbmParametersStateContext);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      value: "",
      defaultValue: "",
      required: false,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("businessProcessModel.parameters.label." + field)}
        placeholder={t("businessProcessModel.parameters.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createCheckBoxField = (field) => {
    const ret = (
      <Checkbox
        labelPosition="left"
        label={t("businessProcessModel.parameters.label." + field)}
        placeholder={t("businessProcessModel.parameters.placeholder." + field)}
        checked={form.getInputProps(field).value}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const getData = async () => {
    const params = { token: user.token, id: selectedParameterId };
    const ret = await findBusinessProcessModelParameterById(params);
    setProjectParameter(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedParameterId]);

  const onClose = () => {
    navigate("../");
  };

  useEffect(() => {
    if (projectParameter) {
      form.setFieldValue("name", projectParameter.name);
      form.setFieldValue("value", projectParameter.value);
      form.setFieldValue("defaultValue", projectParameter.defaultValue);
      form.setFieldValue("required", projectParameter.required === "true" ? true : false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectParameter]);

  const onUpdate = async (values) => {
    const params = {
      token: user.token,
      businessProcessModelId: businessProcessId,
      id: selectedParameterId,
      values: values,
    };

    setWorking(true);
    try {
      await saveBusinessProcessModelParameter(params);
      setWorking(false);
      setReloadParameters(Date.now());
      navigate("../");
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
          {t("businessProcess.parameters.title.update")}
        </Title>

        <form
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onUpdate(values);
          })}
        >
          {height ? (
            <>
              <ScrollArea type="scroll" style={{ width: "100%" }}>
                <Group mb={"md"} grow>
                  {createTextField("name")}
                </Group>
                <Group mb={"md"} grow>
                  {createTextField("value")}
                </Group>
                <Group mb={"md"} grow>
                  {createTextField("defaultValue")}
                </Group>
                <Group mb={"md"}>{createCheckBoxField("required")}</Group>
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
