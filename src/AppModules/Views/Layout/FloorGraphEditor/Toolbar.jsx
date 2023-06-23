import React from "react";
import { Group } from "@mantine/core";
import { TOOLBAR_HIGHT } from "../../../../Constants";

const Toolbar = ({ children }) => {
  return (
    <Group
      px={"xs"}
      spacing={"xs"}
      position="apart"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1],
        height: TOOLBAR_HIGHT + "px",
      })}
    >
      <Group>{children}</Group>
    </Group>
  );
};

export default Toolbar;
