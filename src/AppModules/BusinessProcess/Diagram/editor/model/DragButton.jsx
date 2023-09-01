import { Button, Text } from "@mantine/core";
import React from "react";

const DragButton = ({text, onDragStart}) => {
  return (
    <Button size="xs" variant="default" onDragStart={onDragStart} draggable>
      <Text>{text}</Text>
    </Button>
  );
};

export default DragButton;
