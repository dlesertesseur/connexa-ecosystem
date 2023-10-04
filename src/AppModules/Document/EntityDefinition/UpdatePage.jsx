import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { AbmStateContext } from "./Context";
import { HEADER_HIGHT } from "../../../Constants";
import { findEntityDefinitionById, updateEntityDefinition, updateFormHeader } from "../../../DataAccess/EntityDefinition";

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

    const entity = await findEntityDefinitionById(params);
    setEntity(entity);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

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

  useEffect(() => {
    const f = async () => {
      if (entity) {
        form.setFieldValue("name", entity.name);
        form.setFieldValue("label", entity.label);
        form.setFieldValue("description", entity.description);
      }
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  const onUpdate = async (values) => {

    const obj = {...entity};
    obj.name = values.name;
    obj.label = values.label;
    obj.description = values.description;

    const params = {
      token: user.token,
      body: obj
    };

    setWorking(true);
    try {
      const ret = await updateFormHeader(params);
      setWorking(false);

      if(ret.error){
        setError(ret.error);
      }else{
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
          {t("document.entityDefinition.title.update")}
        </Title>

        <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT }}>
          <form   autoComplete="false"
            onSubmit={form.onSubmit((values) => {
              onUpdate(values);
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
