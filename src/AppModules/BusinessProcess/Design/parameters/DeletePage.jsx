import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { AbmParametersStateContext } from "../Context";
import {
  deleteBusinessProcessParameter,
  findBusinessProcessParameterById,
} from "../../../../DataAccess/BusinessProcess";
import DeleteConfirmation from "../../../../Modal/DeleteConfirmation";
import { PARAMETERS_TYPE } from "../../../../Constants/DOCUMENTS";

export function DeletePage({businessProcessId}) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [projectParameter, setProjectParameter] = useState();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { setReloadParameters, selectedParameterId, setSelectedParameterId } = useContext(AbmParametersStateContext);

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

    validate: {},
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        disabled={true}
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
        disabled={true}
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

  const onDelete = async (values) => {
    const params = {
      token: user.token,
      businessProcessId: businessProcessId,
      paramId: selectedParameterId,
      values: values,
    };

    setWorking(true);
    try {
      await deleteBusinessProcessParameter(params);
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
      form.setFieldValue("description", projectParameter.description);
      form.setFieldValue("type", projectParameter.type);
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
