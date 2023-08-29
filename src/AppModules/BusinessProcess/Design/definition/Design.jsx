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
import { findAllSprints } from "../../../../DataAccess/Sprints";
import { findAllByOrganizationId } from "../../../../DataAccess/OrganizationRole";

const Design = () => {
  const { t } = useTranslation();
  const { user, organizationSelected } = useSelector((state) => state.auth.value);
  const { selectedRowId, setError } = useContext(AbmStateContext);
  const [editing, setEditing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessProcess, setBusinessProcess] = useState(null);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openTaskSettings, setOpenTaskSettings] = useState(false);
  const [sprints, setSprints] = useState([]);
  const [rolesByTask] = useState(new Map());
  const [roles, setRoles] = useState([]);

  const getData = async () => {
    let params = { token: user.token, id: selectedRowId };
    const ret = await findBusinessProcessById(params);
    setBusinessProcess(ret);

    const sprints = await findAllSprints(params);
    setSprints(
      sprints.map((s) => {
        const ret = { value: s.id, label: s.name };
        return ret;
      })
    );

    params = { token: user.token, id: organizationSelected.id };
    const roles = await findAllByOrganizationId(params);
    setRoles(roles);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  const onSave = async () => {
    const params = {
      id: businessProcess.id,
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
          sprints,
          rolesByTask,
          roles,
        }}
      >
        <TaskSettings
          taskId={selectedTaskId}
          open={openTaskSettings}
          close={() => {
            setOpenTaskSettings(false);
          }}
        />
        <BusinessProcessHeader text={t("businessProcess.label.definition")} businessProcess={businessProcess} />
        <DesignToolbar onSave={onSave} />
        <Designer />
      </DesignerStateContext.Provider>
    </Stack>
  );
};

export default Design;
