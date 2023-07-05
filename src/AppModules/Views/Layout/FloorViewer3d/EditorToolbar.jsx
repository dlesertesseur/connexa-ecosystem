import React from "react";
import { Group } from "@mantine/core";
import { FilterControl } from "./FilterControl";

const EditorToolbar = () => {
  return (
    <Group position="right" w={"100%"} >
      <FilterControl/>
    </Group>
  );
};

export default EditorToolbar;
