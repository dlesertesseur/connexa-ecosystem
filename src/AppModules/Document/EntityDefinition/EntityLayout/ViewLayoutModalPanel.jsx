import {
  Checkbox,
  Container,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useWindowSize } from "../../../../Hook";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import uuid from "react-uuid";

const ViewLayoutModalPanel = ({ formConfig, panels, widgetByPanel, size, close }) => {
  const { t } = useTranslation();
  const wsize = useWindowSize();
  const [rows, setRows] = useState(null);

  const form = useForm(formConfig);

  const buildGroup = (group, index) => {
    const ret = (
      <Group key={index} grow mb={"xs"}>
        {group?.map((f) => buildField(f))}
      </Group>
    );

    return ret;
  };

  const buildField = (field) => {
    const key = uuid();
    let ret = null;
    switch (field.widget) {
      case 1:
        ret = (
          <TextInput
            {...form.getInputProps(field.name)}
            key={field.id}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
          />
        );
        break;
      case 2:
        ret = (
          <Textarea
            key={field.id}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 3:
        ret = (
          <NumberInput
            key={field.id}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 4:
        ret = (
          <Select
            key={field.id}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            data={[]}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 5:
        ret = (
          <Checkbox
            key={field.id}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
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

  return (
    <Container size={size}>
      <Stack spacing={"xs"}>
        <form
          onSubmit={form.onSubmit((values) => {
            console.log("onSubmit ->", values);
            form.reset();
          })}
        >
          <ScrollArea h={wsize.height - 120}>{buildForm(panels)}</ScrollArea>

          <Group position="right">
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={() => {
                close();
                form.reset();
              }}
            >
              {t("button.cancel")}
            </Button>
          </Group>
        </form>
      </Stack>
    </Container>
  );
};

export { ViewLayoutModalPanel };
