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
import React from "react";
import FormHeaderPanel from "./FormHeaderPanel";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../../Hook";
import { useForm } from "@mantine/form";
import { TimeInput, DatePicker } from "@mantine/dates";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { findDataSourceById } from "../../../../DataAccess/DataSource";
import { useState } from "react";

const ComponentFormPanel = ({
  formData,
  options,
  panels,
  widgetByPanel,
  formConfig,
  relatedEntities,
  parentId,
  mode,
}) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const wsize = useWindowSize();
  const navigate = useNavigate();

  const form = useForm(formConfig);
  const totalHeaderHeight = 310 + (mode ? 60 : 0);

  const [datasourceValuesById, setDatasourceValuesById] = useState(new Map());

  const buildGroup = (group, index) => {
    const ret = (
      <Group key={index} grow mb={"md"}>
        {group?.map((f) => buildField(f))}
      </Group>
    );

    return ret;
  };

  const buildField = (field) => {
    let ret = null;

    switch (field.type) {
      case "TEXTINPUT":
        ret = (
          <TextInput
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
            disabled={!datasourceValuesById.has(field.datasourceId)}
            key={field.id}
            withAsterisk={field.required}
            label={field.label}
            placeholder={field.name}
            data={datasourceValuesById.has(field.datasourceId) ? datasourceValuesById.get(field.datasourceId) : []}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case "CHECKBOX":
        ret = (
          <Checkbox
            key={field.id}
            label={field.label}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;

      case "LABEL":
        ret = (
          <Stack disabled={mode === "DELETE" ? true : false} key={field.id} spacing={0} align={"flex-start"}>
            <Text size="xl" weight={700}>
              {field.label}
            </Text>
            <Text size="xs" color="dimmed">
              {field.description}
            </Text>
          </Stack>
        );
        break;

      case "TIME":
        ret = (
          <TimeInput key={field.id} label={field.label} placeholder={field.name} {...form.getInputProps(field.name)} />
        );
        break;

      case "DATE":
        ret = (
          <DatePicker key={field.id} label={field.label} placeholder={field.name} {...form.getInputProps(field.name)} />
        );
        break;

      case "IMAGE":
        break;
      case "UPLOAD":
        // ret = (
        //   <FileButton
        //     key={field.id}
        //     label={field.label}
        //     placeholder={field.name}
        //     {...form.getInputProps(field.name)}
        //   />
        // );
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

  const getData = async () => {
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
    if (panels) {
      getData();
    }
  }, [panels]);

  return (
    <Container size={options?.size} w={"100%"}>
      <Stack spacing={"xs"}>
        <form
          autoComplete="false"
          onSubmit={form.onSubmit((values) => {
            console.log("onSubmit ->", values);
          })}
        >
          {mode === undefined ? (
            <FormHeaderPanel name={formData?.label} description={formData?.description} />
          ) : (
            <Group position={"center"}>
              <Text size={"lg"} weight={600}>
                {mode}
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
              <Group position="right" my={"xs"}>
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
