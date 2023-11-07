import React from "react";
import DesignToolbar from "./DesignToolbar";
import BusinessProcessHeader from "../BusinessProcessHeader";
import Diagram from "./Diagram";
import uuid from "react-uuid";
import { Stack } from "@mantine/core";
import { useEffect, useContext, useState } from "react";
import { AbmStateContext, EditorStateContext } from "../Context";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { findBusinessProcessModelById, saveBusinessProcessModel } from "../../../../DataAccess/BusinessProcessModel";
import { getRectOfNodes, getTransformForBounds, useEdgesState, useNodesState } from "reactflow";
import { toPng } from "html-to-image";
import { config } from "../../../../Constants/config";

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
    const tasks = [];
    const sprints = [];

    nodes.forEach((n) => {
      switch (n.type) {
        case "sprintNode":
          const sprint = {
            id: n.id,
            name: n.data.label,
            locationx: n.position.x,
            locationy: n.position.y,
            locationz: 0,
            requiredRole: n.data.role ? n.data.role.id : null,
            backgroundColor: n.data.color,
            borderColor: n.data.borderColor,
            border: null,
            fontName: null,
            fontColor: null,
            fontSize: null,
            dimensionx: n.width,
            dimensiony: n.height,
            type: n.type,
            durationInDays: n.data.duration,
            number: n.data.sprintNumber,
          };

          sprints.push(sprint);
          break;

        default:
          const task = {
            id: n.id,
            name: n.data.label,
            locationx: n.position.x,
            locationy: n.position.y,
            locationz: 0,
            requiredRole: n.data.role ? n.data.role.id : null,
            backgroundColor: n.data.color,
            borderColor: n.data.borderColor,
            border: null,
            fontName: null,
            fontColor: null,
            fontSize: null,
            dimensionx: n.width,
            dimensiony: n.height,
            type: n.type,
            sprintId: n.parentNode,
            durationInDays: n.data.duration,
          };

          tasks.push(task);
          break;
      }
    });

    const transitions = edges.map((e) => {
      const ret = {
        id: uuid(),
        originTaskId: e.source,
        targetTaskId: e.target,
        bidirectional: e.data.bidirectional,
      };
      return ret;
    });

    const initialTask = tasks.find((t) => t.type === "initNode");
    //const endTask = tasks.find((t) => t.type === "endNode");

    const params = {
      token: user.token,
      id: businessProcessModel.id,
      name: businessProcessModel.name,
      description: businessProcessModel.description,
      status:businessProcessModel.status,
      tasks: tasks,
      sprints: sprints,
      transitions: transitions,
      initialTaskId: initialTask ? initialTask.id : null,
      requiredRole: initialTask ? initialTask.requiredRole : null,
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

  function downloadImage(dataUrl) {
    const a = document.createElement("a");

    a.setAttribute("download", `${businessProcessModel.name}.png`);
    a.setAttribute("href", dataUrl);
    a.click();
  }

  const onExport = () => {
    const nodesBounds = getRectOfNodes(nodes);
    const transform = getTransformForBounds(nodesBounds, config.exportImageWidth, config.exportImageHeight, 0.5, 2);

    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "#ffffff",
      width: config.exportImageWidth,
      height: config.exportImageHeight,
      style: {
        width: config.exportImageWidth,
        height: config.exportImageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
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
          nodes,
          setNodes,
          onNodesChange,
          edges,
          setEdges,
          onEdgesChange,
        }}
      >
        <BusinessProcessHeader text={t("businessProcess.label.definition")} businessProcess={businessProcessModel} />
        <DesignToolbar onSave={onSave} onExport={onExport} />
        <Diagram />
      </EditorStateContext.Provider>
    </Stack>
  );
};

export default Editor;
