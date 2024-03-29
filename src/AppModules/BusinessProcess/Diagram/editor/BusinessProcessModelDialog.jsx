import "reactflow/dist/style.css";
import "../../../../Diagram.css";
import React from "react";
import TaskNode from "./model/TaskNode";
import ForkNode from "./model/ForkNode";
import JoinNode from "./model/JoinNode";
import StageNode from "./model/StageNode";
import InitNode from "./model/InitNode";
import EndNode from "./model/EndNode";
import { Controls, MarkerType, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from "reactflow";
import { useEffect } from "react";
import { findBusinessProcessInstanceById } from "../../../../DataAccess/BusinessProcessModel";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useMemo } from "react";
import { Modal } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { findAllByOrganizationId } from "../../../../DataAccess/OrganizationRole";
import SprintNode from "./model/SprintNode";

const BusinessProcessModelDialog = ({ open, close, businessProcessInstanceId, taskId = null }) => {
  const { user, organizationSelected } = useSelector((state) => state.auth.value);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [businessProcessModel, setBusinessProcessModel] = useState(null);
  const [roles, setRoles] = useState(null);
  const { height, width } = useViewportSize();

  const nodeTypes = useMemo(
    () => ({
      taskNode: TaskNode,
      forkNode: ForkNode,
      joinNode: JoinNode,
      stageNode: StageNode,
      sprintNode: SprintNode,
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
      setBusinessProcessModel(ret);
    }
  };

  useEffect(() => {
    if (open) {
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

  useEffect(() => {
    if (businessProcessModel) {
      const nodes = businessProcessModel?.tasks?.map((t) => {
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
          },
          position: { x: t.locationx, y: t.locationy },
          type: type,
        };
        return ret;
      });

      const sprints = businessProcessModel?.sprints?.map((t) => {
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
            sprintNumber:t.number,
            duration:t.durationInDays
          },
          position: { x: t.locationx, y: t.locationy },
          type: type,
        };
        return ret;
      });

      const edges = businessProcessModel?.transitions?.map((e) => {
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
  }, [businessProcessModel]);

  return (
    <ReactFlowProvider>
      <Modal
        fullScreen
        opened={open}
        onClose={() => {
          close();
        }}
        title={businessProcessModel?.name}
        centered
      >
        <div style={{ height: `${height - 90}px`, width: `${width - 40}px`, border: "solid 1px #e5e5e5" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            // onNodeDoubleClick={onNodeDoubleClick}
            // onEdgeDoubleClick={onEdgeDoubleClick}
            // onNodeClick={onNodeClick}
            elementsSelectable={false}
            snapToGrid={true}
            snapGrid={[10, 10]}
            minZoom={0.1}
          >
            {/* <Background /> */}
            <Controls />
          </ReactFlow>
        </div>
      </Modal>
    </ReactFlowProvider>
  );
};

export default BusinessProcessModelDialog;
