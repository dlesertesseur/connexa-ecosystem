import { ActionIcon, Card, Group, Paper, ScrollArea } from "@mantine/core";
import { useContext } from "react";
import { IconTrash } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { DesignerStateContext } from "../../Context";
import { HEADER_HIGHT } from "../../../../../Constants";
import { useWindowSize } from "../../../../../Hook";
import { useEffect } from "react";
import { useState } from "react";
import React from "react";
import EditTextField from "./EditTextField";
import Status from "./Status";
import AddStatus from "./AddStatus";
import uuid from "react-uuid";
import AddStage from "./AddStage";

const Stage = ({ id, name }) => {
  const scrollRef = useRef(null);
  const wSize = useWindowSize();
  const { t } = useTranslation();
  const { businessProcess, setBusinessProcess, editing } = useContext(DesignerStateContext);
  const [statussesList, setStatussesList] = useState(null);

  useEffect(() => {
    if (businessProcess) {
      const stage = businessProcess.stages.find((s) => s.id === id);
      if (stage) {
        stage.statusses.sort((a, b) => a.place - b.place);
        setStatussesList(stage.statusses);
      }
    }
  }, [businessProcess]);

  const deleteStage = (id) => {
    const ret = businessProcess.stages.filter((s) => s.id !== id);
    businessProcess.stages = ret;
    setBusinessProcess({ ...businessProcess });
  };

  const addStage = () => {
    const newStage = {
      id: uuid(),
      name: t("businessProcess.label.stageDefaultName"),
      place: 0,
      statusses: [],
    };
    businessProcess.stages.push(newStage);

    let idx = 0;
    businessProcess.stages.forEach((s) => {
      s.place = idx++;
    });

    setBusinessProcess({ ...businessProcess });
  };

  const updateStage = (id, data) => {
    const stage = businessProcess?.stages.find((s) => s.id === id);
    if (stage) {
      stage.name = data;
    }
    setBusinessProcess({ ...businessProcess });
  };

  const newAction = () => {
    const action = { id: uuid(), name: t("businessProcess.label.actionDefaultName"), tasks: [] };
    const stage = businessProcess?.stages.find((s) => s.id === id);
    if (stage) {
      stage.statusses.push(action);

      let idx = 0;
      stage.statusses.forEach((s) => {
        s.place = idx++;
      });

      setBusinessProcess({ ...businessProcess });
    }
  };

  return (
    <Group spacing={"xs"} noWrap align="flex-start">
      <Paper withBorder p={6} mih={400} miw={300}>
          <Group align="center" position="apart" mb={6} noWrap spacing={"xs"}>
            <EditTextField
              value={name}
              onEnter={(text) => {
                updateStage(id, text);
              }}
            />

            {businessProcess?.stages.length > 1 && editing ? (
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

          <ScrollArea h={wSize.height - HEADER_HIGHT - 110} ref={scrollRef}>
            {statussesList?.map((a) => (
              <Status key={a.id} name={a.name} stageId={id} id={a.id} />
            ))}
            {editing ? <AddStatus newAction={newAction} /> : null}
          </ScrollArea>
        </Paper>
      {addStage && editing ? <AddStage add={addStage} /> : null}
    </Group>
  );
};

export default Stage;
