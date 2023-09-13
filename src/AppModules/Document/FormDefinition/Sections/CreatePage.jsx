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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { PARAMETERS_TYPE, WIDGETS } from "../../../../Constants/BUSINESS";
import { createBusinessProcessParameter } from "../../../../DataAccess/BusinessProcess";
import { useContext } from "react";
import { SectionStateContext } from "../Context";
import { useEffect } from "react";
import { findAllEntityDefinition } from "../../../../DataAccess/EntityDefinition";
import { DOCUMENTS } from "../../../../Constants/DOCUMENTS";

export function CreatePage({ businessProcessId }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [entities, setEntities] = useState(false);
  const { setReloadSections } = useContext(SectionStateContext);

  const [relations] = useState(
    DOCUMENTS.relations.map((p) => {
      return { value: p.id, label: p.name };
    })
  );

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      entity: "",
      relation: "",
    },

    validate: {
      entity: (val) => (val ? null : t("validation.required")),
      relation: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        label={t("document.section.label." + field)}
        placeholder={t("document.section.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelect = (field, data) => {
    const ret = (
      <Select
        label={t("document.section.label." + field)}
        data={data ? data : []}
        placeholder={t("document.section.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createCheck = (field, data) => {
    const ret = (
      <Checkbox
        label={t("document.section.label." + field)}
        placeholder={t("document.section.placeholder." + field)}
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
      userId: user.id,
      businessProcessId: businessProcessId,
      values: { ...values },
    };

    await createBusinessProcessParameter(params);
    setReloadSections(new Date());
    onClose();
  };

  const getData = async () => {
    const params = { token: user.token };

    let ret = await findAllEntityDefinition(params);
    setEntities(
      ret.map((p) => {
        return { value: p.id, label: p.name };
      })
    );
  };

  useEffect(() => {
    getData();
  }, [user]);

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
          {t("document.section.title.create")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
          })}
        >
          {height ? (
            <>
              <ScrollArea type="scroll" style={{ width: "100%" }}>
                <Group mb={"md"} grow>
                  {createSelect("entity", entities)}
                </Group>
                <Group mb={"md"} grow>
                  {createSelect("relation", relations)}
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
