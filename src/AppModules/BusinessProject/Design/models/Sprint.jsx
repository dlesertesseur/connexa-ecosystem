import { Paper } from "@mantine/core";
import React from "react";
import { Draggable } from "react-beautiful-dnd";

const Sprint = ({id}) => {
  return (
    <Draggable key={id} draggableId={id} index={id}>
      <Paper withBorder h={60} w={150}></Paper>
    </Draggable>
  );
};

export default Sprint;
