import React from "react";
import FloorPlanView2d from "./FloorPlanView2d";
import { Stack } from "@mantine/core";

const Viewer = () => {
  return (
    <Stack>
      <Stack
        justify="flex-start"
        spacing="0"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2],
          height: "100%",
          border: "solid 1px" + theme.colors.gray[3],
        })}
      >
        <FloorPlanView2d />
      </Stack>
    </Stack>
  );
};

export default Viewer;
