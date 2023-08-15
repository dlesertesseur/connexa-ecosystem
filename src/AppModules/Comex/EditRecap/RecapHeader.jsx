import React from "react";
import { Group, Paper, Skeleton, Stack, Text } from "@mantine/core";

const RecapHeader = ({ recap, h }) => {
  return (
    <Paper withBorder p={6} >
      <Group position="apart" w={"100%"} h={h}>
        {recap ? (
          <Group align="flex-start">
            <Stack spacing={0} h={"100%"} align="stretch" justify="flex-start">
              <Group>
                <Text size={"lg"} weight={700}>
                  {recap.campaign.name}
                </Text>
                <Text size={"lg"} weight={600} color="dark">
                  {recap.description}
                </Text>
              </Group>
              <Group spacing={"xs"}>
                <Text size={"xs"} weight={700}>
                  {recap.supplier.name}
                </Text>
                <Text size={"xs"} weight={700} color="dark">
                  {recap.originCountry.name}
                </Text>
              </Group>
            </Stack>
          </Group>
        ) : (
          <Skeleton visible={true} h={h}></Skeleton>
        )}
      </Group>
    </Paper>
  );
};

export default RecapHeader;
