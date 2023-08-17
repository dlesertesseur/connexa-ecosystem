import React from "react";
import { ActionIcon, Button, Group, Stack, Text } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const DesignToolbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onBack = () => {
    navigate("../");
  };

  return (
    <Stack spacing={"xs"}>
      <Group position="apart">
        <Group>
          <ActionIcon color="blue" variant="filled">
            <IconDeviceFloppy size="20" />
          </ActionIcon>
        </Group>
        <Group>
          <Button size="xs" onClick={onBack}>
            <Text>{t("button.back")}</Text>
          </Button>
        </Group>
      </Group>
    </Stack>
  );
};

export default DesignToolbar;
