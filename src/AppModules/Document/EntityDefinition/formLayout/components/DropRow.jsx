import { Button, Group, Popover, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";

// eslint-disable-next-line react/prop-types
const DropRow = ({ id, data = [], setSelected, selected, onEnter, onExit }) => {
  const [open, setOpen] = useState(false);
  return (
    <Droppable droppableId={id} direction="horizontal">
      {(provided) => (
        <Group
          onClick={() => {
            setSelected(id);
          }}
          sx={{ border: `2px dashed ${selected ? "red" : "blue"}`, borderRadius: 6 }}
          noWrap
          mb={"xs"}
          p={0}
          spacing={3}
          align="flex-start"
          bg={"gray.1"}
          mih={60}
          {...provided.droppableProps}
          ref={provided.innerRef}
          onMouseEnter={(e) => {
            onEnter(e)
          }}
          onMouseLeave={(e) => {
            onExit(e)
          }}
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

export default DropRow;
