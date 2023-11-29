import { Group, Paper, Stack, Text } from "@mantine/core";
import React from "react";

const ImportationTotalValue = ({ value }) => {
  return (
    <Paper withBorder radius="md" bg={"blue.1"}>
      <Group position="center">
        <Stack spacing={"xs"} justify="center">
          <Text align="center" fw={700} size="56px" c={"blue"}>
            {value}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
};

export default ImportationTotalValue;
