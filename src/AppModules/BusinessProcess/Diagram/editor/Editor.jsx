import React from "react";
import DesignToolbar from "./DesignToolbar";
import BusinessProcessHeader from "../BusinessProcessHeader";
import Diagram from "./Diagram";
import { Stack } from "@mantine/core";
import { useEffect, useContext, useState } from "react";
import { AbmStateContext, EditorStateContext } from "../Context";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { findBusinessProcessModelById, saveBusinessProcessModel } from "../../../../DataAccess/BusinessProcessModel";
import { useEdgesState, useNodesState } from "reactflow";
import uuid from "react-uuid";

const Editor = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId, setError } = useContext(AbmStateContext);
  const [editing, setEditing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessProcessModel, setBusinessProcessModel] = useState(null);
  const [openTaskSettings, setOpenTaskSettings] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const getData = async () => {
    let params = { token: user.token, id: selectedRowId };
    const ret = await findBusinessProcessModelById(params);
    setBusinessProcessModel(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  const onSave = async () => {

    const tasks = nodes.map((n) => {
      const ret = {
        "id": n.id,
        "name": n.data.label,
        "locationx": n.position.x,
        "locationy": n.position.y,
        "locationz": 0,
        "requiredRole": n.data.role ? n.data.role.id : null,
        "backgroundColor": null,
        "borderColor": null,
        "border": null,
        "fontName": null,
        "fontColor": null,
        "fontSize": null
      };
      return(ret);
    })

    const transitions = edges.map((e) => {
      const ret = {
        "id": uuid(),
        "originNodeId": e.source,
        "targetNodeId": e.target,
      };
      return(ret);
    })

    const params = {
      token: user.token,
      id: businessProcessModel.id,
      name: businessProcessModel.name,
      description: businessProcessModel.description,
      tasks: tasks,
      transitions: transitions,
    };

    setSaving(true);
    try {
      const ret = await saveBusinessProcessModel(params);
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
      <EditorStateContext.Provider
        value={{
          businessProcessModel,
          setBusinessProcessModel,
          editing,
          setEditing,
          openTaskSettings,
          setOpenTaskSettings,
          saving,
          setSaving,
          nodes, setNodes, onNodesChange,
          edges, setEdges, onEdgesChange,
        }}
      >
        <BusinessProcessHeader text={t("businessProcess.label.definition")} businessProcess={businessProcessModel} />
        <DesignToolbar onSave={onSave} />
        <Diagram />
      </EditorStateContext.Provider>
    </Stack>
  );
};

export default Editor;
