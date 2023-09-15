import { Paper, Select } from "@mantine/core";
import { Draggable } from "react-beautiful-dnd";

// eslint-disable-next-line react/prop-types
const DragSelect = ({ id, index, field }) => {
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
          <Select disabled label={field?.label ? field?.label : field?.name} data={[]} />
        </Paper>
      )}
    </Draggable>
  );
};

export default DragSelect;
