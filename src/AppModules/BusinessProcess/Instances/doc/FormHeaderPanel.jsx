import React from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FormHeaderPanel = ({ name, description, root = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ret = name ? (
    <Group position="apart" spacing={"xs"}>
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

      {!root ? (
        <Group>
          <Button
            onClick={() => {
              navigate(-1);
            }}
          >
            <Text>{t("button.back")}</Text>
          </Button>
        </Group>
      ) : null}
    </Group>
  ) : null;

  return ret;
};

export default FormHeaderPanel;
