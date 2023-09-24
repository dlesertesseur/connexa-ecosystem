import { ActionIcon, Group, Paper } from "@mantine/core";
import { IconCirclePlus, IconEditCircle } from "@tabler/icons-react";
import { Draggable } from "react-beautiful-dnd";
import { useContext } from "react";
import { EntityLayoutContext } from "../../Context";
import { IconTrash } from "@tabler/icons-react";
import ItemTextinput from "./ItemTextinput";
import ItemTexarea from "./ItemTexarea";
import ItemNumberinput from "./ItemNumberinput";
import ItemSelect from "./ItemSelect";
import ItemCheckbox from "./ItemCheckbox";
import ItemEntityList from "./ItemEntityList";

// eslint-disable-next-line react/prop-types
const DropRow = ({ id, index, data }) => {
  const {
    selectedField,
    setSelectedField,
    setSelectedRelatedEntity,
    selectedPanel,
    setSelectedPanel,
    addField,
    editField,
    deletePanel,
    deleteField,
  } = useContext(EntityLayoutContext);

  const buildComponent = (field, index) => {
    let ret = null;

    switch (field.type) {
      case "TEXTINPUT":
        ret = <ItemTextinput key={field.id} field={field} />;
        break;
      case "TEXTAREA":
        ret = <ItemTexarea key={field.id} field={field} />;
        break;
      case "NUMBERINPUT":
        ret = <ItemNumberinput key={field.id} field={field} />;
        break;
      case "SELECT":
        ret = <ItemSelect key={field.id} field={field} />;
        break;
      case "CHECKBOX":
        ret = <ItemCheckbox key={field.id} field={field} />;
        break;
      case "IMAGE":
        break;
      case "UPLOAD":
        break;
      default:
        break;
    }
    return ret;
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          withBorder
          mih={64}
          mb={"xs"}
          bg={selectedPanel === id ? "blue.3" : "gray.3"}
          // sx={{ border: `2px solid ${selectedPanel === id ? "red" : "blue"}`, borderRadius: 5 }}
          onMouseDown={(e) => {
            setSelectedPanel(id);
            setSelectedField(null);
            setSelectedRelatedEntity(null);
            e.stopPropagation();
          }}
        >
          <Group p={3} spacing={3} align="center">
            <ActionIcon color="blue" disabled={!(selectedPanel === id)} variant="transparent">
              <IconCirclePlus onMouseDown={addField} />
            </ActionIcon>
            <ActionIcon
              color="blue"
              disabled={!data?.some((item) => item.id === selectedField?.id)}
              variant="transparent"
            >
              <IconEditCircle
                onMouseDown={(e) => {
                  e.stopPropagation();
                  editField(e);
                }}
              />
            </ActionIcon>
            <ActionIcon
              color="blue"
              variant="transparent"
              disabled={!(data?.some((item) => item.id === selectedField?.id) || selectedPanel === id)}
            >
              <IconTrash
                onMouseDown={(e) => {
                  e.stopPropagation();
                  selectedField ? deleteField() : deletePanel();
                }}
              />
            </ActionIcon>
          </Group>

          <Group w={"100%"} noWrap position="left" p={3} spacing={3} align="flex-start">
            {data?.map((f, index) => {
              return buildComponent(f, index);
            })}
          </Group>
        </Paper>
      )}
    </Draggable>
  );
};

export default DropRow;
