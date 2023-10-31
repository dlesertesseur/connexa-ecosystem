import "reactflow/dist/style.css";
import "../../../Diagram.css"
import React from "react";
import { Controls, MarkerType, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from "reactflow";
import { useEffect } from "react";
import { findBusinessProcessInstanceById } from "../../../DataAccess/BusinessProcessModel";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useMemo } from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { findAllByOrganizationId } from "../../../DataAccess/OrganizationRole";
import { useTranslation } from "react-i18next";
import ForkNode from "./model/ForkNode";
import JoinNode from "./model/JoinNode";
import StaticSprintNode from "./model/StaticSprintNode";
import StaticTaskNode from "./model/StaticTaskNode";
import InitNode from "./model/InitNode";
import EndNode from "./model/EndNode";
import SprintSettingsModal from "./SprintSettingsModal";
import TaskSettingsModal from "./TaskSettingsModal";
import HeaderPanel from "./HeaderPanel";

const BusinessProcessDiagramInstacePanel = ({ businessProcessInstanceId, taskId = null, onBack }) => {
  const { user, organizationSelected } = useSelector((state) => state.auth.value);
  const [businessProcessInstance, setBusinessProcessInstance] = useState(null);
  const [roles, setRoles] = useState([]);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const { height, width } = useViewportSize();
  const { t } = useTranslation();

  const nodeTypes = useMemo(
    () => ({
      taskNode: StaticTaskNode,
      forkNode: ForkNode,
      joinNode: JoinNode,
      sprintNode: StaticSprintNode,
      initNode: InitNode,
      endNode: EndNode,
    }),
    []
  );

  const getRoleById = (id) => {
    let roleFound = null;
    let assignedRole = null;

    if (id) {
      roleFound = roles?.find((r) => r.role.id === parseInt(id));
      if (roleFound) {
        assignedRole = { id: roleFound.role.id, name: roleFound.role.name };
      }
    }
    return assignedRole;
  };

  const getData = async () => {
    let params = { token: user.token, id: organizationSelected.id };
    const roles = await findAllByOrganizationId(params);
    setRoles(roles);

    params = { token: user.token, id: businessProcessInstanceId };
    const ret = await findBusinessProcessInstanceById(params);
    if (ret.error) {
      console.log(ret.error);
    } else {
      setBusinessProcessInstance(ret);
    }
  };

  useEffect(() => {
    if (businessProcessInstanceId) {
      getData();
    }
  }, [businessProcessInstanceId]);

  const getTypeNode = (task) => {
    let ret = null;

    if (task.name.startsWith("forkNode")) {
      ret = "forkNode";
    } else {
      if (task.name.startsWith("joinNode")) {
        ret = "joinNode";
      } else {
        ret = "taskNode";
      }
    }

    return ret;
  };

  const getDefaultColor = (type) => {
    let defaultValue = null;

    switch (type) {
      case "stageNode":
      case "sprintNode":
        defaultValue = "rgba(255,0,0,0.1)";
        break;
      case "taskNode":
      case "initNode":
      case "endNode":
      case "forkNode":
      case "joinNode":
        defaultValue = "rgba(255,255,255,1)";
        break;
    }
    return defaultValue;
  };

  const getTaskColor = (task) => {
    let defaultValue = null;

    if (task.status !== "Finished") {
      defaultValue = task.backgroundColor;
    } else {
      defaultValue = "rgba(220,220,220,1)";
    }
    return defaultValue;
  };

  const getDefaultBorderColor = (type) => {
    let defaultValue = null;

    switch (type) {
      case "sprintNode":
        defaultValue = "rgba(0,0,255,1)";
        break;
      case "stageNode":
        defaultValue = "rgba(255,0,0,1)";
        break;
      case "taskNode":
        defaultValue = "rgba(0,0,0,1)";
        break;
      case "initNode":
        defaultValue = "rgba(255,0,0,1)";
        break;
      case "endNode":
        defaultValue = "rgba(0,0,255,1)";
        break;
    }
    return defaultValue;
  };

  const onNodeClick = (evt) => {};

  const onNodeDoubleClick = (e, node) => {
    setSelectedNode(node);
  };

  const onEdgeDoubleClick = (e, edge) => {
    setSelectedEdge(edge);
  };

  useEffect(() => {
    if (businessProcessInstance) {
      const nodes = businessProcessInstance?.tasks?.map((t) => {
        const type = t.type ? t.type : getTypeNode(t);
        const ret = {
          id: t.id,
          parentNode: t.sprintId,
          data: {
            label: t.name,
            role: getRoleById(t.requiredRole),
            color: t.id === taskId ? "rgba(0,255,0,1)" : getTaskColor(t),
            borderColor: t.borderColor ? t.borderColor : getDefaultBorderColor(type),
            width: t.dimensionx,
            height: t.dimensiony,
            duration: t.durationInDays,
            status: t.status
          },
          position: { x: t.locationx, y: t.locationy },
          type: type,
        };
        return ret;
      });

      const sprints = businessProcessInstance?.sprints?.map((t) => {
        const type = t.type ? t.type : getTypeNode(t);
        const ret = {
          id: t.id,
          data: {
            label: t.name,
            role: getRoleById(t.requiredRole),
            color: t.backgroundColor ? t.backgroundColor : getDefaultColor(type),
            borderColor: t.borderColor ? t.borderColor : getDefaultBorderColor(type),
            width: t.dimensionx,
            height: t.dimensiony,
            sprintNumber: t.number,
            duration: t.durationInDays,
          },
          position: { x: t.locationx, y: t.locationy },
          type: type,
        };
        return ret;
      });

      const edges = businessProcessInstance?.transitions?.map((e) => {
        let ret = {
          id: e.id,
          source: e.originTaskId,
          target: e.targetTaskId,
          label: "",
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          data: { bidirectional: e.bidirectional ? e.bidirectional : false },
        };

        if (e.bidirectional) {
          ret = { ...ret, markerStart: { type: MarkerType.ArrowClosed } };
        }
        return ret;
      });

      const totalNodes = sprints.concat(nodes);
      setNodes(totalNodes);
      setEdges(edges);
    }
  }, [businessProcessInstance]);

  const updateNode = () => {

  }

  return (
    <ReactFlowProvider>
      <Stack spacing={"xs"}>
        <HeaderPanel businessProcessInstance={businessProcessInstance} onBack={onBack}/>
        {width && height ? (
          <div style={{ height: `${height - 202}px`, width: `${width - 310}px`, border: "solid 1px #e5e5e5" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              onNodeDoubleClick={onNodeDoubleClick}
              onEdgeDoubleClick={onEdgeDoubleClick}
              onNodeClick={onNodeClick}
              elementsSelectable={true}
              snapToGrid={true}
              snapGrid={[10, 10]}
              minZoom={0.1}
            >
              <Controls />
            </ReactFlow>
          </div>
        ) : null}
      </Stack>

      <TaskSettingsModal
        node={selectedNode}
        roles={roles}
        updateNode={updateNode}
        open={selectedNode?.type === "taskNode" ? true : false}
        close={() => {
          setSelectedNode(null);
        }}
      />

      {/* <SprintSettingsModal
        node={selectedNode}
        updateNode={updateNode}
        open={selectedNode?.type === "sprintNode" ? true : false}
        close={() => {
          setSelectedNode(null);
        }}
      /> */}
    </ReactFlowProvider>
  );
};

export default BusinessProcessDiagramInstacePanel;
