import "reactflow/dist/style.css";
import "../../../../Diagram.css";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import TaskNode from "./model/TaskNode";
import JoinNode from "./model/JoinNode";
import ForkNode from "./model/ForkNode";
import StageNode from "./model/StageNode";
import InitNode from "./model/InitNode";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  ReactFlowProvider,
  addEdge,
  getConnectedEdges,
  useKeyPress,
} from "reactflow";
import uuid from "react-uuid";
import TaskSettings from "./TaskSettings";
import StageSettings from "./StageSettings";
import { useWindowSize } from "../../../../Hook";
import { AbmStateContext, EditorStateContext } from "../Context";
import { useRef } from "react";
import { LoadingOverlay } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { arrayToMapByProp, hexToRgba } from "../../../../Util";
import EdgeSettings from "./EdgeSettings";

const Diagram = () => {
  const reactFlowRef = useRef();
  const { t } = useTranslation();
  const { width, height } = useWindowSize();
  const { businessProcessModel, nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, saving } =
    useContext(EditorStateContext);
  const { roles, sprints } = useContext(AbmStateContext);
  const [dim, setDim] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [targetNode, setTargetNode] = useState(null);

  const delPressed = useKeyPress("Delete");
  const nodeTypes = useMemo(
    () => ({ taskNode: TaskNode, forkNode: ForkNode, joinNode: JoinNode, stageNode: StageNode, initNode: InitNode }),
    []
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        const newParams = {
          ...params,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          data: { bidirectional: false },
        };
        return addEdge(newParams, eds);
      }),
    []
  );

  const onNodeClick = (evt) => {
    //console.log("onSelect -> ", evt);
  };

  const onNodeDoubleClick = useCallback((e, node) => {
    setSelectedNode(node);
  }, []);

  const onEdgeDoubleClick = useCallback((e, edge) => {
    setSelectedEdge(edge);
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
      case "initNode":
        defaultName = t("businessProcessModel.label.init");
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

  const getDefaultColor = (type) => {
    let defaultValue = null;

    switch (type) {
      case "stageNode":
        defaultValue = "rgba(255,0,0,0.1)";
        break;
      case "taskNode":
      case "initNode":
      case "forkNode":
      case "joinNode":
        defaultValue = "rgba(255,255,255,1)";
        break;
    }
    return defaultValue;
  };

  const getDefaultWidth = (type) => {
    let defaultValue = null;

    switch (type) {
      case "stageNode":
        defaultValue = 200;
        break;
      case "taskNode":
        defaultValue = 100;
        break;
      case "initNode":
      case "forkNode":
      case "joinNode":
        break;
    }
    return defaultValue;
  };

  const getDefaultHeight = (type) => {
    let defaultValue = null;

    switch (type) {
      case "stageNode":
        defaultValue = 200;
        break;
      case "taskNode":
        defaultValue = 30;
        break;
      case "initNode":
      case "forkNode":
      case "joinNode":
        break;
    }
    return defaultValue;
  };

  const getDefaultBorderColor = (type) => {
    let defaultValue = null;

    switch (type) {
      case "stageNode":
        defaultValue = "rgba(255,0,0,1)";
        break;
      case "taskNode":
        defaultValue = "rgba(0,0,0,1)";
        break;
      case "initNode":
        defaultValue = "rgba(255,0,0,1)";
        break;
    }
    return defaultValue;
  };

  const getDefaultZIndex = (type) => {
    let defaultValue = null;

    switch (type) {
      case "stageNode":
        defaultValue = 0;
        break;

      case "taskNode":
      case "initNode":
        defaultValue = 300;
        break;

      default:
        defaultValue = 200;
        break;
    }
    return defaultValue;
  };

  const onDrop = (event) => {
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
      zIndex: getDefaultZIndex(type),
      data: {
        label: getName(type),
        role: "",
        width: getDefaultWidth(type),
        height: getDefaultHeight(type),
        color: getDefaultColor(type),
        borderColor: getDefaultBorderColor(type),
      },
    };

    const ret = [newNode, ...nodes];
    ret.sort((a, b) => a.zIndex - b.zIndex);
    setNodes(ret);
  };

  const onNodeDragStart = (evt, node) => {
    // console.log("onNodeDragStart -> ", node);
  };

  const onNodeDrag = (evt, node) => {
    const centerX = node.positionAbsolute.x + node.width / 2;
    const centerY = node.positionAbsolute.y + node.height / 2;

    const targetNode = nodes.find(
      (n) =>
        centerX > n.position.x &&
        centerX < n.position.x + n.width &&
        centerY > n.position.y &&
        centerY < n.position.y + n.height &&
        n.id !== node.id
    );

    setTargetNode(targetNode);
  };

  const onNodeDragStop = (evt, node) => {
    if (node && node.type !== "stageNode") {
      if (targetNode && targetNode?.type === "stageNode" && targetNode?.id !== node.id) {
        const ret = nodes.map((n) => {
          let ret = null;
          if (n.id === node.id) {
            if (!n.parentNode && n.parentNode !== targetNode.id) {
              n.position.x = (targetNode.position.x - n.positionAbsolute?.x) * -1.0;
              n.position.y = (targetNode.position.y - n.positionAbsolute?.y) * -1.0;
              ret = { ...n, parentNode: targetNode.id };
            } else {
              ret = n;
            }
          } else {
            ret = n;
          }
          return ret;
        });

        setNodes(ret);
      }

      if (targetNode !== null && targetNode === undefined) {
        const ret = nodes.map((n) => {
          let ret = null;
          if (n.id === node.id) {
            n.position.x = n.positionAbsolute?.x;
            n.position.y = n.positionAbsolute?.y;
            ret = { ...n, parentNode: null };
          } else {
            ret = n;
          }
          return ret;
        });

        setNodes(ret);
      }
    }

    setTargetNode(null);
  };

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
      const stages = businessProcessModel.stages.map((t) => {
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
          },
          position: { x: t.locationx, y: t.locationy },
          type: type,
        };
        return ret;
      });

      const nodes = businessProcessModel.tasks.map((t) => {
        const type = t.type ? t.type : getTypeNode(t);
        const ret = {
          id: t.id,
          parentNode: t.stageId,
          data: {
            label: t.name,
            role: getRoleById(t.requiredRole),
            color: t.backgroundColor ? t.backgroundColor : getDefaultColor(type),
            borderColor: t.borderColor ? t.borderColor : getDefaultBorderColor(type),
            width: t.dimensionx,
            height: t.dimensiony,
          },
          position: { x: t.locationx, y: t.locationy },
          type: type,
        };
        return ret;
      });

      const edges = businessProcessModel.transitions.map((e) => {
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

      const totaNodes = stages.concat(nodes);
      setNodes(totaNodes);
      setEdges(edges);
    }
  }, [businessProcessModel]);

  useEffect(() => {
    if (delPressed) {
      let edgesToRemove = [];

      const nodesToRemove = nodes.filter((n) => n.selected && n.type !== "stageNode");

      const stageToRemove = nodes.filter((n) => n.selected && n.type === "stageNode");
      const stageToRemoveId = stageToRemove.map((s) => s.id);

      const stageById = arrayToMapByProp("id", stageToRemove);

      const otherNodes = nodes.filter((n) => !n.selected);

      if (nodesToRemove.length > 0) {
        nodesToRemove.forEach((n) => {
          const connectedEdges = getConnectedEdges([n], edges);
          edgesToRemove = edgesToRemove.concat(connectedEdges.map((e) => e.id));
        });

        const otherEdges = edges.filter((e) => !edgesToRemove.includes(e.id));

        setNodes(otherNodes);
        setEdges(otherEdges);
      }

      if (stageToRemoveId && stageToRemoveId.length > 0) {
        otherNodes.forEach((n) => {
          if (stageToRemoveId.includes(n.parentNode)) {
            const stage = stageById.get(n.parentNode);
            n.parentNode = null;
            if (stage) {
              n.position.x = n.position.x + stage.position.x;
              n.position.y = n.position.y + stage.position.y;
            }
          }
        });

        setNodes(otherNodes);
      }

      const selectedEdgesList = edges.filter((e) => e.selected);
      if (selectedEdgesList.length > 0) {
        const ret = edges.filter((e) => !e.selected);
        setEdges(ret);
      }
    }
  }, [delPressed]);

  const updateNode = (values) => {
    let borderColorRgba = null;
    let colorRgba = null;
    let roleFound = null;
    let assignedRole = null;
    let sprintFound = null;
    const assignedSprint = [];

    if (values.color) {
      colorRgba = hexToRgba(values.color, values.alpha);
    } else {
      colorRgba = "rgba(255,255,255,1)";
    }

    if (values.borderColor) {
      borderColorRgba = hexToRgba(values.borderColor, 1);
    } else {
      borderColorRgba = "rgba(0,0,0,1)";
    }

    if (values.role) {
      roleFound = roles.find((r) => r.role.id === parseInt(values.role));
      if (roleFound) {
        assignedRole = { id: roleFound.role.id, name: roleFound.role.name };
      }
    }

    if (values.sprint) {
      values.sprint.forEach((sprint) => {
        sprintFound = sprints.find((s) => {
          return s.value === parseInt(sprint);
        });
        if (sprintFound) {
          assignedSprint.push({ id: sprintFound.value, name: sprintFound.label });
        }
      });
    }

    const ret = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        node.data = {
          ...node.data,
          label: values.name,
          role: assignedRole,
          color: colorRgba,
          borderColor: borderColorRgba,
          automatic: values.automatic,
          applicationPath: values.applicationPath,
          serviceUrl: values.serviceUrl,
          sprint: assignedSprint,
        };
      }

      return node;
    });

    setNodes(ret);
  };

  const updateEdge = (values) => {
    const ret = edges.map((edge) => {
      if (edge.id === selectedEdge.id) {
        edge.label = values.name;
        edge.data.bidirectional = values.bidirectional;
        if (values.bidirectional) {
          edge.markerStart = { type: MarkerType.ArrowClosed };
        } else {
          delete edge.markerStart;
        }
      }

      return edge;
    });

    setEdges(ret);
  };

  const diagram = dim ? (
    <ReactFlowProvider>
      <TaskSettings
        node={selectedNode}
        updateNode={updateNode}
        open={selectedNode?.type === "taskNode" || selectedNode?.type === "initNode" ? true : false}
        close={() => {
          setSelectedNode(null);
        }}
      />
      <EdgeSettings
        edge={selectedEdge}
        updateEdge={updateEdge}
        open={selectedEdge ? true : false}
        close={() => {
          setSelectedEdge(null);
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
          onEdgeDoubleClick={onEdgeDoubleClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          elementsSelectable={true}
          snapToGrid={true}
          snapGrid={[10, 10]}
          minZoom={0.1}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
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
