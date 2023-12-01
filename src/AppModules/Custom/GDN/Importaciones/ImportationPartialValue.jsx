import { Group, Paper, Stack, Text } from "@mantine/core";
import React from "react";

const ImportationPartialValue = ({ title, value, color="black" }) => {
  return (
    <Paper withBorder radius="md" bg={"gray.1"}>
      <Group position="center">
        <Stack spacing={"xs"} justify="center">
          <Text align="center" c="dimmed" size="xs" tt="uppercase" fw={500}>
            {title}
          </Text>
          <Text align="center" fw={700} size="24px" color={value > 0 ? color : "black"}>
            {value > 0 ? value : "-"}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
};

export default ImportationPartialValue;
