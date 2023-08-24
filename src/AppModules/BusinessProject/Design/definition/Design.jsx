import React from "react";
import DesignToolbar from "./DesignToolbar";
import DesignHeader from "./DesignHeader";
import Designer from "./Designer";
import TaskSettings from "./TaskSettings";
import { Stack } from "@mantine/core";
import { useEffect, useContext, useState } from "react";
import { AbmStateContext, DesignerStateContext } from "../Context";
import { useSelector } from "react-redux";
import { findBusinessProjectsById } from "../../../../DataAccess/BusinessProject";

const Design = () => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const [editing, setEditing] = useState(true);
  const [project, setProject] = useState(null);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openTaskSettings, setOpenTaskSettings] = useState(false);

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findBusinessProjectsById(params);
    setProject(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  const onSave = () => {
    console.log("onSave data -> ", project);
  };

  return (
    <Stack spacing={"xs"}>
      <DesignerStateContext.Provider
        value={{
          project,
          setProject,
          editing,
          setEditing,
          openTaskSettings,
          setOpenTaskSettings,
          selectedTaskId,
          setSelectedTaskId,
          selectedStageId,
          setSelectedStageId,
          selectedActionId,
          setSelectedActionId,
        }}
      >
        <TaskSettings
          open={openTaskSettings}
          close={() => {
            setOpenTaskSettings(false);
          }}
        />
        <DesignHeader />
        <DesignToolbar onSave={onSave} />
        <Designer />
      </DesignerStateContext.Provider>
    </Stack>
  );
};

export default Design;
