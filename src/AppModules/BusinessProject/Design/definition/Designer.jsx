import React from "react";
import Stage from "../models/Stage";
import { Flex, ScrollArea } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { DesignerStateContext } from "../Context";

const Designer = () => {
  const { t } = useTranslation();
  const { height } = useViewportSize();
  const { project } = useContext(DesignerStateContext);

  const stagesList = project?.stages ? project?.stages : [];

  const drawStages = () => {
    const ret = stagesList.map((s) => {
      return <Stage key={s.id} name={s.name} id={s.id}></Stage>;
    });

    return ret;
  };

  return (
    <ScrollArea offsetScrollbars w={"100%"} h={height - 254} style={{ borderRadius: 4 }}>
      <Flex direction={"row"} gap="xs">
        {drawStages()}
      </Flex>
    </ScrollArea>
  );
};

export default Designer;
