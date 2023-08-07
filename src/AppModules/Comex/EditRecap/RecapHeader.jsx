import React from "react";
import { Badge, Button, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RecapHeader = ({ recap, h = 120 }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

            <Group spacing={"xs"} position="apart">
              <Group spacing={"xs"} mt={"sm"}>
                <Text size={"sm"} weight={700}>
                  {recap.supplier.name}
                </Text>
                <Badge color="green" variant="dot">
                  {recap.country.country}
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
        </Paper>
      ) : (
        <Skeleton visible={true}></Skeleton>
      )}
    </Stack>
  );
};

export default RecapHeader;
