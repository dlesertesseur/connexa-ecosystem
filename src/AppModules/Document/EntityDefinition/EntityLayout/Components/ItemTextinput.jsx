import { Paper, TextInput } from "@mantine/core";
import { EntityLayoutContext } from "../../Context";
import { useContext } from "react";

// eslint-disable-next-line react/prop-types
const ItemTextinput = ({ field }) => {
  const { selectedField, setSelectedField, setSelectedPanel } = useContext(EntityLayoutContext);
  return (
    <Paper
      w={"100%"}
      p={"xs"}
      withBorder
      spacing={3}
      bg={selectedField?.id === field.id? "blue.3" : "gray.2"}
      onMouseDown={(e) => {
        setSelectedField(field);
        setSelectedPanel(null);
        e.stopPropagation();
      }}
    >
      <TextInput disabled label={field.description} placeholder={field.name} />
    </Paper>
  );
};

export default ItemTextinput;
