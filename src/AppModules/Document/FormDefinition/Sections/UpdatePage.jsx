import {
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
  TextInput,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { SectionStateContext } from "../Context";
import {
  findFormDefinitionSectionById,
  updateFormDefinitionSection,
} from "../../../../DataAccess/FormDefinitionSections";

export function UpdatePage({ formDefinitionId }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReloadSections, selectedSectionId, entities, relations } = useContext(SectionStateContext);
  const [working, setWorking] = useState(false);
  const [section, setSection] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      entity: null,
      relation: null,
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

  const getData = async () => {
    const params = { token: user.token, id: formDefinitionId, sectionId: selectedSectionId };
    let ret = await findFormDefinitionSectionById(params);
    setSection(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedSectionId]);

  useEffect(() => {
    if (section) {
      form.setFieldValue("name", section.name);
      form.setFieldValue("entity", section.entity);
      form.setFieldValue("relation", section.relation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const onClose = () => {
    navigate("../");
  };

  const onUpdate = async (values) => {
    const params = {
      token: user.token,
      id: formDefinitionId,
      sectionId: selectedSectionId,
      values: values,
    };

    setWorking(true);
    try {
      await updateFormDefinitionSection(params);
      setWorking(false);
      setReloadSections(Date.now());
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
          {t("document.formDefinition.title.update")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onUpdate(values);
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
