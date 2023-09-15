import { Droppable } from "react-beautiful-dnd";
import { Paper, ScrollArea, Stack } from "@mantine/core";
import { useWindowSize } from "../../../../Hook";
import DragToolbarComponent from "./DragToolbarComponent";

// eslint-disable-next-line react/prop-types
const DragToolbar = ({ id, data = [], h }) => {
  const wsize = useWindowSize();

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <Paper withBorder h={"100%"} bg={"gray.2"}>
          <ScrollArea h={h}>
            <Stack
              mih={h}
              p={"xs"}
              spacing={"xs"}
              h={"100%"}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data.map((item, index) => (
                <DragToolbarComponent key={item.id} id={item.id} index={index} field={item} />
              ))}
              {provided.placeholder}
            </Stack>
          </ScrollArea>
        </Paper>
      )}
    </Droppable>
  );
};

export default DragToolbar;
