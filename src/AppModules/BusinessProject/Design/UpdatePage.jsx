import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, NumberInput } from "@mantine/core";
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
import { findBusinessProjectsById } from "../../../DataAccess/BusinessProject";

export function UpdatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [project, setProject] = useState(false);
  const navigate = useNavigate();

  const { selectedRowId, setReload, setError } = useContext(AbmStateContext);

  const form = useForm({
    initialValues: {
      description: "",
      name: "",
    },

    validate: {
      description: (val) => (val ? null : t("validation.required")),
      name: (val) => (val ? null : t("validation.required")),
    },
  });

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findBusinessProjectsById(params);
    setProject(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("businessProcess.label." + field)}
        placeholder={t("businessProcess.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  useEffect(() => {
    const f = async () => {
      if (project) {
        form.setFieldValue("name", project.name);
        form.setFieldValue("description", project.description);
        //form.setFieldValue("status", project.status);
      }
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const onUpdate = async (values) => {
    // const params = {
    //   token: user.token,
    //   body: { ...values },
    // };
    // setWorking(true);
    try {
      // await updateComexRecap(params);
      setWorking(false);
      setReload(Date.now());
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
          {t("businessProcess.title.update")}
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
