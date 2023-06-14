import React, { useEffect } from "react";
import { Button, Group, Modal, Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const ModuleInspector = ({ opened, close, part }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(null);

  useEffect(() => {}, []);

  return (
    <Modal opened={opened} size={"xl"} onClose={close} title={t("editor.modelStructure.title.partInspector")}>
      <Stack justify="flex-start">
        <Title order={4}>{title}</Title>

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
      </Stack>
    </Modal>
  );
};

export default ModuleInspector;
