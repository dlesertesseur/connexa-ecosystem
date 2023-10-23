import React from "react";
import { ActionIcon, Button, Divider, Group, Stack, Text } from "@mantine/core";
import { IconDeviceFloppy, IconDownload } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DragButton from "./model/DragButton";

const DesignToolbar = ({ onSave, onExport }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onBack = () => {
    navigate("../");
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Stack spacing={"xs"}>
      <Group position="apart" spacing={"xs"}>
        <Group spacing={"xs"}>
          <ActionIcon
            color="blue"
            variant="filled"
            onClick={() => {
              onSave();
            }}
          >
            <IconDeviceFloppy size="20" />
          </ActionIcon>
          <ActionIcon
            color="blue"
            variant="filled"
            onClick={() => {
              onExport();
            }}
          >
            <IconDownload size="20" />
          </ActionIcon>
          <Divider orientation="vertical" />
          <DragButton text={t("businessProcessModel.label.init")} onDragStart={(event) => onDragStart(event, "initNode")} />
          <DragButton text={t("businessProcessModel.label.end")} onDragStart={(event) => onDragStart(event, "endNode")} />
          <DragButton text={t("businessProcessModel.label.task")} onDragStart={(event) => onDragStart(event, "taskNode")} />
          <DragButton text={t("businessProcessModel.label.fork")} onDragStart={(event) => onDragStart(event, "forkNode")} />
          <DragButton text={t("businessProcessModel.label.join")} onDragStart={(event) => onDragStart(event, "joinNode")} />
          <DragButton text={t("businessProcessModel.label.stage")} onDragStart={(event) => onDragStart(event, "stageNode")} />
        </Group>
        <Group>
          <Button size="xs" onClick={onBack}>
            <Text>{t("button.back")}</Text>
          </Button>
        </Group>
      </Group>
    </Stack>
  );
};

export default DesignToolbar;
