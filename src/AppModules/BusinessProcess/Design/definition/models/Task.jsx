import React from "react";
import EditTextField from "./EditTextField";
import { ActionIcon, Card, Group, Paper } from "@mantine/core";
import { IconSettings, IconTrash } from "@tabler/icons-react";
import { useContext } from "react";
import { DesignerStateContext } from "../../Context";

const Task = ({ stageId, actionId, id, name }) => {
  const {
    businessProcess,
    setBusinessProcess,
    editing,
    setOpenTaskSettings,
    setSelectedTaskId,
    setSelectedStageId,
    setSelectedActionId,
  } = useContext(DesignerStateContext);

  const deleteTask = (id) => {
    const stage = businessProcess.stages.find((s) => s.id === stageId);
    if (stage) {
      const action = stage.statusses.find((a) => a.id === actionId);
      if (action) {
        const ret = action.tasks.filter((t) => t.id !== id);
        action.tasks = ret;
        setBusinessProcess({ ...businessProcess });
      }
    }
  };

  const updateTask = (id, data) => {
    const stage = businessProcess.stages.find((s) => s.id === stageId);
    if (stage) {
      const action = stage.statusses.find((a) => a.id === actionId);
      if (action) {
        const task = action.tasks.find((t) => t.id === id);
        if (task) {
          task.name = data;
          setBusinessProcess({ ...businessProcess });
        }
      }
    }
  };

  return (
    <Paper withBorder p={"xs"} mb={"xs"} bg={"violet.2"}>
      <Group align="center" position="apart" noWrap spacing={"xs"}>
        <EditTextField
          value={name}
          onEnter={(text) => {
            updateTask(id, text);
          }}
        />
        {editing ? (
          <Group noWrap spacing={3}>
            <ActionIcon
              onClick={() => {
                setSelectedStageId(stageId);
                setSelectedActionId(actionId);
                setSelectedTaskId(id);
                setOpenTaskSettings(true);
              }}
              variant={"default"}
            >
              <IconSettings size={16} color="black" />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                deleteTask(id);
              }}
              variant={"default"}
            >
              <IconTrash size={16} color="black" />
            </ActionIcon>
          </Group>
        ) : null}
      </Group>
    </Paper>
  );
};

export default Task;
