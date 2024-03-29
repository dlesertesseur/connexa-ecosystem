import { Paper, Text } from "@mantine/core";
import { useContext } from "react";
import { EntityLayoutContext } from "../../Context";

// eslint-disable-next-line react/prop-types
const ItemLabel = ({ field }) => {
  const { selectedField, setSelectedField, setSelectedPanel, setSelectedRelatedEntity } = useContext(EntityLayoutContext);
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
        setSelectedRelatedEntity(null);
        e.stopPropagation();
      }}
    >
      <Text size={"md"} weight={600}>
        {field.label}
      </Text>
    </Paper>
  );
};

export default ItemLabel;
