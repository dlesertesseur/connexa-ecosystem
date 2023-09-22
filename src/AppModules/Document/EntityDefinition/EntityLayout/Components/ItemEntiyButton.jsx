import { Group, Paper, Text } from "@mantine/core";
import { useContext } from "react";
import { EntityLayoutContext } from "../../Context";
import { IconForms, IconList, IconListDetails, IconPlaylistAdd, IconPlus } from "@tabler/icons-react";

// eslint-disable-next-line react/prop-types
const ItemEntiyButton = ({ relatedEntity }) => {
  const { selectedRelatedEntity, setSelectedRelatedEntity, setSelectedPanel, setSelectedField } =
    useContext(EntityLayoutContext);

  return (
    <Paper
      py={8}
      px={"xs"}
      bg={selectedRelatedEntity?.entity?.id === relatedEntity?.entity?.id ? "blue" : "gray.4"}
      onMouseDown={(e) => {
        setSelectedRelatedEntity(relatedEntity);
        setSelectedPanel(null);
        setSelectedField(null);
        e.stopPropagation();
      }}
    >
      <Group p={0}>
        <Text
          color={selectedRelatedEntity?.entity?.id === relatedEntity?.entity?.id ? "white" : "gray.5"}
          size={"sm"}
          weight={500}
        >
          {relatedEntity?.entity?.name}
        </Text>
        {relatedEntity.asCollection ? (
          <IconPlaylistAdd
            size={20}
            color={selectedRelatedEntity?.entity?.id === relatedEntity?.entity?.id ? "white" : "gray"}
          />
        ) : null}
      </Group>
    </Paper>
  );
};

export default ItemEntiyButton;
