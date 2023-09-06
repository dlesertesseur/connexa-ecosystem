import React from "react";
import { Divider, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { findTranslatedField } from "../Util";

const AppHeader = ({ app }) => {
  const { i18n } = useTranslation();
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    setName(findTranslatedField(i18n.language, app, "name"));
    setDescription(findTranslatedField(i18n.language, app, "description"));
  }, [app]);

  return (
    <Stack
      justify="stretch"
      spacing={"xs"}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        height: "60px",
        width: "100%",
      })}
    >
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
      <Divider />
    </Stack>
  );
};

export default AppHeader;
