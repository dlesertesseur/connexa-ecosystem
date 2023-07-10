import React from "react";
import { Group } from "@mantine/core";
import { useContext } from "react";
import { FloorView3dContext } from "./Context";
import { TOOLBAR_HIGHT } from "../../../../Constants";
import { useTranslation } from "react-i18next";
import OptionsMenu from "./menu/OptionsMenu";
import OptionsLayers from "./menu/OptionsLayers";
import OptionLayerItem from "./menu/OptionLayerItem";

const Toolbar = ({ children }) => {
  const {t} = useTranslation()
  const { racks, wmsApiToken, drawFrames, setDrawFrames } = useContext(FloorView3dContext);

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
          <OptionsLayers disabled={racks && wmsApiToken ? false : true}>
            <OptionLayerItem name= {t("view.floorViewer.layer.frames")} checked={drawFrames} onCheck={setDrawFrames} />
          </OptionsLayers>
        </Group>
      </Group>
      <Group>{children}</Group>
    </Group>
  );
};

export default Toolbar;
