import { NumberInput, Paper } from "@mantine/core";
import { useContext } from "react";
import { EntityLayoutContext } from "../../Context";

// eslint-disable-next-line react/prop-types
const ItemNumberinput = ({ field }) => {
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
      <NumberInput disabled label={field.description} placeholder={0} />
    </Paper>
  );
};

export default ItemNumberinput;
