import { Group, SegmentedControl, Text } from "@mantine/core";
import React from "react";

const EditorToolbar = ({ structure, setTransforOption, transforOption }) => {
  return (
    <Group spacing={0}>
      {structure ? (
        <Text
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 600,
          })}
        >
          {structure.name}
        </Text>
      ) : null}

      <SegmentedControl
        size="xs"
        ml={"xs"}
        value={transforOption}
        onChange={setTransforOption}
        data={[
          { label: "Scale", value: "scale" },
          { label: "Rotate", value: "rotate" },
          { label: "Vue", value: "translate" },
        ]}
      />
    </Group>
  );
};

export default EditorToolbar;
