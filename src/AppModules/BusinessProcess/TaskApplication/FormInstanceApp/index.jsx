import React from "react";
import { Stack } from "@mantine/core";
import InstanceFormPanel from "./InstanceFormPanel";

const DummyApp = ({ task }) => {

  return (
    <Stack
      spacing={"xs"}
      justify="flex-start"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
      })}
    >
      <InstanceFormPanel task={task} formId={"1f10774a-4ba7-44ee-b4a4-cca7e5808b23"} collection={false} parentId={null} />
    </Stack>
  );
};

export default DummyApp;
