import { Title, Container, Button, Group, LoadingOverlay, ScrollArea, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AbmStateContext, AbmValuesStateContext } from "../Context";
import { findDataSourceById, updateDataSource } from "../../../../DataAccess/DataSource";

export function UpdatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const [value, setValue] = useState(null);
  const { setReloadValues, rows, selectedValueId } = useContext(AbmValuesStateContext);
  const { selectedRowId, setError } = useContext(AbmStateContext);

  const navigate = useNavigate();

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
        label={t("dataSourceValues.label." + field)}
        placeholder={t("dataSourceValues.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const createTextArea = (field) => {
    const ret = (
      <Textarea
        w={"100%"}
        label={t("dataSourceValues.label." + field)}
        placeholder={t("dataSourceValues.placeholder." + field)}
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  const onClose = () => {
    navigate("../");
  };

  const getData = async () => {
    const row = rows.find(r => r.id === selectedValueId)
    setValue(row);
  };

  useEffect(() => {
    getData();
  }, [selectedValueId]);

  useEffect(() => {
    if (value) {
      form.setFieldValue("code", value.code);
      form.setFieldValue("name", value.name);
      form.setFieldValue("description", value.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onUpdate = async (values) => {
    let params = { token: user.token, id: selectedRowId };

    try {
      const dataSource = await findDataSourceById(params);
      if (dataSource) {

        const record = dataSource.children.find(r => r.id === selectedValueId)
        if(record){
          record.code = values.code;
          record.name = values.name;
          record.description = values.description;

          let params = { token: user.token, body: dataSource };
          const ret = await updateDataSource(params);
          if (ret.error) {
            console.log(ret);
            setError(error.message);
          } else {
            setReloadValues(new Date());
            onClose();
          }
        }
      }
    } catch (error) {
      setError(error.message);
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
          {t("dataSourceValues.title.update")}
        </Title>

        <form   autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            onUpdate(values);
          })}
        >
          {height ? (
            <>
              <ScrollArea type="scroll" style={{ width: "100%" }}>
                <Group mb={"md"} grow w={"50%"}>
                  {createTextField("code")}
                </Group>
                <Group mb={"md"} grow>
                  {createTextField("name")}
                </Group>
                <Group mb={"md"}>{createTextArea("description")}</Group>
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
