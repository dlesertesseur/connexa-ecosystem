import { Modal, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import React from "react";

const TaskSettings = ({ open, close }) => {
  const { t } = useTranslation();
  return (
    <Modal opened={open} onClose={close} title={t("businessProcess.title.taskSettings")} centered>
      <Text>{"cadorna !!!"}</Text>
    </Modal>
  );
};

export default TaskSettings;
