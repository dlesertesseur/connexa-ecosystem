import React from "react";
import DesignToolbar from "./DesignToolbar";
import Designer from "./Designer";
import TaskSettings from "./TaskSettings";
import BusinessProcessHeader from "../BusinessProcessHeader";
import { Stack } from "@mantine/core";
import { useEffect, useContext, useState } from "react";
import { AbmStateContext, DesignerStateContext } from "../Context";
import { useSelector } from "react-redux";
import { findBusinessProcessById, saveBusinessProcess } from "../../../../DataAccess/BusinessProcess";
import { useTranslation } from "react-i18next";

const Design = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId, setError } = useContext(AbmStateContext);
  const [editing, setEditing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessProcess, setBusinessProcess] = useState(null);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openTaskSettings, setOpenTaskSettings] = useState(false);

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findBusinessProcessById(params);
    setBusinessProcess(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  const onSave = async () => {
    const params = {
      id:businessProcess.id,
      token: user.token,
      name: businessProcess.name,
      description: businessProcess.description,
      stages: businessProcess.stages,
      parameters: businessProcess.parameters,
    };

    console.log("onSave -> ", businessProcess);

    setSaving(true);
    try {
      const ret = await saveBusinessProcess(params);
      setSaving(false);

      if (ret.error) {
        setSaving(false);
        setError(ret.error);
      }

    } catch (error) {
      setSaving(false);
      setError(error);
    }
  };

  return (
    <Stack spacing={"xs"}>
      <DesignerStateContext.Provider
        value={{
          businessProcess,
          setBusinessProcess,
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
          saving,
          setSaving,
        }}
      >
        <TaskSettings
          open={openTaskSettings}
          close={() => {
            setOpenTaskSettings(false);
          }}
        />
        <BusinessProcessHeader businessProcess={businessProcess} text={t("businessProcess.label.definition")} />
        <DesignToolbar onSave={onSave} />
        <Designer />
      </DesignerStateContext.Provider>
    </Stack>
  );
};

export default Design;
