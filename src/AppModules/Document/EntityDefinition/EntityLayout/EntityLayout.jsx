import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button, Container, Group, Paper, ScrollArea, SegmentedControl, Stack, Text } from "@mantine/core";
import { useWindowSize } from "../../../../Hook";
import { useTranslation } from "react-i18next";
import { findEntityDefinitionById, saveEntityDefinition } from "../../../../DataAccess/EntityDefinition";
import { useContext } from "react";
import { AbmStateContext, EntityLayoutContext } from "../Context";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config } from "../../../../Constants/config";
import {
  IconDeviceFloppy,
  IconEye,
  IconRowInsertBottom,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import uuid from "react-uuid";
import EntityDefinitionHeader from "../EntityDefinitionHeader";
import FieldModal from "./FieldModal";
import DropRow from "./Components/DropRow";
import ViewLayoutModal from "./ViewLayoutModal";
import EntitySelectionModal from "./EntitySelectionModal";
import EntitiesPanel from "./Components/EntitiesPanel";

const EntityLayout = ({ back }) => {
  const wsize = useWindowSize();
  const [panels, setPanels] = useState([]);
  const [relatedEntities, setRelatedEntities] = useState([]);

  const [entityDefinition, setEntityDefinition] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedRelatedEntity, setSelectedRelatedEntity] = useState(null);
  const [widgetByPanel, setWidgetByPanel] = useState(new Map());
  const [containerSize, setContainerSize] = useState("md");
  const [opened, { open, close }] = useDisclosure(false);
  const [openView, setOpenView] = useState(false);
  const [openEntitySelection, setOpenEntitySelection] = useState(false);
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId, reloadFields } = useContext(AbmStateContext);
  const { t } = useTranslation();

  const totalHeaderHeight = 330 + (relatedEntities.length > 0 ? 26   : 0);

  const [breakpoints] = useState(
    config.breakpoints.map((b) => {
      return { label: b.toUpperCase(), value: b };
    })
  );
  const navigate = useNavigate();

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findEntityDefinitionById(params);
    setEntityDefinition(ret);

    const fields = ret.fields;
    const panels = [];
    const widgetByPanel = new Map();

    fields?.forEach((field) => {
      const id = `panel-${field.row}`;
      const group = widgetByPanel.get(id);

      if (group !== undefined) {
        widgetByPanel.set(id, [...group, field]);
      } else {
        widgetByPanel.set(id, [field]);
        panels.push({ id: id });
      }
    });

    setPanels(panels);
    setWidgetByPanel(widgetByPanel);
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
    const fields = [];

    panels.forEach((p, row) => {
      const components = widgetByPanel.get(p.id);

      components.forEach((w, order) => {
        const obj = { ...w };
        obj.row = row;
        obj.order = order;
        fields.push(obj);
      });
    });

    entityDefinition.fields = fields;

    const params = {
      token: user.token,
      id: entityDefinition.id,
      name: entityDefinition.name,
      description: entityDefinition.description,
      size: containerSize,
      values: {
        name: entityDefinition.name,
        description: entityDefinition.description,
        fields: entityDefinition.fields,
      },
    };

    saveEntityDefinition(params);
  };

  const deletePrefix = (cadena) => {
    var ret = cadena.replace(/^panel-/, "");
    return ret;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const data = reorder(panels, result.source.index, result.destination.index);
    setPanels(data);
  };

  const addPanel = () => {
    const id = `panel-${uuid()}`;
    const panel = { id: id };
    setPanels([...panels, panel]);
  };

  const editRelatedEntity = (e) => {
    setOpenEntitySelection(true);
  };

  const deleteRelatedEntity = (e) => {
    const ret = relatedEntities.filter((f) => f.entity.id !== selectedRelatedEntity.entity.id);
    setRelatedEntities(ret);
  };

  const addRelatedEntity = (entity, asCollection) => {
    const obj = { entity: entity, asCollection: asCollection ? true : false }
    setRelatedEntities([...relatedEntities, obj]);
  };

  const updateRelatedEntity = (entity, asCollection) => {

    const objIndex = relatedEntities.findIndex((obj) => obj.entity.id == selectedRelatedEntity.entity.id);
    
    if(objIndex >= 0){
      relatedEntities[objIndex].entity = entity;
      relatedEntities[objIndex].asCollection = asCollection;
    }
    setRelatedEntities([...relatedEntities]);
  };

  const deletePanel = () => {
    const ret = panels.filter((p) => p.id !== selectedPanel);
    setPanels(ret);
    setSelectedPanel(null);
  };

  const deleteField = () => {
    const panelId = `panel-${selectedField.row}`;

    let componentsInPanel = widgetByPanel.get(panelId);
    if (componentsInPanel) {
      const ret = componentsInPanel.filter((f) => f.id !== selectedField.id);
      setWidgetByPanel((widgetByPanel) => new Map(widgetByPanel.set(panelId, ret)));
    }

    setSelectedPanel(null);
    setSelectedField(null);
    setSelectedRelatedEntity(null);
  };

  const addField = (e) => {
    open();
  };

  const editField = (e) => {
    open();
  };

  const viewEntityDefinition = (e) => {
    setOpenView(true);
  };

  const onCreate = (values) => {
    if (values.id === null) {
      values.id = uuid();
      values.row = deletePrefix(selectedPanel);

      const fields = widgetByPanel.get(selectedPanel);

      if (fields !== undefined) {
        setWidgetByPanel((widgetByPanel) => new Map(widgetByPanel.set(selectedPanel, [...fields, values])));
      } else {
        setWidgetByPanel((widgetByPanel) => new Map(widgetByPanel.set(selectedPanel, [values])));
      }
    } else {
      const id = `panel-${values.row}`;
      const fields = widgetByPanel.get(id);

      const objIndex = fields.findIndex((obj) => obj.id == values.id);
      fields[objIndex] = values;
      setWidgetByPanel((widgetByPanel) => new Map(widgetByPanel.set(selectedPanel, [...fields])));
    }

    close();
  };

  const clearSelections = () => {
    setSelectedField(null);
    setSelectedPanel(null);
    setSelectedRelatedEntity(null);
  };

  return (
    <EntityLayoutContext.Provider
      value={{
        selectedPanel,
        setSelectedPanel,
        selectedField,
        setSelectedField,
        selectedRelatedEntity,
        setSelectedRelatedEntity,
        addField,
        deletePanel,
        editField,
        deleteField,
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <FieldModal opened={opened} close={close} onCreate={onCreate} />
        <EntitySelectionModal
          open={openEntitySelection}
          close={() => setOpenEntitySelection(false)}
          selectedEntity={selectedRelatedEntity}
          addEntity={addRelatedEntity}
          updateEntity={updateRelatedEntity}
        />
        {entityDefinition ? (
          <ViewLayoutModal
            open={openView}
            close={() => {
              setOpenView(false);
            }}
            name={t("document.entityDefinition.title.viewDoc")}
            panels={panels}
            widgetByPanel={widgetByPanel}
            relatedEntities={relatedEntities}
            entity={entityDefinition}
            //fullScreen={false}
          />
        ) : null}
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
              <SegmentedControl value={containerSize} onChange={setContainerSize} data={breakpoints} />
              <Button leftIcon={<IconEye />} onClick={viewEntityDefinition}>
                {t("document.entityDefinition.buttons.view")}
              </Button>
            </Group>
            <Button onClick={() => navigate(back)}>
              <Text>{t("button.back")}</Text>
            </Button>
          </Group>

          <Group grow>
            <Paper bg={"gray.1"} h={"100%"} p={"xs"} withBorder radius={0}>
              <Container size={containerSize} mb={"xs"}>
                <EntitiesPanel
                  data={relatedEntities}
                  selectedPanel={selectedPanel}
                  setSelectedPanel={setSelectedPanel}
                  selectedRelatedEntity={selectedRelatedEntity}
                  setSelectedRelatedEntity={setSelectedRelatedEntity}
                  addRelatedEntity={() => {
                    setOpenEntitySelection(true);
                  }}
                  editRelatedEntity={editRelatedEntity}
                  deleteRelatedEntity={deleteRelatedEntity}
                  setSelectedField={setSelectedField} 
                />
              </Container>

              <ScrollArea h={wsize.height - totalHeaderHeight} onMouseDown={clearSelections}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <Container size={containerSize} {...provided.droppableProps} ref={provided.innerRef}>
                      {panels.map((p, index) => {
                        return <DropRow key={p.id} id={p.id} index={index} data={widgetByPanel.get(p.id)} />;
                      })}
                      {provided.placeholder}
                    </Container>
                  )}
                </Droppable>
              </ScrollArea>
            </Paper>
          </Group>
        </Stack>
      </DragDropContext>
    </EntityLayoutContext.Provider>
  );
};

export default EntityLayout;
