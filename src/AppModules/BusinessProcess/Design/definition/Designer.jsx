import React from "react";
import Stage from "./models/Stage";
import { Flex, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useContext } from "react";
import { DesignerStateContext } from "../Context";
import { useEffect } from "react";
import { useState } from "react";
import uuid from "react-uuid";

const Designer = () => {
  const { height } = useViewportSize();
  const { businessProcess, saving } = useContext(DesignerStateContext);

  const [stagesList, setStagesList] = useState(null);

  useEffect(() => {
    if (businessProcess) {
      let stages = businessProcess.stages;
      if (stages) {
        if (stages.length === 0) {
          stages.push({
            id: uuid(),
            name: "Stage 01",
            actions: [],
            place: 0,
          });
        }
        stages.sort((a, b) => a.place - b.place);
        setStagesList(stages);
      }
    }
  }, [businessProcess]);

  const drawStages = () => {
    const ret = stagesList?.map((s) => {
      return <Stage key={s.id} name={s.name} id={s.id}></Stage>;
    });

    return ret;
  };

  return (
    <ScrollArea offsetScrollbars w={"100%"} h={height - 264} style={{ borderRadius: 4 }}>
      <LoadingOverlay visible={saving} />
      <Flex direction={"row"} gap="xs">
        {drawStages()}
      </Flex>
    </ScrollArea>
  );
};

export default Designer;
