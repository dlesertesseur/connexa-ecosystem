import { Paper, Text } from "@mantine/core";
import { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { EntityLayoutContext } from "../../Context";

// eslint-disable-next-line react/prop-types
const ItemLabel = ({ field }) => {
  const { selectedField, setSelectedField, setSelectedPanel } = useContext(EntityLayoutContext);
  return (
    <Paper
      w={"100%"}
      p={"xs"}
      withBorder
      spacing={3}
      bg={selectedField?.id === field.id ? "blue.2" : "gray.2"}
      onMouseDown={(e) => {
        setSelectedField(field);
        setSelectedPanel(null);
        e.stopPropagation();
      }}
    >
      <Text size={"md"} weight={600}>
        {field.description}
      </Text>
    </Paper>
  );
};

export default ItemLabel;
