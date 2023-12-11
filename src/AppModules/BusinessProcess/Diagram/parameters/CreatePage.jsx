import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { useContext } from "react";
import { AbmParametersStateContext } from "../Context";
import { saveBusinessProcessModelParameter } from "../../../../DataAccess/BusinessProcessModel";

export function CreatePage({businessProcessId}) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const {setReloadParameters} = useContext(AbmParametersStateContext)

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      value: "",
      defaultValue: "",
      required: "",
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
      token: user.token,
      id: businessProcessId,
      values: { ...values },
    };

    await saveBusinessProcessModelParameter(params);
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
                  {createTextField("value")}
                </Group>
                <Group mb={"md"} grow>
                  {createTextField("defaultValue")}
                </Group>
                <Group mb={"md"}>
                  {createCheckBoxField("required")}
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
