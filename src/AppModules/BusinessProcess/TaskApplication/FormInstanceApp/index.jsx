import React from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Toolbar = ({task}) => {
  const { t } = useTranslation();
  const navegate = useNavigate();

  const isDisabled = (button) => {
    let ret = true;
    if (task) {
      switch (button) {
        case "bt1":
          ret = task.userId !== null;
          break;
        case "bt2":
        case "bt3":
          ret = task.userId === null;
          break;
      }
    }

    return ret;
  };

  return (
    <Group spacing={0} position="apart" mt={"xs"}>
      <Group spacing={"xs"}>
        <Button disabled={isDisabled("bt1")} onClick={() => console.log("Option 1")}>
          <Text>{"Option 1"}</Text>
        </Button>
        <Button disabled={isDisabled("bt2")} onClick={() => console.log("Option 2")}>
          <Text>{"Option 2"}</Text>
        </Button>
        <Button disabled={isDisabled("bt3")} onClick={() => console.log("Option 3")}>
          <Text>{"Option 3"}</Text>
        </Button>
      </Group>
      <Group spacing={"xs"}>
        <Button onClick={() => navegate("../")}>
          <Text>{t("businessProcessModelInbox.buttons.back")}</Text>
        </Button>
      </Group>
    </Group>
  );
};

const DummyApp = () => {
  return (
    <Stack spacing={"xs"}>
      <Toolbar />
      {/* <SimpleTable
        data={tasksList}
        columns={columns}
        loading={loading}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        headerHeight={HEADER_HIGHT + 64}
      /> */}
    </Stack>
  );
};

export default DummyApp;
