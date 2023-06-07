import React from "react";
import { Button, Group, Modal, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const PartInspector = ({ opened, close, part }) => {
  const { t } = useTranslation();

  // useEffect(() => {
  // }, [part]);

  return (
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.partInspector") + " " + part?.name}>
      <Stack justify="flex-start">
        <Group position="right">
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

export default PartInspector;
