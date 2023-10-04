import { Button, Paper } from "@mantine/core";
import { useContext } from "react";
import { EntityLayoutContext } from "../../Context";
import { IconUpload } from "@tabler/icons-react";

// eslint-disable-next-line react/prop-types
const ItemFileButton = ({ field }) => {
  const { selectedField, setSelectedField, setSelectedPanel, setSelectedRelatedEntity } =
    useContext(EntityLayoutContext);
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
      <Button disabled leftIcon={<IconUpload size={16}/>}>{field.label}</Button>
    </Paper>
  );
};

export default ItemFileButton;
