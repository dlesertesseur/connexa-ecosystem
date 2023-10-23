import React from "react";
import { Button, Group, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import { IconSend } from "@tabler/icons-react";

const TasksToolbar = ({ task }) => {
  const { t } = useTranslation();
  const { onDoTask, onTakeTask, onReleaseTask, getTransferOptions, sendToScrumMaster, onViewTask, loading } = useContext(AbmStateContext);

  const isDisabled = (button) => {
    let ret = true;
    if (!loading) {
      if (task) {
        switch (button) {
          case "view":
            ret = false;
            break;

          case "take":
            ret = task.userId !== null;
            break;
          case "release":
          case "doit":
          case "advance":
          case "sendToScrumMaster":
            ret = task.userId === null;
            break;
        }
      }
    }

    return ret;
  };

  return (
    <Group spacing={0} position="apart">
      <Group spacing={"xs"}>
        <Button disabled={isDisabled("take")} onClick={() => onTakeTask(task)}>
          <Text>{t("businessProcessModelInbox.buttons.take")}</Text>
        </Button>
        <Button disabled={isDisabled("release")} onClick={() => onReleaseTask(task)}>
          <Text>{t("businessProcessModelInbox.buttons.release")}</Text>
        </Button>
        <Button
          disabled={isDisabled("doit")}
          onClick={() => {
            onDoTask(task);
          }}
        >
          <Text>{t("businessProcessModelInbox.buttons.doit")}</Text>
        </Button>
        <Button
          disabled={isDisabled("view")}
          onClick={() => {
            onViewTask(task);
          }}
        >
          <Text>{t("businessProcessModelInbox.buttons.viewOnDiagram")}</Text>
        </Button>
      </Group>
      <Group spacing={"xs"}>
        <Button disabled={isDisabled("sendToScrumMaster")} loading={loading} rightIcon={<IconSend size={18}/>} onClick={() => sendToScrumMaster(task)}>
          <Text>{t("businessProcessModelInbox.buttons.sendToScrunMaster")}</Text>
        </Button>
        <Button disabled={isDisabled("advance")} loading={loading} onClick={() => getTransferOptions(task)}>
          <Text>{t("businessProcessModelInbox.buttons.advance")}</Text>
        </Button>
      </Group>
    </Group>
  );
};

export default TasksToolbar;
