import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useState } from "react";
import { AbmStateContext } from "./Context";
import { HEADER_HIGHT } from "../../../Constants";
import { createDataSource } from "../../../DataAccess/DataSource";
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
      code: "",
      name: "",
      description: "",
    },

    validate: {
      code: (val) => (val ? null : t("validation.required")),
      name: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        w={"100%"}
        label={t("dataSource.label." + field)}
        placeholder={t("dataSource.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createTextArea = (field) => {
    const ret = (
      <Textarea
        w={"100%"}
        label={t("dataSource.label." + field)}
        placeholder={t("dataSource.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  const onCreate = async (values) => {
    const body = {
      id: uuid(),
      code: values.code,
      name: values.name,
      description: values.description,
      parent: null,
      children: [],
    };

    const params = {
      token: user.token,
      body: body,
    };

    setWorking(true);
    try {
      const ret = await createDataSource(params);
      if (ret.error) {
        setError(ret.error);
      } else {
        setReload(Date.now());
        navigate("../");
      }
      setWorking(false);
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
          {t("dataSource.title.create")}
        </Title>

        <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT }}>
          <form
            onSubmit={form.onSubmit((values) => {
              onCreate(values);
            })}
          >
            <Group grow mb={"md"} w={"50%"}>
              {createTextField("code")}
            </Group>

            <Group mb={"md"} grow>
              {createTextField("name")}
            </Group>

            <Group mb={"md"} grow>
              {createTextArea("description")}
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
