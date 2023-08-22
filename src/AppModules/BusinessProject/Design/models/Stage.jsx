import { ActionIcon, Card, Group, ScrollArea } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import React from "react";
import EditTextField from "./EditTextField";
import Action from "./Action";
import AddAction from "./AddAction";
import uuid from "react-uuid";
import AddStage from "./AddStage";
import { DesignerStateContext } from "../Context";

const Stage = ({ id, name }) => {
  const scrollRef = useRef(null);
  const { t } = useTranslation();

  const { project, setProject, editing } = useContext(DesignerStateContext);

  let actionsList = [];
  const stage = project.stages.find((s) => s.id === id);
  if (stage) {
    actionsList = stage.actions;
  }

  const deleteStage = (id) => {
    const ret = project.stages.filter((s) => s.id !== id);
    project.stages = ret;
    setProject({ ...project });
  };

  const addStage = () => {
    const newStage = {
      id: uuid(),
      name: t("businessProcess.label.stageDefaultName"),
      actions: [],
    };
    project.stages.push(newStage);
    setProject({ ...project });
  };

  const updateStage = (id, data) => {
    const stage = project.stages.find((s) => s.id === id);
    if (stage) {
      stage.name = data;
    }
    setProject({ ...project });
  };

  const newAction = () => {
    const action = { id: uuid(), name: t("businessProcess.label.actionDefaultName"), tasks: [] };
    const stage = project.stages.find((s) => s.id === id);
    if (stage) {
      stage.actions.push(action);
    }
    setProject({ ...project });
  };

  return (
    <Group spacing={"xs"} noWrap>
      <Card withBorder h={400} miw={300}>
        <Card.Section p="xs">
          <Group align="center" position="apart" noWrap spacing={"xs"}>
            <EditTextField
              value={name}
              onEnter={(text) => {
                updateStage(id, text);
              }}
            />

            {project?.stages.length > 1 && editing ? (
              <ActionIcon
                onClick={() => {
                  deleteStage(id);
                }}
                variant={"default"}
              >
                <IconTrash size={16} />
              </ActionIcon>
            ) : null}
          </Group>
        </Card.Section>

        <Card.Section p="xs">
          <ScrollArea h={330} ref={scrollRef}>
            {actionsList?.map((a) => (
              <Action key={a.id} name={a.name} stageId={id} id={a.id} />
            ))}
            {editing ? <AddAction newAction={newAction} /> : null}
          </ScrollArea>
        </Card.Section>
      </Card>
      {addStage && editing ? <AddStage add={addStage} /> : null}
    </Group>
  );
};

export default Stage;
