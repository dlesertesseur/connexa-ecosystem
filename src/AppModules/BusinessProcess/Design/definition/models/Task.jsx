import React from "react";
import EditTextField from "./EditTextField";
import { ActionIcon, Badge, Card, Group, Paper, Stack, Text } from "@mantine/core";
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
    rolesByTask,
    roles
  } = useContext(DesignerStateContext);

  const assignedRoles = rolesByTask?.get(id);

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
    <Paper withBorder p={6} mb={6} bg={"violet.2"}>
      <Group align="flex-start" position="apart" noWrap spacing={"xs"}>
        <Stack spacing={"xs"} p={3} >
          <EditTextField
            value={name}
            onEnter={(text) => {
              updateTask(id, text);
            }}
          />
          {assignedRoles ? (
            <Group spacing={"xs"} p={0} m={0}>
              {assignedRoles.map((r, index) => {
                const data = roles.find((rol) => {
                  return(rol.role.id.toString() === r);
                });
                // const ret = <Text key={index} weight={500} size={"xs"}>{data?.role.name}</Text>;
                const ret = <Badge size="xs" color="violet.4" variant="filled">{data?.role.name}</Badge>;
                return ret;
              })}
            </Group>
          ) : null}
        </Stack>
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
