import { Paper } from "@mantine/core";
import { EntityLayoutContext } from "../../Context";
import { useContext } from "react";
import { TimeInput } from "@mantine/dates";

// eslint-disable-next-line react/prop-types
const ItemTime = ({ field }) => {
  const { selectedField, setSelectedField, setSelectedPanel, setSelectedRelatedEntity } = useContext(EntityLayoutContext);
  return (
    <Paper
      w={"100%"}
      p={"xs"}
      withBorder
      spacing={3}
      bg={selectedField?.id === field.id? "blue.2" : "gray.2"}
      onMouseDown={(e) => {
        setSelectedField(field);
        setSelectedRelatedEntity(null);
        setSelectedPanel(null);
        e.stopPropagation();
      }}
    >
      <TimeInput disabled label={field.label} placeholder={field.name} />
    </Paper>
  );
};

export default ItemTime;
