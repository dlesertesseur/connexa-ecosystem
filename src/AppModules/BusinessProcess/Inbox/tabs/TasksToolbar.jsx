import React from "react";
import { Button, Group, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AbmStateContext } from "../Context";

const TasksToolbar = ({ task }) => {
  const { t } = useTranslation();
  const { onDoTask, onTakeTask, onReleaseTask, getTransferOptions, viewTask, loading } = useContext(AbmStateContext);

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
          case "transfer":
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
            viewTask(task);
          }}
        >
          <Text>{t("businessProcessModelInbox.buttons.viewOnDiagram")}</Text>
        </Button>
      </Group>
      <Group spacing={"xs"}>
        <Button disabled={isDisabled("transfer")} loading={loading} onClick={() => getTransferOptions(task)}>
          <Text>{t("businessProcessModelInbox.buttons.transfer")}</Text>
        </Button>
      </Group>
    </Group>
  );
};

export default TasksToolbar;
