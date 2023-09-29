import {
  Title,
  Container,
  Button,
  Group,
  LoadingOverlay,
  ScrollArea,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { useContext } from "react";
import { AbmStateContext, AbmValuesStateContext } from "../Context";
import { findDataSourceById, updateDataSource } from "../../../../DataAccess/DataSource";
import uuid from "react-uuid";

export function CreatePage() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { height } = useViewportSize();
  const [working, setWorking] = useState(false);
  const { setReloadValues } = useContext(AbmValuesStateContext);
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

  const onCreate = async (values) => {
    let params = { token: user.token, id: selectedRowId };

    try {
      const dataSource = await findDataSourceById(params);
      if (dataSource) {
        const value = {
          id: uuid(),
          code: values.code,
          name: values.name,
          description: values.description
        };
        
        dataSource.children.push(value);

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
          {t("dataSourceValues.title.create")}
        </Title>

        <form
          onSubmit={form.onSubmit((values) => {
            onCreate(values);
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
