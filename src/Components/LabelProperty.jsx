import { Group, Paper, Text } from "@mantine/core";
import React from "react";

const LabelProperty = ({ label, value, p = 6 }) => {
  return (
    <Paper withBorder p={p}>
      <Group position="apart" spacing={"xs"}>
        <Text size={"sm"} weight={500}>
          {label}
        </Text>
        <Text size={"sm"} weight={400}>
          {value}
        </Text>
      </Group>
    </Paper>
  );
};

export default LabelProperty;
