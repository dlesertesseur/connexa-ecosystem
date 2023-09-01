import "reactflow/dist/style.css";
import "../../../../Diagram.css";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import TaskNode from "./model/TaskNode";
import JoinNode from "./model/JoinNode";
import ForkNode from "./model/ForkNode";
import StageNode from "./model/StageNode";
import ReactFlow, { Background, Controls, ReactFlowProvider, addEdge, getConnectedEdges, useKeyPress } from "reactflow";
import uuid from "react-uuid";
import TaskSettings from "./TaskSettings";
import { useWindowSize } from "../../../../Hook";
import { AbmStateContext, EditorStateContext } from "../Context";
import { useRef } from "react";
import { LoadingOverlay } from "@mantine/core";
import StageSettings from "./StageSettings";
import { useTranslation } from "react-i18next";

const Diagram = () => {
  const reactFlowRef = useRef();
  const { t } = useTranslation();
  const { width, height } = useWindowSize();
  const { businessProcessModel, nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, saving } =
    useContext(EditorStateContext);
  const { roles } = useContext(AbmStateContext);
  const [dim, setDim] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const delPressed = useKeyPress("Delete");
  const nodeTypes = useMemo(
    () => ({ taskNode: TaskNode, forkNode: ForkNode, joinNode: JoinNode, stageNode: StageNode }),
    []
  );

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onNodeClick = (evt) => {
    //console.log("onSelect -> ", evt);
  };

  const onNodeDoubleClick = useCallback((e, node) => {
    setSelectedNode(node);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const getName = (type) => {
    let defaultName = null;

    switch (type) {
      case "stageNode":
        defaultName = t("businessProcessModel.label.stage");
        break;
      case "taskNode":
        defaultName = t("businessProcessModel.label.task");
        break;
      case "forkNode":
        defaultName = "forkNode";
        break;
      case "joinNode":
        defaultName = "joinNode";
        break;
    }
    return defaultName;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowRef.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: uuid(),
        type,
        position,
        data: { label: getName(type), role: "", type: "" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  useEffect(() => {
    if (width && height) {
      const ret = { height: height - 270, width: width - 310 };
      setDim(ret);
    }
  }, [width, height]);

  const getRoleById = (id) => {
    let roleFound = null;
    let assignedRole = null;

    if (id) {
      roleFound = roles.find((r) => r.role.id === parseInt(id));
      if (roleFound) {
        assignedRole = { id: roleFound.role.id, name: roleFound.role.name };
      }
    }
    return assignedRole;
  };

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

  useEffect(() => {
    if (businessProcessModel) {
      const nodes = businessProcessModel.tasks.map((t) => {
        const ret = {
          id: t.id,
          data: { label: t.name, role: getRoleById(t.requiredRole), taskType: "" },
          position: { x: t.locationx, y: t.locationy },
          type: getTypeNode(t),
        };
        return ret;
      });

      const edges = businessProcessModel.transitions.map((e) => {
        const ret = { id: e.id, source: e.originNodeId, target: e.targetNodeId, label: "", type: "smoothstep" };
        return ret;
      });
      setNodes(nodes);
      setEdges(edges);
    }
  }, [businessProcessModel]);

  useEffect(() => {
    if (delPressed) {
      let edgesToRemove = [];

      const nodesToRemove = nodes.filter((n) => n.selected);
      if (nodesToRemove.length > 0) {
        const otherNodes = nodes.filter((n) => !n.selected);

        nodesToRemove.forEach((n) => {
          const connectedEdges = getConnectedEdges([n], edges);
          edgesToRemove = edgesToRemove.concat(connectedEdges.map((e) => e.id));
        });

        const otherEdges = edges.filter((e) => !edgesToRemove.includes(e.id));

        setNodes(otherNodes);
        setEdges(otherEdges);
      }

      const selectedEdgesList = edges.filter((e) => e.selected);
      if (selectedEdgesList.length > 0) {
        const ret = edges.filter((e) => !e.selected);
        setEdges(ret);
      }
    }
  }, [delPressed]);

  const updateNode = (values) => {
    let roleFound = null;
    let assignedRole = null;
    if (values.role) {
      roleFound = roles.find((r) => r.role.id === parseInt(values.role));
      if (roleFound) {
        assignedRole = { id: roleFound.role.id, name: roleFound.role.name };
      }
    }

    const ret = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        node.data = {
          ...node.data,
          label: values.name,
          role: assignedRole,
        };
      }

      return node;
    });

    setNodes(ret);
  };

  const diagram = dim ? (
    <ReactFlowProvider>
      <TaskSettings
        node={selectedNode}
        updateNode={updateNode}
        open={selectedNode?.type === "taskNode" ? true : false}
        close={() => {
          setSelectedNode(null);
        }}
      />

      <StageSettings
        node={selectedNode}
        updateNode={updateNode}
        open={selectedNode?.type === "stageNode" ? true : false}
        close={() => {
          setSelectedNode(null);
        }}
      />

      <LoadingOverlay overlayOpacity={0.5} visible={saving} />
      <div
        style={{ height: `${dim.height}px`, width: `${dim.width}px`, border: "solid 1px #e5e5e5" }}
        ref={reactFlowRef}
      >
        <ReactFlow
          onInit={setReactFlowInstance}
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          onNodeDoubleClick={onNodeDoubleClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onConnect={onConnect}
          snapToGrid={false}
          onNodeClick={onNodeClick}
          elementsSelectable={true}
          snapGrid={[1, 1]}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  ) : null;

  return diagram;
};

export default Diagram;
