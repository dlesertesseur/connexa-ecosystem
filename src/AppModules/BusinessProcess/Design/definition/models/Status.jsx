import React from "react";
import EditTextField from "./EditTextField";
import AddTask from "./AddTask";
import Task from "./Task";
import uuid from "react-uuid";
import { ActionIcon, Group, Paper, ScrollArea, Select } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useRef } from "react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DesignerStateContext } from "../../Context";
import { useState } from "react";

const Status = ({ stageId, id, name }) => {
  const scrollRef = useRef();
  const { t } = useTranslation();
  const [sprint, setSprint] = useState(null);
  const { businessProcess, setBusinessProcess, editing, sprints } = useContext(DesignerStateContext);

  let taskList = [];
  const stage = businessProcess?.stages.find((s) => s.id === stageId);
  if (stage) {
    const action = stage.statusses.find((a) => a.id === id);
    if (action) {
      taskList = action.tasks;
      taskList.sort((a, b) => a.place - b.place);
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

  const onChangeSprint = (e) => {
    setSprint(e);

    const stage = businessProcess.stages.find((s) => s.id === stageId);
    if (stage) {
      const status = stage.statusses.find((a) => a.id === id);
      if (status) {
        status.sprint = e;
      }
    }
    setBusinessProcess({ ...businessProcess });
  };

  return (
    <Paper withBorder radius={6} p={6} mb={"xs"} bg={"gray.1"}>
      <Group align="center" position="apart" noWrap spacing={"xs"} mb={editing ? 0 : "xs"}>
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

      {editing ? (
        <Group align="center" grow>
          <Select
            value={sprint}
            onChange={onChangeSprint}
            mb={"xs"}
            size={"xs"}
            label={t("businessProcess.label.sprint")}
            placeholder={t("businessProcess.placeholder.sprint")}
            data={sprints}
          />
        </Group>
      ) : null}

      <ScrollArea ref={scrollRef} >
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
