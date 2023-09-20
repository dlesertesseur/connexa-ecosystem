import {
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
  ScrollArea,
  TextInput,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import {
  findBusinessProcessParameterById,
  updateBusinessProcessParameter,
} from "../../../../DataAccess/BusinessProcess";
import { PARAMETERS_TYPE } from "../../../../Constants/DOCUMENTS";
import { AbmParametersStateContext } from "../Context";

export function UpdatePage({ businessProcessId }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [projectParameter, setProjectParameter] = useState();
  const { setReloadParameters, selectedParameterId } = useContext(AbmParametersStateContext);

  const [parametersType] = useState(
    PARAMETERS_TYPE.map((p) => {
      return { value: p.id, label: p.name };
    })
  );
  
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      description: "",
      name: "",
      type: "",
    },

    validate: {
      description: (val) => (val ? null : t("validation.required")),
      name: (val) => (val ? null : t("validation.required")),
      type: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("businessProcess.parameters.label." + field)}
        placeholder={t("businessProcess.parameters.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelect = (field, data) => {
    const ret = (
      <Select
        label={t("businessProcess.parameters.label." + field)}
        data={data ? data : []}
        placeholder={t("businessProcess.parameters.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const getData = async () => {
    const params = { token: user.token, businessProcessId: businessProcessId, paramId: selectedParameterId };
    const ret = await findBusinessProcessParameterById(params);
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
      form.setFieldValue("description", projectParameter.description);
      form.setFieldValue("type", projectParameter.type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectParameter]);

  const onUpdate = async (values) => {
    const params = {
      token: user.token,
      businessProcessId: businessProcessId,
      paramId: selectedParameterId,
      values: values,
    };

    setWorking(true);
    try {
      await updateBusinessProcessParameter(params);
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
                  {createTextField("description")}
                </Group>
                <Group mb={"md"}>{createSelect("type", parametersType)}</Group>
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
