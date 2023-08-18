import React, { useState } from "react";
import Stage from "./models/Stage";
import Action from "./models/Action";
import { Box, Group } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { DndContext } from "@dnd-kit/core";

const Designer = () => {
  const actions = [
    { id: 1, name: "Action 01", stageId: null },
    { id: 2, name: "Action 02", stageId: null },
    { id: 3, name: "Action 03", stageId: null },
  ];

  const stages = [
    { id: 1, name: "Stage 01", actions: [] },
    { id: 2, name: "Stage 02", actions: [] },
    { id: 3, name: "Stage 03", actions: [] },
  ];

  const [actionsList, setActionsList] = useState(actions);
  const [stagesList, setStagesList] = useState(stages);

  const { height } = useViewportSize();

  const handleDragEnd = (evn) => {
    const active = evn.active;
    const over = evn.over;

    const action = actionsList.find((a) => a.id === active.id);

    const stage = stagesList.find((s) => s.id === over.id);
    if (stage && action) {
      action.stageId = stage.id;
      stage.actions.push(action);
    }

    setActionsList([...actionsList]);
  };

  const content = () => {
    const ret = <Stage id={"100"} />;
    return ret;
  };

  return (
    <Box w={"100%"} h={height - 254} style={{ background: "#e5e5e5", borderRadius: 4 }}>
      <DndContext onDragEnd={handleDragEnd}>
        <Group position="apart">
          {stagesList.map((s) => (
            <Stage key={s.id} name={s.name} id={s.id} actions={s.actions} />
          ))}
        </Group>

        {actionsList.map((a) => {
          const ret = a.stageId ? null : <Action key={a.id} name={a.name} id={a.id} />;
          return(ret);
        })}
      </DndContext>
    </Box>
  );
};

export default Designer;
