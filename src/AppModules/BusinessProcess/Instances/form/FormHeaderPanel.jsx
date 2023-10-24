import React from "react";
import { Stack, Text } from "@mantine/core";

const FormHeaderPanel = ({ name, description }) => {
  const ret = name ? (
    <Stack
      justify="stretch"
      spacing={"xs"}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        width: "100%",
      })}
    >
      <Stack
        spacing={0}
        align={"flex-start"}
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          height: "48px",
        })}
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
