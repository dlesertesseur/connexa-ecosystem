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
import { FieldStateContext } from "../Context";
import { findAllDataSource } from "../../../../DataAccess/DataSource";
import { useEffect } from "react";

export function CreatePage({ businessProcessId }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { rows } = useContext(FieldStateContext);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [dataSources, setDataSources] = useState(false);
  const [relatedField, setRelatedField] = useState(false);
  const { setReloadFields } = useContext(FieldStateContext);


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
      type: "",
      required: false,
      widget: "",
      dataSourceId: "",
      relatedFieldId: "",
      defatultValue: "",
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

  const onCreate = async (values) => {
    const params = {
      userId: user.id,
      businessProcessId: businessProcessId,
      values: { ...values },
    };

    await createBusinessProcessParameter(params);
    setReloadParameters(new Date());
    onClose();
  };

  const getData = async () => {
    const params = { token: user.token };

    let ret = await findAllDataSource(params);
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
          {t("document.field.title.create")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
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
