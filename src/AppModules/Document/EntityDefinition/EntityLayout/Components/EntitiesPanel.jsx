import { ActionIcon, Group, Paper } from "@mantine/core";
import { IconCirclePlus, IconEditCircle } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import ItemEntiyButton from "./ItemEntiyButton";

// eslint-disable-next-line react/prop-types
const EntitiesPanel = ({
  id,
  data,
  selectedPanel,
  setSelectedPanel,
  setSelectedField,
  selectedRelatedEntity,
  setSelectedRelatedEntity,
  addRelatedEntity,
  editRelatedEntity,
  deleteRelatedEntity,
}) => {

  return (
    <Paper
      
      mih={48}
      mb={"xs"}
      bg={selectedPanel === id ? "blue.1" : "white"}
      onMouseDown={(e) => {
        setSelectedPanel(id);
        setSelectedField(null);
        setSelectedRelatedEntity(null);
        e.stopPropagation();
      }}
    >
      <Group p={3} spacing={3} align="center">
        <ActionIcon color="blue" disabled={!(selectedPanel === id)} variant="transparent">
          <IconCirclePlus onMouseDown={addRelatedEntity} />
        </ActionIcon>
        <ActionIcon
          color="blue"
          disabled={!data?.some((item) => item.options === selectedRelatedEntity?.options)}
          variant="transparent"
        >
          <IconEditCircle
            onMouseDown={(e) => {
              e.stopPropagation();
              editRelatedEntity(e);
            }}
          />
        </ActionIcon>
        <ActionIcon
          color="blue"
          variant="transparent"
          disabled={!data?.some((item) => item.options === selectedRelatedEntity?.options)}
        >
          <IconTrash
            onMouseDown={(e) => {
              e.stopPropagation();
              deleteRelatedEntity();
            }}
          />
        </ActionIcon>
      </Group>

      <Group w={"100%"} noWrap position="left" p={3} spacing={"xs"} align="flex-start">
        {data?.map((e) => {
          return <ItemEntiyButton key={e.options} relatedEntity={e} />;
        })}
      </Group>
    </Paper>
  );
};
export default EntitiesPanel;
