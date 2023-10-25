import React from "react";
import { Stack, Text } from "@mantine/core";

const FormHeaderPanel = ({ name, description }) => {
  const ret = name ? (
    <Stack
      justify="stretch"
      spacing={"xs"}
    >
      <Stack
        spacing={0}
        align={"flex-start"}
      >
        <Text size="xl" weight={700}>
          {name}
        </Text>
        <Text size="xs" color="dimmed">
          {description}
        </Text>
      </Stack>
    </Stack>
  ) : null;

  return ret;
};

export default FormHeaderPanel;
