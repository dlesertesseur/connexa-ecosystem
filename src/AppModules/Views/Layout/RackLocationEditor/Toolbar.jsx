import React from "react";
import LockAction from "../../../../Components/LockAction";
import { IconRefresh, IconDeviceFloppy } from "@tabler/icons";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { TOOLBAR_HIGHT } from "../../../../Constants";
import { useTranslation } from "react-i18next";

const Toolbar = ({ onOption = null, lockMove, setLockMove, children, disabled }) => {
  const { t } = useTranslation();

  const handleOption = (option) => {
    if (onOption) {
      onOption(option);
    }
  };
  return (
    <Group
      spacing={"xs"}
      position="apart"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1],
        height: TOOLBAR_HIGHT + "px",
      })}
    >
      <Group px={"xs"} spacing={"xs"}>
        <Tooltip label={t("button.save")} position="bottom" withArrow>
          <ActionIcon variant="filled" color={"blue"} disabled={disabled}>
            <IconDeviceFloppy
              size={20}
              onClick={(event) => {
                handleOption("save");
              }}
            />
          </ActionIcon>
        </Tooltip>

        <Tooltip label={t("button.refresh")} position="bottom" withArrow>
          <ActionIcon variant="filled" color={"blue"} disabled={disabled}>
            <IconRefresh
              size={20}
              onClick={(event) => {
                handleOption("refresh");
              }}
            />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Group px={"xs"} spacing={"xs"}>
        <LockAction checked={lockMove} setChecked={setLockMove} toolTip={t("tooltip.lockMove")} disabled={disabled}/>
        {children}
      </Group>
    </Group>
  );
};

export default Toolbar;
