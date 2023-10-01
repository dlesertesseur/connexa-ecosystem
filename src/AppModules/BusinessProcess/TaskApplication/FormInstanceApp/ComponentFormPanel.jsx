import {
  Button,
  Checkbox,
  Container,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import React, { useContext, useEffect } from "react";
import FormHeaderPanel from "./FormHeaderPanel";
import InstanceFormContex from "./Context";
import DeleteConfirmation from "../../../../Modal/DeleteConfirmation";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../../Hook";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { findFormInstanceById } from "../../../../DataAccess/FormInstance";

const ComponentFormPanel = ({
  formData,
  options,
  panels,
  widgetByPanel,
  formConfig,
  relatedEntities,
  parentId,
  mode,
  title,
  selectedRowId,
  widgetByName,
}) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const wsize = useWindowSize();
  const navigate = useNavigate();

  const { onCreate, onUpdate, onDelete, setReloadData, confirmModalOpen, setConfirmModalOpen, datasourceValuesById } =
    useContext(InstanceFormContex);
  const form = useForm(formConfig);
  const totalHeaderHeight = 260 + (title ? 60 : 0);

  const buildGroup = (group, index) => {
    const ret = (
      <Group key={index} grow mb={"md"}>
        {group?.map((f) => buildField(f))}
      </Group>
    );

    return ret;
  };

  const getDataSource = (field) => {
    let ret = [];    
    if(datasourceValuesById.has(field.datasourceId)){
      ret = datasourceValuesById.get(field.datasourceId)
    }
    return(ret);
  }


  const buildField = (field) => {
    let ret = null;

    switch (field.type) {
      case "TEXTINPUT":
        ret = (
          <TextInput
            disabled={mode === "DELETE" ? true : false}
            {...form.getInputProps(field.name)}
            key={field.id}
            withAsterisk={field.required}
            label={field.label}
            placeholder={field.name}
          />
        );
        break;
      case "TEXTAREA":
        ret = (
          <Textarea
            disabled={mode === "DELETE" ? true : false}
            key={field.id}
            withAsterisk={field.required}
            label={field.label}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case "NUMBERINPUT":
        ret = (
          <NumberInput
            disabled={mode === "DELETE" ? true : false}
            key={field.id}
            withAsterisk={field.required}
            label={field.label}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case "SELECT":
        ret = (
          <Select
            disabled={mode === "DELETE" ? true : false}
            key={field.id}
            withAsterisk={field.required}
            label={field.label}
            placeholder={field.name}
            data={getDataSource(field)}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case "CHECKBOX":
        ret = (
          <Checkbox
            disabled={mode === "DELETE" ? true : false}
            key={field.id}
            withAsterisk={field.required}
            label={field.label}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;

      case "IMAGE":
        break;
      case "UPLOAD":
        break;

      default:
        break;
    }

    return ret;
  };

  const buildForm = (panels) => {
    const rows = panels?.map((f, index) => {
      const group = widgetByPanel.get(f.id);
      const ret = buildGroup(group, index);
      return ret;
    });

    return rows;
  };

  const getValue = (c) => {
    const widget = widgetByName.get(c.name);
    let ret = null;
    switch (widget?.type) {
      case "NUMBERINPUT":
        ret = parseFloat(c.value);
        break;

      default:
        ret = c.value;
        break;
    }
    return ret;
  };

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findFormInstanceById(params);
    ret?.children.forEach((c) => {
      const value = getValue(c);
      form.setFieldValue(c.name, value);
    });
  };

  useEffect(() => {
    if (selectedRowId) {
      getData();
    }
  }, [selectedRowId]);

  const processAction = async (mode, parentId, values, selectedRowId) => {
    switch (mode) {
      case "CREATE":
        await onCreate(parentId, values);
        setReloadData(Date.now());
        navigate("../../");
        break;

      case "UPDATE":
        await onUpdate(parentId, selectedRowId, values);
        setReloadData(Date.now());
        navigate("../../");
        break;

      case "DELETE":
        setConfirmModalOpen(true);
        break;

      case "FORM":
        await onCreate(parentId, values);
        setReloadData(Date.now());
        navigate("../../");
        break;

      default:
        break;
    }
  };

  const onConfirm = async () => {
    const ret = await onDelete(parentId, selectedRowId);
    setConfirmModalOpen(false)
    setReloadData(Date.now());
    navigate("../../");
  };

  return (
    <Container size={options?.size} w={"100%"}>
      <DeleteConfirmation
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
        title={t("notification.title")}
        text={t("notification.delete")}
      />

      <Stack spacing={"xs"}>
        <form
          onSubmit={form.onSubmit(async (values) => {
            await processAction(mode, parentId, values, selectedRowId);
          })}
        >
          {title === undefined ? (
            <FormHeaderPanel name={formData?.label} description={formData?.description} />
          ) : (
            <Group position={"center"}>
              <Text size={"lg"} weight={600}>
                {title}
              </Text>
            </Group>
          )}

          {relatedEntities ? (
            <Group position="left" my={"xs"} spacing={"xs"}>
              {relatedEntities.map((re) => {
                return (
                  <Button
                    key={re.id}
                    onClick={() => {
                      navigate(`${re.name}`);
                    }}
                  >
                    {re.label}
                  </Button>
                );
              })}
            </Group>
          ) : null}

          <ScrollArea offsetScrollbars h={wsize.height - totalHeaderHeight - (relatedEntities?.length > 0 ? 36 : 0)}>
            {buildForm(panels)}

            {panels?.length > 0 ? (
              <Group position="right" pt={"md"}>
                <Button type="submit">{t("button.accept")}</Button>
                <Button
                  onClick={() => {
                    navigate("../../");
                    form.reset();
                  }}
                >
                  {t("button.cancel")}
                </Button>
              </Group>
            ) : null}
          </ScrollArea>
        </form>
      </Stack>
    </Container>
  );
};

export default ComponentFormPanel;
