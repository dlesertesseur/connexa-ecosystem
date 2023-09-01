import "reactflow/dist/style.css";
import "../../../../Diagram.css";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import TaskNode from "./model/TaskNode";
import JoinNode from "./model/JoinNode";
import ForkNode from "./model/ForkNode";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
} from "reactflow";
import uuid from "react-uuid";
import TaskSettings from "./TaskSettings";
import { useWindowSize } from "../../../../Hook";
import { EditorStateContext } from "../Context";
import { useRef } from "react";

const Diagram = () => {
  const reactFlowRef = useRef();
  const { width, height } = useWindowSize();
  const { businessProcessModel, roles, nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } =
    useContext(EditorStateContext);
  const [dim, setDim] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const nodeTypes = useMemo(() => ({ taskNode: TaskNode, forkNode: ForkNode, joinNode: JoinNode }), []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onNodeClick = (evt) => {
    console.log("onSelect -> ", evt);
  };

  const onNodeDoubleClick = useCallback((e, node) => {
    setSelectedNode(node);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

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
        data: { label: `${type} node`, roles: "", taskType: "" },
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
    roleFound = roles.find((r) => r.role.id === id);
    if (roleFound) {
      assignedRole = { id: roleFound.role.id, name: roleFound.role.name };
    }
    return assignedRole;
  };

  useEffect(() => {
    if (businessProcessModel) {
      const nodes = businessProcessModel.tasks.map((t) => {
        const ret = {
          id: t.id,
          data: { label: t.name, roles: getRoleById(t.requiredRole), taskType: "" },
          position: { x: t.locationx, y: t.locationx },
          type: "taskNode",
        };
        return ret;
      });

      const edges = businessProcessModel.transitions.map((e) => {
        const ret = { id: e.id, source: e.originNodeId, target: e.targetNodeId, label: "", type: "" };
        return ret;
      });
      setNodes(nodes);
      setEdges(edges);
    }
  }, [businessProcessModel]);

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
        open={selectedNode ? true : false}
        close={() => {
          setSelectedNode(null);
        }}
      />
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
          snapGrid={[10, 10]}
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
