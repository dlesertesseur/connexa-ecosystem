import React from "react";
import { Group, Paper, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

const DesignHeader = ({ project }) => {
  const { t } = useTranslation();

  return (
    <Paper withBorder p={6}>
      <Stack spacing={"xs"}>
        <Group position="left">
          <Text size={"md"} weight={700}>{project?.name}</Text>
        </Group>
      </Stack>
    </Paper>
  );
};

export default DesignHeader;
