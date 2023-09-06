import React from "react";
import { Badge, Group, Tabs } from "@mantine/core";
import { useTranslation } from "react-i18next";

const TabLabel = ({ name, label, rows = 0, pending = 0 }) => {
  const { t } = useTranslation();

  return (
    <Tabs.Tab
      rightSection={
        <Group spacing={3}>
          {rows ? (
            <Badge miw={16} h={16} sx={{ pointerEvents: "none" }} variant="filled" color="green" size="xs" p={0}>
              {rows}
            </Badge>
          ) : null}
          {pending ? (
            <Badge miw={16} h={16} sx={{ pointerEvents: "none" }} variant="filled" color="red" size="xs" p={0}>
              {pending}
            </Badge>
          ) : null}
        </Group>
      }
      value={name}
    >
      {label}
    </Tabs.Tab>
  );
};

export default TabLabel;
