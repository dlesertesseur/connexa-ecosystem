import { Checkbox, Paper } from "@mantine/core";
import { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { EntityLayoutContext } from "../../Context";

// eslint-disable-next-line react/prop-types
const ItemCheckbox = ({ field }) => {
  const { selectedField, setSelectedField, setSelectedPanel } = useContext(EntityLayoutContext);
  return (
    <Paper
      w={"100%"}
      p={"xs"}
      withBorder
      spacing={3}
      bg={selectedField?.id === field.id ? "blue.3" : "gray.2"}
      onMouseDown={(e) => {
        setSelectedField(field);
        setSelectedPanel(null);
        e.stopPropagation();
      }}
    >
      <Checkbox disabled label={field.description} placeholder={field.name} />
    </Paper>
  );
};

export default ItemCheckbox;