import React, { useContext } from "react";
import { Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { DesignerStateContext } from "../Context";

const DesignHeader = () => {
  const { t } = useTranslation();
  const { project } = useContext(DesignerStateContext);

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
              {t("businessProcess.label.definition")}
            </Text>
          </Group>
        ) : (
          <Skeleton visible={true} h={"100%"}></Skeleton>
        )}
      </Stack>
    </Paper>
  );
};

export default DesignHeader;
