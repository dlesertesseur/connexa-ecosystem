import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { saveBusinessProcess } from "../../../../DataAccess/BusinessProcess";
import { useContext } from "react";
import { AbmParametersStateContext } from "../Context";
import { PARAMETERS_TYPE } from "../../../../Constants/DOCUMENTS";

export function CreatePage({businessProcessId}) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const {setReloadParameters} = useContext(AbmParametersStateContext)

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

  const onClose = () => {
    navigate("../");
  };

  const onCreate = async (values) => {
    const params = {
      userId: user.id,
      businessProcessId: businessProcessId,
      values: { ...values },
    };

    await saveBusinessProcess(params);
    setReloadParameters(new Date());
    onClose();
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
          {t("businessProcess.parameters.title.create")}
        </Title>

        <form    autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
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
                <Group mb={"md"}>
                  {createSelect("type", parametersType)}
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
