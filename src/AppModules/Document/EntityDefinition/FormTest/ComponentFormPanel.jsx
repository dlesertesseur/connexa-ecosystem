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
import React, { useEffect } from "react";
import FormHeaderPanel from "./FormHeaderPanel";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../../Hook";
import { useForm } from "@mantine/form";

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
  const { t } = useTranslation();
  const wsize = useWindowSize();
  const navigate = useNavigate();

  const totalHeaderHeight = 310 + (mode ? 60 : 0) ;

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
            key={field.id}
            withAsterisk={field.required}
            label={field.label}
            placeholder={field.name}
            data={[]}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case "CHECKBOX":
        ret = (
          <Checkbox
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

  const form = useForm(formConfig);

  return (
    <Container size={options?.size} w={"100%"}>
      <Stack spacing={"xs"}>
        <form
          onSubmit={form.onSubmit((values) => {
            console.log("onSubmit ->", values);
          })}
        >
          {mode === undefined ? (
            <FormHeaderPanel name={formData?.label} description={formData?.description} />
          ) : (
            <Group position={"center"}>
              <Text size={"lg"} weight={600}>{mode}</Text>
            </Group>
          )}

          {relatedEntities ? (
            <Group position="left" my={"xs"} spacing={"xs"}>
              {relatedEntities.map((re) => {
                return (
                  <Button
                    key={re.formId}
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
          </ScrollArea>

          {formData ? (
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
        </form>
      </Stack>
    </Container>
  );
};

export default ComponentFormPanel;
