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
      <InstanceFormPanel task={task} formId={"dc6f2874-e6ee-43ab-9071-c5855d17f235"} collection={false} parentId={null} />
    </Stack>
  );
};

export default DummyApp;
