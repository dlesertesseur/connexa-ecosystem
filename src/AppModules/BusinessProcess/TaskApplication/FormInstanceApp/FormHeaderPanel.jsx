import React from "react";
import { Divider, Stack, Text } from "@mantine/core";

const FormHeaderPanel = ({ name, description }) => {
  const ret = name ? (
    <Stack
      justify="stretch"
      spacing={"xs"}
      h={60}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        width: "100%",
      })}
      mt={"xs"}
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
      <Divider />
    </Stack>
  ) : null;

  return ret;
};

export default FormHeaderPanel;
