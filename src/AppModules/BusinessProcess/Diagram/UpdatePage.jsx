import {
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
  ScrollArea,
  TextInput,
  Skeleton,
  Select,
} from "@mantine/core";
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
import { findBusinessProcessModelById, saveBusinessProcessModel } from "../../../DataAccess/BusinessProcessModel";
import { bpStatus } from "../../../Constants/Statuses";

export function UpdatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [businessProcessModel, setBusinessProcessModel] = useState(null);
  const navigate = useNavigate();

  const { selectedRowId, setReload, setError } = useContext(AbmStateContext);
  const [statuses] = useState(bpStatus);

  const form = useForm({
    initialValues: {
      description: "",
      name: "",
      status: null,
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
      status: (val) => (val ? null : t("validation.required")),
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

  const createSelectField = (field, data) => {
    const list = data?.map((c) => {
      return { value: c.id, label: c.value };
    });

    const ret = businessProcessModel ? (
      <Select label={t("businessProcessModel.label." + field)} data={list ? list : []} {...form.getInputProps(field)} />
    ) : (
      <Skeleton visible={true} h={40}></Skeleton>
    );
    return ret;

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
        form.setFieldValue("status", businessProcessModel.status);
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
      status:values.status,
      tasks: businessProcessModel.tasks,
      transitions: businessProcessModel.transitions,
      initialTaskId: businessProcessModel.initialTaskId,
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
          autoComplete="false"
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
                <Group mb={"md"} grow>
                  {createSelectField("status", statuses)}
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
