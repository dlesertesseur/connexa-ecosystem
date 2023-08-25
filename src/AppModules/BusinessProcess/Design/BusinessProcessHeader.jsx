import React from "react";
import { Group, Paper, Skeleton, Stack, Text } from "@mantine/core";

const BusinessProcessHeader = ({ businessProcess, text }) => {
  return (
    <Paper withBorder p={6}>
      <Stack spacing={"xs"} h={32} justify="center">
        {businessProcess ? (
          <Group position="left" >
            <Text size={"md"} weight={700}>
              {businessProcess?.name}
            </Text>

            <Text size={"md"} weight={700}>
              {"|"}
            </Text>

            <Text size={"md"} weight={700}>
              {text}
            </Text>
          </Group>
        ) : (
          <Skeleton visible={true} h={"100%"}></Skeleton>
        )}
      </Stack>
    </Paper>
  );
};

export default BusinessProcessHeader;
