import React from "react";
import { Group } from "@mantine/core";
import { FilterControl } from "./FilterControl";
import { useContext } from "react";
import { FloorView3dContext } from "./Context";
import { TOOLBAR_HIGHT } from "../../../../Constants";
import OptionsMenu from "./menu/OptionsMenu";

const Toolbar = () => {
  const { racks, wmsApiToken } = useContext(FloorView3dContext);
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
      </Group>
      <Group>
        <FilterControl />
      </Group>
    </Group>
  );
};

export default Toolbar;
