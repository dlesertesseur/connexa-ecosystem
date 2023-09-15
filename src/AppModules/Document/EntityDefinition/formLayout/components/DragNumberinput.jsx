import { Paper, TextInput } from "@mantine/core";
import { Draggable } from "react-beautiful-dnd";

// eslint-disable-next-line react/prop-types
const DragNumberinput = ({ id, index, field }) => {
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
          <TextInput label={field.description} placeholder={field.name} />
        </Paper>
      )}
    </Draggable>
  );
};

export default DragNumberinput;
