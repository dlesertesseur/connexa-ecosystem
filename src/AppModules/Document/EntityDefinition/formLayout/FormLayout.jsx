import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Button, Container, Grid, Group, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { useWindowSize } from "../../../../Hook";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { findEntityDefinitionById } from "../../../../DataAccess/EntityDefinition";
import { useContext } from "react";
import { AbmStateContext } from "../Context";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import EntityDefinitionHeader from "../EntityDefinitionHeader";
import DragToolbar from "./DragToolbar";
import DropPanel from "./components/DropPanel";

const FormLayout = ({ back }) => {
  const wsize = useWindowSize();
  const [panels, setPanels] = useState([]);
  const [fieldsToDrag, setFieldsToDrag] = useState([]);
  const [entityDefinition, setEntityDefinition] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [widgetByPanel, setWidgetByPanel] = useState(new Map());
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
    }
  };

  const addPanel = () => {
    const id = `panel-${uuid()}`;
    const panel = { id: id };
    setPanels([...panels, panel]);
  };

  const deletePanel = () => {
    const ret = panels.filter((p) => p.id !== selectedPanel);
    setPanels(ret);
    setSelectedPanel(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack
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
            <Button onClick={addPanel}>{t("document.entityDefinition.buttons.addRow")}</Button>
            <Button onClick={deletePanel} disabled={!selectedPanel}>
              {t("document.entityDefinition.buttons.deleteRow")}
            </Button>
          </Group>
          <Button onClick={() => navigate(back)}>
            <Text>{t("button.back")}</Text>
          </Button>
        </Group>

        <Grid w={wsize.width - 313} gutter={0}>
          <Grid.Col span={2}>
            <DragToolbar id={"toolbar"} data={fieldsToDrag} h={wsize.height - 250} />
          </Grid.Col>
          <Grid.Col span={"auto"} px={"xs"}>
            <Paper
              bg={"gray.3"}
              h={"100%"}
              p={"xs"}
              withBorder
              onClick={(e) => {
                //setSelectedPanel(null);
              }}
            >
              <Container size={"md"}>
                <ScrollArea h={wsize.height - 260}>
                  {panels.map((p) => {
                    return (
                      <DropPanel
                        key={p.id}
                        id={p.id}
                        data={widgetByPanel.get(p.id)}
                        setSelected={setSelectedPanel}
                        selected={selectedPanel === p.id}
                      />
                    );
                  })}
                </ScrollArea>
              </Container>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </DragDropContext>
  );
};

export default FormLayout;
