import React from "react";
import { Badge, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";

const RecapHeader = ({ recap, h=120 }) => {
  return (
    <Stack spacing={"xs"} h={h}>
      {recap ? (
        <Paper withBorder p={"xs"} h={"100%"}>
          <Stack spacing={"xs"} h={"100%"} align="stretch">
            <Group position="apart" spacing={"xs"}>
              <Text size={"lg"} weight={700}>
                {recap.campaign.event}
              </Text>
              <Text size={"xs"}>{recap.creationDate}</Text>
            </Group>
            <Group spacing={"xs"}>
              <Text size={"xs"} weight={300}>
                {recap.description}
              </Text>
            </Group>
            <Group spacing={"xs"} mt={"sm"}>
              <Text size={"sm"} weight={700}>
                {recap.supplier.name}
              </Text>
              <Badge color="green" variant="dot">
                {recap.country.country}
              </Badge>
            </Group>
          </Stack>
        </Paper>
      ) : (
        <Skeleton visible={true}></Skeleton>
      )}
    </Stack>
  );
};

export default RecapHeader;
