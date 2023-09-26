import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useState } from "react";
import { AbmStateContext } from "./Context";
import { HEADER_HIGHT } from "../../../Constants";
import { createEntityDefinition } from "../../../DataAccess/EntityDefinition";
import uuid from "react-uuid";

export function CreatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const [working, setWorking] = useState(false);

  const navigate = useNavigate();

  const { setReload, setError } = useContext(AbmStateContext);

  const form = useForm({
    initialValues: {
      name: "",
      label: "",
      description: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      label: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        w={"100%"}
        label={t("document.entityDefinition.label." + field)}
        placeholder={t("document.entityDefinition.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  const onCreate = async (values) => {
    const form = {
      id: uuid(),
      type: "FORM",
      name: values.name,
      label: values.label,
      description: values.description,
      required: "true",
      options: JSON.stringify({ size: "sm" }),
      parent: null,
      children: [],
      // row: 0,
      // order: 0,
    };

    const params = {
      token: user.token,
      body: form,
    };

    setWorking(true);
    try {
      const ret = await createEntityDefinition(params);

      setWorking(false);
      if (ret.error) {
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
          {t("document.entityDefinition.title.create")}
        </Title>

        <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT }}>
          <form
            onSubmit={form.onSubmit((values) => {
              onCreate(values);
            })}
          >
            <Group mb={"md"} grow>
              {createTextField("name")}
            </Group>

            <Group mb={"md"} grow>
              {createTextField("label")}
            </Group>
            
            <Group mb={"md"} grow>
              {createTextField("description")}
            </Group>

            <Group position="right" mt="xl" mb="xs">
              <Button type="submit">{t("button.accept")}</Button>
              <Button onClick={onClose}>{t("button.cancel")}</Button>
            </Group>
          </form>
        </ScrollArea>
      </Container>
    </Container>
  );
}
