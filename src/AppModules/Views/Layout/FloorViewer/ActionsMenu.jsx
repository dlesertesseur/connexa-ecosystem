import React from "react";
import { Menu, Button } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const ActionsMenu = () => {
  const { t } = useTranslation();
  return (
    <Menu shadow="md" width={200} withArrow position="bottom-start">
      <Menu.Target>
        <Button size="xs">{t("button.menu")}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t("button.menu")}</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />}>{t("button.search")}</Menu.Item>
        <Menu.Item icon={<IconSearch size={14} />}>{t("button.search")}</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionsMenu;
