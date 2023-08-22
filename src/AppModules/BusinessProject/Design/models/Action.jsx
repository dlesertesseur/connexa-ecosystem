import React from "react";
import EditTextField from "./EditTextField";
import AddTask from "./AddTask";
import Task from "./Task";
import uuid from "react-uuid";
import { ActionIcon, Card, Group, ScrollArea } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useRef } from "react";
import { useContext } from "react";
import { DesignerStateContext } from "../Context";
import { useTranslation } from "react-i18next";

const Action = ({ stageId, id, name }) => {
  const scrollRef = useRef();
  const { t } = useTranslation();
  const { project, setProject, editing } = useContext(DesignerStateContext);

  let taskList = [];
  const stage = project.stages.find((s) => s.id === stageId);
  if (stage) {
    const action = stage.actions.find((a) => a.id === id);
    if (action) {
      taskList = action.tasks;
    }
  }

  const addTask = () => {
    const task = { id: uuid(), name: t("businessProcess.label.taskDefaultName") };
    const stage = project.stages.find((s) => s.id === stageId);
    if (stage) {
      const action = stage.actions.find((a) => a.id === id);
      if (action) {
        action.tasks.push(task);
        setProject({ ...project });
      }
    }
  };

  const deleteAction = (id) => {
    const stage = project.stages.find((s) => s.id === stageId);
    if (stage) {
      const ret = stage.actions.filter((a) => a.id !== id);
      stage.actions = ret;
      setProject({ ...project });
    }
  };

  const updateAction = (id, data) => {
    const stage = project.stages.find((s) => s.id === stageId);
    if (stage) {
      const action = stage.actions.find((a) => a.id === id);
      if (action) {
        action.name = data;
        console.log("Action updateAction -> ", action);
      }
    }
    setProject({ ...project });
  };

  return (
    <Card withBorder radius={6} p={"xs"} mb={"xs"} bg={"gray.2"}>
      <Card.Section p={"xs"}>
        <Group align="center" position="apart" noWrap spacing={"xs"}>
          <EditTextField
            value={name}
            onEnter={(text) => {
              updateAction(id, text);
            }}
          />

          {editing ? (
            <ActionIcon
              onClick={() => {
                deleteAction(id);
              }}
              variant={"default"}
            >
              <IconTrash size={16} color="black" />
            </ActionIcon>
          ) : null}
        </Group>
      </Card.Section>
      <Card.Section p={"xs"}>
        <ScrollArea ref={scrollRef}>
          {taskList?.map((t) => (
            <Task key={t.id} name={t.name} stageId={stageId} actionId={id} id={t.id} />
          ))}
        </ScrollArea>
        {editing ? (
          <Group grow spacing={"xs"}>
            <AddTask add={addTask} />
          </Group>
        ) : null}
      </Card.Section>
    </Card>
  );
};

export default Action;
