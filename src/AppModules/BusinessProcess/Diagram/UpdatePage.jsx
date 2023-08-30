import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Skeleton } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { HEADER_HIGHT } from "../../../Constants";
import { useEffect } from "react";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { findBusinessProcessById, saveBusinessProcess } from "../../../DataAccess/BusinessProcess";
import { findBusinessProcessModelById, saveBusinessProcessModel } from "../../../DataAccess/BusinessProcessModel";

export function UpdatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [businessProcessModel, setBusinessProcessModel] = useState(null);
  const navigate = useNavigate();

  const { selectedRowId, setReload, setError } = useContext(AbmStateContext);

  const form = useForm({
    initialValues: {
      description: "",
      name: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findBusinessProcessModelById(params);
    setBusinessProcessModel(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  const createTextField = (field) => {
    const ret = businessProcessModel ? (
      <TextInput
        label={t("businessProcessModel.label." + field)}
        placeholder={t("businessProcessModel.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    ) : (
      <Skeleton visible={true} h={40}></Skeleton>
    );
    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  useEffect(() => {
    const f = async () => {
      if (businessProcessModel) {
        form.setFieldValue("name", businessProcessModel.name);
        form.setFieldValue("description", businessProcessModel.description);
        //form.setFieldValue("status", project.status);
      }
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessProcessModel]);

  const onUpdate = async (values) => {
    const params = {
      token: user.token,
      id: businessProcessModel.id,
      name: values.name,
      description: values.description,
      stages: businessProcessModel.stages,
      parameters: businessProcessModel.parameters,
    };

    setWorking(true);
    try {
      const ret = await saveBusinessProcessModel(params);
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
          {t("businessProcessModel.title.update")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onUpdate(values);
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
