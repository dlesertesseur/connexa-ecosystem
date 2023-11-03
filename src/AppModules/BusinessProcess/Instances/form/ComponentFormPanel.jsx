import {
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
import React, { useEffect } from "react";
import { useWindowSize } from "../../../../Hook";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { findFormInstanceById } from "../../../../DataAccess/FormInstance";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useState } from "react";
import { findDataSourceById } from "../../../../DataAccess/DataSource";
import FormHeaderPanel from "./FormHeaderPanel";

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
  deltaY = 0
}) => {
  const { user } = useSelector((state) => state.auth.value);
  const wsize = useWindowSize();

  const [datasourceValuesById, setDatasourceValuesById] = useState(new Map());

  const form = useForm(formConfig);
  const totalHeaderHeight = 260 + deltaY + (title ? 60 : 0);

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
    if (existDataSource(field)) {
      ret = datasourceValuesById.get(field.datasourceId);
    }
    return ret;
  };

  const existDataSource = (field) => {
    let ret = false;
    if (field?.datasourceId) {
      ret = datasourceValuesById.has(field.datasourceId);
    }
    return ret;
  };

  const buildField = (field) => {
    let ret = null;

    switch (field.type) {
      case "TEXTINPUT":
        ret = (
          <TextInput
            disabled={true}
            key={field.id}
            withAsterisk={field.required}
            label={field.label}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case "TEXTAREA":
        ret = (
          <Textarea
            disabled={true}
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
            disabled={true}
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
            disabled={true}
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
            disabled={true}
            key={field.id}
            label={field.label}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;

      case "LABEL":
        ret = (
          <Stack key={field.id} spacing={0} align={"flex-start"}>
            <Text size="xl" weight={700}>
              {field.label}
            </Text>
            <Text size="xs" color="dimmed">
              {field.description}
            </Text>
          </Stack>
        );
        break;

      case "DATE":
        ret = (
          <DatePicker
            disabled={true}
            key={field.id}
            withAsterisk={field.required}
            label={field.label}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;

      case "TIME":
        ret = (
          <TimeInput
            disabled={true}
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
    const widget = widgetByName?.get(c.name);
    let ret = null;
    switch (widget?.type) {
      case "NUMBERINPUT":
        ret = parseFloat(c.value);
        break;

      case "DATE":
        ret = new Date(Date.parse(c.value));
        break;

      case "TIME":
        ret = new Date(Date.parse(c.value));
        break;

      default:
        ret = c.value;
        break;
    }
    return ret;
  };

  const getData = async () => {
    const params = { token: user.token, id: parentId };
    const instanceNode = await findFormInstanceById(params);
    let fields = null;

    switch (mode) {
      case "CREATE":
        break;

      case "UPDATE":
      case "DELETE":
        if (instanceNode && selectedRowId) {
          const collectionName = `COLLECTION<${formData.name}>`;
          const collection = instanceNode.children.find((c) => c.name === collectionName);
          const record = collection?.children.find((c) => c.id === selectedRowId);
          if (record) {
            fields = record.children;
          }
        }
        break;

      case "FORM":
        fields = instanceNode?.children;
        break;

      case "SUBFORM":
        if (instanceNode) {
          const subformName = `SUBFORM<${formData?.name}>`;
          const subform = instanceNode.children.find((c) => c.name === subformName);
          if (subform !== undefined) {
            fields = subform.children;
          }
        }
        break;
    }

    if (instanceNode && fields) {
      fields?.forEach((c) => {
        if (!c.name.startsWith("COLLECTION") && !c.name.startsWith("FORM")) {
          const value = getValue(c);
          form.setFieldValue(c.name, value);
        }
      });
    }
  };

  useEffect(() => {
    if (parentId && Object.values(formConfig).length > 0) {
      getData();
    }
  }, [parentId]);

  const storeDataSourceData = async (dataSourcesId) => {
    const dataMap = new Map();
    for (let index = 0; index < dataSourcesId.length; index++) {
      const id = dataSourcesId[index];

      const params = {
        token: user.token,
        id: id,
      };

      const datasource = await findDataSourceById(params);
      if (datasource) {
        const ret = datasource.children?.map((d) => {
          return { value: d.id, label: d.name };
        });

        if (ret) {
          dataMap.set(id, ret);
        }
      }
    }
    return dataMap;
  };

  const getDataSourceInfo = async () => {
    const listId = new Set();
    panels.forEach((p) => {
      const group = widgetByPanel.get(p.id);
      group.forEach((f) => {
        if (f.datasourceId) {
          listId.add(f.datasourceId);
        }
      });
    });

    const ret = await storeDataSourceData(Array.from(listId));
    setDatasourceValuesById(ret);
  };

  useEffect(() => {
    if (parentId) {
      getDataSourceInfo();
    }
  }, [parentId]);

  return (
    <Stack spacing={"xs"} p={"xs"} justify="flex-start">
      {title === undefined ? (
        <FormHeaderPanel name={formData?.label} description={formData?.description} />
      ) : (
        <Group position={"center"}>
          <Text size={"lg"} weight={600}>
            {title}
          </Text>
        </Group>
      )}

      <Container size={options?.size} w={"100%"}>
        <Stack spacing={"xs"} w={"100%"}>
          <form autoComplete="false">
            <ScrollArea offsetScrollbars h={wsize.height - totalHeaderHeight - (relatedEntities?.length > 0 ? 36 : 0)}>
              {buildForm(panels)}
            </ScrollArea>
          </form>
        </Stack>
      </Container>
    </Stack>
  );
};

export default ComponentFormPanel;
