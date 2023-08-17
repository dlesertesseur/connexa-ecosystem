import React from "react";
import { Box } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Sprint from "./models/Sprint";

const Designer = () => {
  const { height } = useViewportSize();

  const onDragEnd = (evt) => {
    console.log(evt);
  };

  const content = () => {
    const ret = <Sprint id={"100"} />;
    return ret;
  };

  return (
    <Box w={"100%"} h={height - 254} style={{ background: "#e5e5e5", borderRadius: 4 }}>
      {/* <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => {
            <div ref={droppableProvided.innerRef} style={getListStyle(droppableSnapshot.isDraggingOver)}>

            </div>;
          }}
          {droppableProvided.placeholder}
        </Droppable>
      </DragDropContext> */}
    </Box>
  );
};

export default Designer;
