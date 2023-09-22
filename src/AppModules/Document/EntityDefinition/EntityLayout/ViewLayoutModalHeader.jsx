import React from "react";
import { Divider, Stack, Text } from "@mantine/core";

const ViewLayoutModalHeader = ({ name, description }) => {
  return (
    <Stack
      justify="stretch"
      spacing={"xs"}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        height: "60px",
        width: "100%",
      })}
      my={"xs"}
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
  );
};

export default ViewLayoutModalHeader;
