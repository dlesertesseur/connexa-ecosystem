import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { AbmStateContext } from "./Context";
import { HEADER_HIGHT } from "../../../Constants";
import { findDataSourceById, updateDataSource } from "../../../DataAccess/DataSource";

export function UpdatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();

  const [working, setWorking] = useState(false);
  const [entity, setEntity] = useState(null);
  const navigate = useNavigate();

  const { setReload, selectedRowId, setError } = useContext(AbmStateContext);

  const getData = async () => {
    const params = {
      token: user.token,
      id: selectedRowId,
    };

    const entity = await findDataSourceById(params);
    setEntity(entity);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  const form = useForm({
    initialValues: {
      code: "",
      name: "",
      description: "",
    },

    validate: {
      code: (val) => (val ? null : t("validation.required")),
      name: (val) => (val ? null : t("validation.required")),
      description: (val) => (val ? null : t("validation.required")),
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

  useEffect(() => {
    const f = async () => {
      if (entity) {
        form.setFieldValue("code", entity.code);
        form.setFieldValue("name", entity.name);
        form.setFieldValue("description", entity.description);
      }
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  const onUpdate = async (values) => {
    setWorking(true);
    try {
      let params = {
        token: user.token,
        id: selectedRowId,
      };

      const obj = await findDataSourceById(params);
      obj.name = values.name;
      obj.code = values.code;
      obj.description = values.description;

      params = {
        token: user.token,
        body: obj,
      };

      const ret = await updateDataSource(params);
      if (ret.error) {
        setError(ret.error);
      } else {
        setReload(Date.now());
        navigate("../");
      }
    } catch (error) {
      setError(error);
    }
    setWorking(false);
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
          {t("dataSource.title.update")}
        </Title>

        <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT }}>
          <form   autoComplete="false"
            onSubmit={form.onSubmit((values) => {
              onUpdate(values);
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
