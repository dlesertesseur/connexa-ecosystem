import { Button, Group, Paper } from "@mantine/core";
import { Draggable } from "react-beautiful-dnd";

// eslint-disable-next-line react/prop-types
const DragButton = ({ id, index, field }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Paper
          w={"100%"}
          bg={"gray.2"}
          p={"xs"}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Group  position="right">
            <Button>{field.name}</Button>
          </Group>
        </Paper>
      )}
    </Draggable>
  );
};

export default DragButton;
