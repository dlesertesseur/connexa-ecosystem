import React, { useEffect } from "react";
import {
  Checkbox,
  Container,
  Group,
  Modal,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import { useWindowSize } from "../../../../Hook";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import uuid from "react-uuid";

const ViewLayoutModal = ({ open, close, entityDefinition, panels, widgetByPanel, size }) => {
  const { t } = useTranslation();
  const wsize = useWindowSize();
  const [formConfig, setFormConfig] = useState();

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
            key={key}
            withAsterisk={field.required}
            label={field.description}
            placeholder={field.name}
            {...form.getInputProps(field.name)}
          />
        );
        break;
      case 2:
        ret = (
          <Textarea
            key={key}
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
            key={key}
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
            key={key}
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
            key={key}
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
    const fields = panels?.map((f, index) => {
      const group = widgetByPanel.get(f.id);
      const ret = buildGroup(group, index);
      return ret;
    });

    return fields;
  };

  const createInitialValues = (panels) => {
    const ret = {};
    panels.forEach((p) => {
      const group = widgetByPanel.get(p.id);
      group.forEach((f) => {
        ret[f.name] = f.type === 1 ? "" : null;
      });
    });

    return ret;
  };

  const createValidations = (fields) => {
    const ret = {};

    panels.forEach((p) => {
      const group = widgetByPanel.get(p.id);
      group.forEach((f) => {
        if (f.required) {
          ret[f.name] = (val) => (val ? null : t("validation.required"));
        }
      });
    });
    return ret;
  };

  useEffect(() => {
    if (open) {
      setFormConfig({
        initialValues: createInitialValues(panels),
        validate: createValidations(panels),
      });
    }
  }, [open]);

  const form = useForm(formConfig);

  return (
    <Modal fullScreen opened={open} onClose={close} title={entityDefinition.name}>
      <Container size={size}>
        <Stack spacing={"xs"}>
          <form
            onSubmit={form.onSubmit((values) => {
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
    </Modal>
  );
};

export default ViewLayoutModal;
