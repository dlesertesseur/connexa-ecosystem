import React, { useEffect } from "react";
import { Button, Group, Modal, Stack, TextInput, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useForm } from "@mantine/form";

const PartInspector = ({ opened, close, part }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(null);

  useEffect(() => {
    if(part){
      const userData = part.userData;
      setTitle(userData.name);
      form.setFieldValue("name", userData.name);

      form.setFieldValue("positionx", userData.positionx.toFixed(2));
      form.setFieldValue("positiony", userData.positiony.toFixed(2));
      form.setFieldValue("positionz", userData.positionz.toFixed(2));

      form.setFieldValue("rotationx", userData.rotationx.toFixed(2));
      form.setFieldValue("rotationy", userData.rotationy.toFixed(2));
      form.setFieldValue("rotationz", userData.rotationz.toFixed(2));

      form.setFieldValue("dimensionx", userData.dimensionx.toFixed(2));
      form.setFieldValue("dimensiony", userData.dimensiony.toFixed(2));
      form.setFieldValue("dimensionz", userData.dimensionz.toFixed(2));

      form.setFieldValue("type", userData.type);
    }
  }, [part]);

  const form = useForm({
    initialValues: {
      name: "",
      positionx: null,
      positiony: null,
      positionz: null,
      rotationx: null,
      rotationy: null,
      rotationz: null,
      dimensionx: null,
      dimensiony: null,
      dimensionz: null,
      type:""
    },

    validate: {
      name: (val) => (val ? null : t("validation.required")),
      // positionx: (val) => (val ? null : t("validation.required")),
      // positiony: (val) => (val ? null : t("validation.required")),
      // positionz: (val) => (val ? null : t("validation.required")),
      // rotationx: (val) => (val ? null : t("validation.required")),
      // rotationy: (val) => (val ? null : t("validation.required")),
      // rotationz: (val) => (val ? null : t("validation.required")),
      // dimensionx: (val) => (val ? null : t("validation.required")),
      // dimensiony: (val) => (val ? null : t("validation.required")),
      // dimensionz: (val) => (val ? null : t("validation.required")),
      // type: (val) => (val ? null : t("validation.required")),
    },
  });


  const updateData = (values) => {
    const userData = part.userData;

    userData.name = values.name;
    // userData.positionx = values.positionx;
    // userData.positiony = values.positiony;
    // userData.positionz = values.positionz;

    // userData.rotationx = values.rotationx;
    // userData.rotationy = values.rotationy;
    // userData.rotationz = values.rotationz;

    // userData.dimensionx = values.dimensionx;
    // userData.dimensiony = values.dimensiony;
    // userData.dimensionz = values.dimensionz;
  }

  const createTextField = (field, disabled = true) => {
    const ret = (
      <TextInput
        disabled={disabled}
        label={t("editor.modelStructure.label." + field)}
        placeholder={t("editor.modelStructure.placeholder." + field)}
        mt="xs"
        {...form.getInputProps(field)}
      />
    );

    return ret;
  };

  return (
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.partInspector")}>
      <Stack justify="flex-start">
      <Title order={4}>{title}</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            updateData(values);
            close();
          })}
        > 
          <Group grow mb="lg">
            {createTextField("name", false)}
          </Group>

          <Group grow mb="lg">
            {createTextField("positionx")}
            {createTextField("positiony")}
            {createTextField("positionz")}
          </Group>

          <Group grow mb="lg">
            {createTextField("rotationx")}
            {createTextField("rotationy")}
            {createTextField("rotationz")}
          </Group>

          <Group grow mb="lg">
            {createTextField("dimensionx")}
            {createTextField("dimensiony")}
            {createTextField("dimensionz")}
          </Group>

          <Group mb="lg">
            {createTextField("type")}
          </Group>

          <Group position="right">
            <Button type="submit">{t("button.accept")}</Button>
            <Button
              onClick={() => {
                close();
              }}
            >
              {t("button.close")}
            </Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  );
};

export default PartInspector;
