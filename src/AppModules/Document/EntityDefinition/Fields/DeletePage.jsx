import DeleteConfirmation from "../../../../Modal/DeleteConfirmation";
import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Select, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { PARAMETERS_TYPE, WIDGETS } from "../../../../Constants/DOCUMENTS";
import { FieldStateContext } from "../Context";
import { deleteField, findFieldById,  } from "../../../../DataAccess/EntityDefinitionFields";
import { findAllDataSource } from "../../../../DataAccess/DataSource";

export function DeletePage({ entityDefinitionId }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const { rows } = useContext(FieldStateContext);
  const { setReloadFields, selectedFieldId } = useContext(FieldStateContext);
  const [working, setWorking] = useState(false);
  const [field, setField] = useState(false);
  const [dataSources, setDataSources] = useState(false);
  const [relatedField, setRelatedField] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [fieldType] = useState(
    PARAMETERS_TYPE.map((p) => {
      return { value: p.id, label: p.name };
    })
  );

  const [widgets] = useState(
    WIDGETS.map((p) => {
      return { value: p.id, label: p.name };
    })
  );

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      description: "",
      name: "",
      type: null,
      required: null,
      widget: null,
      dataSourceId: null,
      relatedFieldId: null,
      defatultValue: null,
    },

    validate: {
      description: (val) => (val ? null : t("validation.required")),
      name: (val) => (val ? null : t("validation.required")),
      type: (val) => (val ? null : t("validation.required")),
      required: (val) => (val ? null : t("validation.required")),
      widget: (val) => (val ? null : t("validation.required")),
    },
  });

  const createTextField = (field) => {
    const ret = (
      <TextInput
        disabled
        label={t("document.field.label." + field)}
        placeholder={t("document.field.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createSelect = (field, data) => {
    const ret = (
      <Select
        disabled
        label={t("document.field.label." + field)}
        data={data ? data : []}
        placeholder={t("document.field.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createCheck = (field, data) => {
    const ret = (
      <Checkbox
        disabled
        label={t("document.field.label." + field)}
        placeholder={t("document.field.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  const getData = async () => {
    const params = { token: user.token, entityDefinitionId: entityDefinitionId, fieldId: selectedFieldId };
    let ret = await findFieldById(params);
    setField(ret);

    ret = await findAllDataSource(params);
    setDataSources(
      ret.map((p) => {
        return { value: p.id, label: p.name };
      })
    );

    const filterRows = rows.filter((r) => r.widget === "Select");
    ret = filterRows.map((r) => {
      return { value: r.id, label: r.name };
    });
    setRelatedField(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedFieldId]);

  useEffect(() => {
    if (field) {
      form.setFieldValue("name", field.name);
      form.setFieldValue("description", field.description);
      form.setFieldValue("type", field.type);
      form.setFieldValue("required", field.required);
      form.setFieldValue("widget", field.widget);
      form.setFieldValue("dataSourceId", field.dataSourceId);
      form.setFieldValue("relatedFieldId", field.relatedFieldId);
      form.setFieldValue("defatultValue", field.defatultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  const onDelete = async (values) => {
    const params = {
      token: user.token,
      entityDefinitionId: entityDefinitionId,
      fieldId: selectedFieldId,
    };

    setWorking(true);
    try {
      await deleteField(params);
      setWorking(false);
      setReloadFields(Date.now());
      navigate("../");
    } catch (error) {
      setWorking(false);
      setError(error);
    }
  };

  const onConfirm = () => {
    onDelete();
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <LoadingOverlay overlayOpacity={0.5} visible={working} />

      <DeleteConfirmation
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
        title={t("notification.title")}
        text={t("notification.delete")}
      />

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
          {t("document.field.title.delete")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            setConfirmModalOpen(true);
          })}
        >
          {height ? (
            <>
              <ScrollArea type="scroll" style={{ width: "100%" }} h={height - 330}>
                <Group mb={"md"} grow>
                  {createTextField("name")}
                </Group>
                <Group mb={"md"} grow>
                  {createTextField("description")}
                </Group>

                <Group mb={"md"} grow>
                  {createCheck("required")}
                </Group>

                <Group mb={"md"} grow>
                  {createSelect("type", fieldType)}
                  {createSelect("widget", widgets)}
                </Group>
                <Group mb={"md"} grow>
                  {createSelect("dataSource", dataSources)}
                  {createSelect("relatedFieldId", relatedField)}
                </Group>

                <Group mb={"md"} grow>
                  {createTextField("defaultValue")}
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
