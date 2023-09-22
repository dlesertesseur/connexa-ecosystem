import React, { useEffect } from "react";
import { Button, Checkbox, Container, Group, Modal, Select, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import { findAllEntityDefinition } from "../../../../DataAccess/EntityDefinition";
import { useForm } from "@mantine/form";

const EntitySelectionModal = ({ open, close, addEntity, selectedEntity, updateEntity }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [rows, setRows] = useState(null);
  const [checked, setChecked] = useState(false);

  const getData = async () => {
    const params = {
      token: user.token,
    };

    try {
      let ret = null;
      const list = await findAllEntityDefinition(params);

      ret = list.map((r) => {
        return {
          id: r.id,
          name: r.name,
          description: r.description,
        };
      });
      setRows(ret);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset();
      getData();
    }
    setChecked(false);
  }, [open]);

  useEffect(() => {
    if (open && selectedEntity) {
      form.setFieldValue("entity", selectedEntity.entity.id);
      setChecked(selectedEntity.asCollection);
    }
  }, [selectedEntity, open]);

  const form = useForm({
    initialValues: {
      entity: "",
    },

    validate: {
      entity: (val) => (val ? null : t("validation.required")),
    },
  });

  return (
    <Modal opened={open} onClose={close} title={t("document.entityDefinition.title.addEntity")} size={"md"}>
      <Container>
        <Stack spacing={"xs"}>
          <form
            onSubmit={form.onSubmit((values) => {
              const entity = rows.find((e) => e.id === values.entity);
              if (selectedEntity) {
                updateEntity(entity, checked);
              } else {
                addEntity(entity, checked);
              }
              close();
            })}
          >
            <Group grow spacing={"xs"} mb={"md"}>
              <Select
                label={t("document.entityDefinition.label.entity")}
                placeholder={t("document.entityDefinition.placeholder.entity")}
                data={rows?.map((e) => {
                  return { value: e.id, label: e.name };
                })}
                {...form.getInputProps("entity")}
              />
            </Group>

            <Group grow spacing={"xs"} mb={"lg"}>
              <Checkbox
                label={t("document.entityDefinition.label.relation")}
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
              />
            </Group>

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

export default EntitySelectionModal;
