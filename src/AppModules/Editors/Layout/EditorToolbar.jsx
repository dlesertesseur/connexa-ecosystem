import React, { useEffect } from "react";
import { Button, Group, SegmentedControl, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FilterControl } from "./FilterControl";

const EditorToolbar = () => {
  return (
    <Group position="right" w={"100%"} >
      <FilterControl/>
    </Group>
  );
};

export default EditorToolbar;
