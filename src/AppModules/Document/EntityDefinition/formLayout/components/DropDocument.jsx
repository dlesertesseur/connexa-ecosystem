import { Droppable } from "react-beautiful-dnd";
import { Stack } from "@mantine/core";
import { useWindowSize } from "../../../hook";
import { buildComponent } from "../Util";

// eslint-disable-next-line react/prop-types
const DropDocument = ({ id, data = [] }) => {
  const wsize = useWindowSize();
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <Stack
          spacing={"xs"}
          p={"xs"}
          bg={"violet"}
          h={wsize.height - 20}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {data.map((item, index) => {
            return buildComponent(item, index);
          })}
          {provided.placeholder}
        </Stack>
      )}
    </Droppable>
  );
};

export default DropDocument;
