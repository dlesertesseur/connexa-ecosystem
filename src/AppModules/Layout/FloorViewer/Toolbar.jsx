import React from "react";
import { Group } from "@mantine/core";
import { TOOLBAR_HIGHT } from "../../../Constants";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { FloorViewerStateContext } from "./Context";
import OptionsMenu from "./menu/OptionsMenu";
import FindPathMenu from "./menu/FindPathMenu";

const Toolbar = ({ children, onFind }) => {
  const { t } = useTranslation();
  const { racks, wmsApiToken } = useContext(FloorViewerStateContext);

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
      <Group position="left">
        <Group>
          <OptionsMenu disabled={racks && wmsApiToken ? false : true} />
        </Group>
        <Group>
          <FindPathMenu disabled={racks ? false : true} onFind={onFind}/>
        </Group>
      </Group>
      <Group>{children}</Group>
    </Group>
  );
};

export default Toolbar;
