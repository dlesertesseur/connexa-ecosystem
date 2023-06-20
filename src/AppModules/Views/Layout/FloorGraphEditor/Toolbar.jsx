import React from "react";
import { Group, Switch } from "@mantine/core";
import { TOOLBAR_HIGHT } from "../../../../Constants";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AbmStateContext } from "./Context";

const Toolbar = ({ children }) => {
  // const { t } = useTranslation();
  // const {} = useContext(AbmStateContext)
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
      {/* <Group>
        <OptionsMenu disabled={racks ? false : true}/>
      </Group> */}

      <Group>{children}</Group>
    </Group>
  );
};

export default Toolbar;
