import { Group, Paper } from "@mantine/core";
import { Droppable } from "react-beautiful-dnd";
import { buildComponent } from "../Util";

// eslint-disable-next-line react/prop-types
const DropPanel = ({ id, data = [], setSelected, selected }) => {
  return (
    <Droppable droppableId={id} direction="horizontal">
      {(provided) => (
        <Group
          onClick={() => {
            setSelected(id);
          }}
          sx={{ border: `2px dashed ${selected ? "red" : "blue"}` }}
          noWrap
          mb={"xs"}
          p={0}
          spacing={3}
          align="flex-start"
          bg={"gray.1"}
          mih={40}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {data.map((item, index) => {
            return buildComponent(item, index);
          })}
          {provided.placeholder}
        </Group>
      )}
    </Droppable>
  );
};

export default DropPanel;
