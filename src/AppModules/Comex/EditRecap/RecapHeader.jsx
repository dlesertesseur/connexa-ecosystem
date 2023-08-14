import React from "react";
import { Badge, Button, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RecapHeader = ({ recap, h = 120 }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Stack spacing={"xs"} h={h}>
      <Paper withBorder p={6} h={"100%"}>
        {recap ? (
          <Stack spacing={"xs"} h={"100%"} align="stretch" justify="space-between">
            <Group position="apart" spacing={"xs"}>
              <Text size={"lg"} weight={700}>
                {recap.campaign.name}
              </Text>
              {/* <Text size={"xs"}>{recap.creationDate}</Text> */}
            </Group>
            <Group spacing={"xs"}>
              <Text size={"xs"} weight={400}>
                {recap.description}
              </Text>
            </Group>
            <Group spacing={"xs"} position="apart">
              <Group spacing={"xs"} mt={"sm"}>
                <Text size={"sm"} weight={700}>
                  {recap.supplier.name}
                </Text>
                <Badge color="green" variant="dot">
                  {recap.originCountry.name}
                </Badge>
              </Group>

              <Group spacing={"xs"} position="right">
                <Button
                  onClick={() => {
                    navigate("../");
                  }}
                >
                  <Text>{t("button.back")}</Text>
                </Button>
              </Group>
            </Group>
          </Stack>
        ) : (
          <Skeleton visible={true}></Skeleton>
        )}
      </Paper>
    </Stack>
  );
};

export default RecapHeader;
