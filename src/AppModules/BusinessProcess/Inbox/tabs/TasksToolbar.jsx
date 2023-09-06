import React from "react";
import { Button, Group, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { isDisabled } from "@testing-library/user-event/dist/utils";

const TasksToolbar = ({ task }) => {
  const { t } = useTranslation();

  const isDisabled = (button) => {
    let ret = true;
    if (task) {
      switch (button) {
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

    return ret;
  };

  return (
    <Group spacing={0} position="apart">
      <Group spacing={"xs"}>
        <Button disabled={isDisabled("take")} onClick={() => console.log("onTake")}>
          <Text>{t("businessProcessModelInbox.buttons.take")}</Text>
        </Button>
        <Button disabled={isDisabled("release")} onClick={() => console.log("onRelease")}>
          <Text>{t("businessProcessModelInbox.buttons.release")}</Text>
        </Button>
        <Button disabled={isDisabled("doit")} onClick={() => console.log("onDo")}>
          <Text>{t("businessProcessModelInbox.buttons.doit")}</Text>
        </Button>
      </Group>
      <Group spacing={"xs"}>
        <Button disabled={isDisabled("transfer")} onClick={() => console.log("onTransfer")}>
          <Text>{t("businessProcessModelInbox.buttons.transfer")}</Text>
        </Button>
      </Group>
    </Group>
  );
};

export default TasksToolbar;
