import { Group, Paper, Stack, Text } from "@mantine/core";
import { Draggable } from "react-beautiful-dnd";
import { WIDGETS_NAMES_BY_ID } from "../../../../Constants/BUSINESS";

// eslint-disable-next-line react/prop-types
const DragToolbarComponent = ({ id, index, field }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Paper withBorder p={"xs"} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Group position="apart">
            <Stack spacing={0}>
              <Text size={"sm"} weight={500}>
                {field.description}
              </Text>
              <Text size={"xs"} weight={400} color="gray">
                {WIDGETS_NAMES_BY_ID.get(field.widget).name}
              </Text>
            </Stack>
          </Group>
        </Paper>
      )}
    </Draggable>
  );
};

export default DragToolbarComponent;
