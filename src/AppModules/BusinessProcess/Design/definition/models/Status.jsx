import React from "react";
import EditTextField from "./EditTextField";
import AddTask from "./AddTask";
import Task from "./Task";
import uuid from "react-uuid";
import { ActionIcon, Card, Group, Paper, ScrollArea } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useRef } from "react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DesignerStateContext } from "../../Context";

const Status = ({ stageId, id, name }) => {
  const scrollRef = useRef();
  const { t } = useTranslation();
  const { businessProcess, setBusinessProcess, editing } = useContext(DesignerStateContext);

  let taskList = [];
  const stage = businessProcess?.stages.find((s) => s.id === stageId);
  if (stage) {
    const action = stage.statusses.find((a) => a.id === id);
    if (action) {
      taskList = action.tasks;
    }
  }

  const addTask = () => {
    const task = { id: uuid(), name: t("businessProcess.label.taskDefaultName") };
    const stage = businessProcess.stages.find((s) => s.id === stageId);
    if (stage) {
      const status = stage.statusses.find((a) => a.id === id);
      if (status) {
        status.tasks.push(task);

        let idx = 0;
        status.tasks.forEach((s) => {
          s.place = idx++;
        });

        setBusinessProcess({ ...businessProcess });
      }
    }
  };

  const deleteAction = (id) => {
    const stage = businessProcess.stages.find((s) => s.id === stageId);
    if (stage) {
      const ret = stage.statusses.filter((a) => a.id !== id);
      stage.statusses = ret;
      setBusinessProcess({ ...businessProcess });
    }
  };

  const updateStatus = (id, data) => {
    const stage = businessProcess.stages.find((s) => s.id === stageId);
    if (stage) {
      const status = stage.statusses.find((a) => a.id === id);
      if (status) {
        status.name = data;
      }
    }
    setBusinessProcess({ ...businessProcess });
  };

  return (
    <Paper withBorder radius={6} p={"xs"} mb={"xs"} bg={"gray.1"}>
      <Group align="center" position="apart" noWrap spacing={"xs"} mb={"xs"}>
        <EditTextField
          value={name}
          onEnter={(text) => {
            updateStatus(id, text);
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
    </Paper>
  );
};

export default Status;
