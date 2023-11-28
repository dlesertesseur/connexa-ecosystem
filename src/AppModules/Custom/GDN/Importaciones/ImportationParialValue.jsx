import { Group, Paper, Stack, Text } from "@mantine/core";
import React from "react";

const ImportationParialValue = ({ title, value }) => {
  return (
    <Paper withBorder radius="md" p="xs" bg={"gray.1"}>
      <Group position="center">
        <Stack spacing={"xs"} justify="center">
          <Text align="center" c="dimmed" size="xs" tt="uppercase" fw={500}>
            {title}
          </Text>
          <Text align="center" fw={700} size="xl">
            {value}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
};

export default ImportationParialValue;
