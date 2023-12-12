import {
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
  ScrollArea,
  TextInput,
  Select,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { AbmParametersStateContext } from "../Context";
import DeleteConfirmation from "../../../../Modal/DeleteConfirmation";
import {
  deleteBusinessProcessModelParameter,
  findBusinessProcessModelParameterById,
} from "../../../../DataAccess/BusinessProcessModel";

export function DeletePage({ businessProcessId }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [projectParameter, setProjectParameter] = useState();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { setReloadParameters, selectedParameterId, setSelectedParameterId } = useContext(AbmParametersStateContext);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      value: "",
      name: "",
      defaultValue: "",
      required: "",
    },

    validate: {},
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        disabled={true}
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
        disabled={true}
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

  const onDelete = async (values) => {
    const params = {
      token: user.token,
      id: selectedParameterId,
    };

    setWorking(true);
    try {
      await deleteBusinessProcessModelParameter(params);
      setWorking(false);
      setReloadParameters(Date.now());
      setSelectedParameterId(null);
      navigate("../");
    } catch (error) {
      setWorking(false);
      setError(error);
    }
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

  const onConfirm = () => {
    onDelete();
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <LoadingOverlay overlayOpacity={0.5} visible={working} />

      <DeleteConfirmation
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
        title={t("notification.title")}
        text={t("notification.delete")}
      />

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
          {t("businessProcess.parameters.title.delete")}
        </Title>

        <form
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
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
