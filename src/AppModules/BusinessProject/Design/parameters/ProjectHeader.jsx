import React from "react";
import { Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

const ProjectHeader = ({ project }) => {
  const {t} = useTranslation();
  return (
    <Paper withBorder p={6}>
      <Stack spacing={"xs"}>
        {project ? (
          <Group position="left">
            <Text size={"md"} weight={700}>
              {project?.name}
            </Text>

            <Text size={"md"} weight={700}>
              {"|"}
            </Text>

            <Text size={"md"} weight={700}>
              {t("businessProcess.label.parameters")}
            </Text>
          </Group>
        ) : (
          <Skeleton visible={true} h={"100%"}></Skeleton>
        )}
      </Stack>
    </Paper>
  );
};

export default ProjectHeader;
