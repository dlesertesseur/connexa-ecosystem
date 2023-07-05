import React from "react";
import { Divider, Stack, Text } from "@mantine/core";
import { findTranslatedField } from "../../../../Util";
import { useTranslation } from "react-i18next";

const EditorHeader = ({app}) => {

  const { i18n } = useTranslation();
  return (
    <>
      <Stack
        spacing={0}
        align={"flex-start"}
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          height: "48px",
        })}
      >
        <Text size="xl" weight={700}>
          {findTranslatedField(i18n.language, app, "name")}
        </Text>
        <Text size="xs" color="dimmed">
          {findTranslatedField(i18n.language, app, "description")}
        </Text>
      </Stack>
      <Divider />
    </>
  );
};

export default EditorHeader;
