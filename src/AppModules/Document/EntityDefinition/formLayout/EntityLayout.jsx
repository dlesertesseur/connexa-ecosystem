import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Button, Container, Group, Paper, Popover, ScrollArea, SegmentedControl, Stack, Text } from "@mantine/core";
import { useWindowSize } from "../../../../Hook";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { findEntityDefinitionById } from "../../../../DataAccess/EntityDefinition";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config } from "../../../../Constants/config";
import { IconDeviceFloppy, IconRowInsertBottom, IconTrash } from "@tabler/icons-react";
import uuid from "react-uuid";
import EntityDefinitionHeader from "../EntityDefinitionHeader";
import DropRow from "./components/DropRow";
import { useDisclosure } from "@mantine/hooks";

const EntityLayout = ({ back }) => {
  const wsize = useWindowSize();
  const [panels, setPanels] = useState([]);
  const [fieldsToDrag, setFieldsToDrag] = useState([]);
  const [entityDefinition, setEntityDefinition] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [widgetByPanel, setWidgetByPanel] = useState(new Map());

  const [breakpoints] = useState(
    config.breakpoints.map((b) => {
      return { label: b.toUpperCase(), value: b };
    })
  );
  const [containerSize, setContainerSize] = useState("md");

  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId, reloadFields } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findEntityDefinitionById(params);
    setEntityDefinition(ret);
    setFieldsToDrag([...ret?.fields]);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId, reloadFields]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const save = (e) => {
    panels.forEach((p, index) => {
      const components = widgetByPanel.get(p.id);
      console.log(
        `panel ${index} components ->`,
        components.map((c) => c.description)
      );
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId !== result.destination.droppableId) {
      if (result.source.droppableId.startsWith("panel-") && result.destination.droppableId.startsWith("panel-")) {
        let itemsInSource = widgetByPanel.get(result.source.droppableId);
        if (itemsInSource) {
          const field = itemsInSource[result.source.index];
          itemsInSource.splice(result.source.index, 1);

          let itemsInDestination = widgetByPanel.get(result.destination.droppableId);
          if (itemsInDestination !== undefined) {
            setWidgetByPanel(
              (widgetByPanel) =>
                new Map(widgetByPanel.set(result.destination.droppableId, [...itemsInDestination, field]))
            );
          } else {
            setWidgetByPanel((widgetByPanel) => new Map(widgetByPanel.set(result.destination.droppableId, [field])));
          }
        }
        return;
      }

      if (result.source.droppableId === "toolbar" && result.destination.droppableId.startsWith("panel-")) {
        const field = fieldsToDrag.find((f) => f.id === result.draggableId);
        setFieldsToDrag(fieldsToDrag.filter((f) => f.id !== result.draggableId));

        let itemDocuments = widgetByPanel.get(result.destination.droppableId);

        if (itemDocuments !== undefined) {
          setWidgetByPanel(
            (widgetByPanel) => new Map(widgetByPanel.set(result.destination.droppableId, [...itemDocuments, field]))
          );
        } else {
          setWidgetByPanel((widgetByPanel) => new Map(widgetByPanel.set(result.destination.droppableId, [field])));
        }
        return;
      }

      if (result.source.droppableId.startsWith("panel-") && result.destination.droppableId === "toolbar") {
        let itemDocuments = widgetByPanel.get(result.source.droppableId);
        if (itemDocuments) {
          const field = itemDocuments[result.source.index];
          itemDocuments.splice(result.source.index, 1);
          setFieldsToDrag([...fieldsToDrag, field]);
        }
        return;
      }
    } else {
      if (result.destination.droppableId.startsWith("panel-")) {
        let componentsInPanel = widgetByPanel.get(result.destination.droppableId);
        if (componentsInPanel) {
          const data = reorder(componentsInPanel, result.source.index, result.destination.index);
          setWidgetByPanel((widgetByPanel) => new Map(widgetByPanel.set(result.destination.droppableId, [...data])));
        }
      }
    }
  };

  const addPanel = () => {
    const id = `panel-${uuid()}`;
    const panel = { id: id };
    setPanels([...panels, panel]);
  };

  const deletePanel = () => {
    const ret = panels.filter((p) => p.id !== selectedPanel);

    let componentsInPanel = widgetByPanel.get(selectedPanel);
    if (componentsInPanel) {
      setFieldsToDrag([...fieldsToDrag, ...componentsInPanel]);
    }

    setPanels(ret);
    setSelectedPanel(null);
  };

  const onEnter = (e) => {};
  const onExit = (e) => {};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack
        spacing={"xs"}
        justify="flex-start"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        })}
      >
        <EntityDefinitionHeader
          text={t("document.entityDefinition.label.formLayout")}
          entityDefinition={entityDefinition}
        />
        <Group p={0} position="apart">
          <Group>
            <Button leftIcon={<IconDeviceFloppy />} onClick={save}>
              {t("document.entityDefinition.buttons.save")}
            </Button>
            <Button leftIcon={<IconRowInsertBottom />} onClick={addPanel}>
              {t("document.entityDefinition.buttons.addRow")}
            </Button>
            <Button leftIcon={<IconTrash />} onClick={deletePanel} disabled={!selectedPanel}>
              {t("document.entityDefinition.buttons.deleteRow")}
            </Button>
            <SegmentedControl value={containerSize} onChange={setContainerSize} data={breakpoints} />
          </Group>
          <Button onClick={() => navigate(back)}>
            <Text>{t("button.back")}</Text>
          </Button>
        </Group>

        <Group grow>
          <Paper bg={"gray.1"} h={"100%"} p={"xs"} withBorder radius={0}>
            <Container size={containerSize}>
              <ScrollArea h={wsize.height - 270}>
                {panels.map((p) => {
                  return (
                    <DropRow
                      key={p.id}
                      id={p.id}
                      data={widgetByPanel.get(p.id)}
                      setSelected={setSelectedPanel}
                      selected={selectedPanel === p.id}
                      onEnter={onEnter}
                      onExit={onExit}
                    />
                  );
                })}
              </ScrollArea>
            </Container>
          </Paper>
        </Group>
      </Stack>
    </DragDropContext>
  );
};

export default EntityLayout;
