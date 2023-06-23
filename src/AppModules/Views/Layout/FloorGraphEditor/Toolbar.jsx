import React from "react";
import { Button, Group, Text } from "@mantine/core";
import { TOOLBAR_HIGHT } from "../../../../Constants";
import { useTranslation } from "react-i18next";

const Toolbar = ({ disabled, onLinkStructures, children }) => {
  const { t } = useTranslation();
  return (
    <Group
      px={"xs"}
      spacing={"xs"}
      position="apart"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1],
        height: TOOLBAR_HIGHT + "px",
      })}
    >
      <Group>
        <Button size="xs" onClick={onLinkStructures} disabled={disabled}>
          <Text>{t("crud.floorGrapthEditor.label.linkStructures")}</Text>
        </Button>
      </Group>
      <Group>{children}</Group>
    </Group>
  );
};

export default Toolbar;
