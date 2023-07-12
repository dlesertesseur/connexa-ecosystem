import React from "react";
import { Group } from "@mantine/core";
import { TOOLBAR_HIGHT } from "../../../Constants";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { FloorViewerStateContext } from "./Context";
import StructureDetail from "../../../Components/StructureDetail";

const Toolbar = ({ children }) => {
  const { t } = useTranslation();
  const {structureDetail, setStructureDetail, racks} = useContext(FloorViewerStateContext)

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
        <StructureDetail
          checked={structureDetail}
          setChecked={(evt) => {
            setStructureDetail(evt);
          }}
          toolTip={t("tooltip.moduleSelection")}
          disabled={racks ? false : true}
        />
      </Group>
      <Group>{children}</Group>
    </Group>
  );
};

export default Toolbar;
