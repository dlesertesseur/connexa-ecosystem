import { Group, Paper, Text } from "@mantine/core";
import { useContext } from "react";
import { EntityLayoutContext } from "../../Context";
import {IconPlaylistAdd } from "@tabler/icons-react";

// eslint-disable-next-line react/prop-types
const ItemEntiyButton = ({ relatedEntity }) => {
  const { selectedRelatedEntity, setSelectedRelatedEntity, setSelectedPanel, setSelectedField } =
    useContext(EntityLayoutContext);

  return (
    <Paper
      py={8}
      px={"xs"}
      bg={selectedRelatedEntity?.formId === relatedEntity?.formId ? "blue" : "gray.4"}
      onMouseDown={(e) => {
        setSelectedRelatedEntity(relatedEntity);
        setSelectedPanel(null);
        setSelectedField(null);
        e.stopPropagation();
      }}
    >
      <Group p={0}>
        <Text
          color={selectedRelatedEntity?.formId === relatedEntity?.formId ? "white" : "gray.5"}
          size={"sm"}
          weight={600}
        >
          {relatedEntity?.name}
        </Text>
        {relatedEntity.collection ? (
          <IconPlaylistAdd
            size={20}
            color={selectedRelatedEntity?.formId === relatedEntity?.formId ? "white" : "gray"}
          />
        ) : null}
      </Group>
    </Paper>
  );
};

export default ItemEntiyButton;
