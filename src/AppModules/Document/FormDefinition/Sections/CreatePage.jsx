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
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { SectionStateContext } from "../Context";
import { createFormDefinitionSection } from "../../../../DataAccess/FormDefinitionSections";

export function CreatePage({ formDefinitionId }) {
  const { t } = useTranslation();
  const { setReloadSections, entities, relations } = useContext(SectionStateContext);
  const [working, setWorking] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name:"",
      entity: "",
      relation: "",
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      entity: (val) => (val ? null : t("validation.required")),
      relation: (val) => (val ? null : t("validation.required")),
    },
  });

  const createSelect = (field, data) => {
    const ret = (
      <Select
        label={t("document.formDefinition.label." + field)}
        data={data ? data : []}
        placeholder={t("document.formDefinition.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createTextField = (field) => {
    const ret = (
      <TextInput
        w={"100%"}
        label={t("document.formDefinition.label." + field)}
        placeholder={t("document.formDefinition.placeholder." + field)}
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
      id: formDefinitionId,
      values: { ...values },
    };

    await createFormDefinitionSection(params);
    setReloadSections(new Date());
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
          {t("document.formDefinition.title.create")}
        </Title>

        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          <Group mb={"md"} grow>
            {createTextField("name")}
          </Group>
          <Group mb={"md"} grow>
            {createSelect("entity", entities)}
          </Group>
          <Group mb={"md"}>{createSelect("relation", relations)}</Group>

          <Group position="right" mt="xl" mb="xs">
            <Button type="submit">{t("button.accept")}</Button>
            <Button onClick={onClose}>{t("button.cancel")}</Button>
          </Group>
        </form>
      </Container>
    </Container>
  );
}
