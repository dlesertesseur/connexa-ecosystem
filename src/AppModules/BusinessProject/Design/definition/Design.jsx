import React from "react";
import DesignToolbar from "./DesignToolbar";
import DesignHeader from "./DesignHeader";
import Designer from "./Designer";
import { Modal, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { useContext } from "react";
import { AbmStateContext, DesignerStateContext } from "../Context";
import { useState } from "react";
import { useSelector } from "react-redux";
import { findBusinessProjectsById } from "../../../../DataAccess/BusinessProject";
import TaskSettings from "./TaskSettings";

const Design = () => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const [editing, setEditing] = useState(true);
  const [project, setProject] = useState(null);
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
        value={{ project, setProject, editing, setEditing, openTaskSettings, setOpenTaskSettings }}
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
