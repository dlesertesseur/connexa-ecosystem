import React, { useCallback, useContext, useEffect, useState } from "react";
import ReactFlow, { Background, Controls, applyEdgeChanges, applyNodeChanges } from "reactflow";
import "reactflow/dist/style.css";
import { useWindowSize } from "../../../../Hook";
import { EditorStateContext } from "../Context";

const initialNodes = [
  {
    id: "1",
    data: { label: "Hello" },
    position: { x: 0, y: 0 },
    type: "input",
  },
  {
    id: "2",
    data: { label: "World" },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [{ id: "1-2", source: "1", target: "2", label: "to the", type: "step" }];

const Diagram = () => {
  const { width, height } = useWindowSize();
  const { businessProcessModel } = useContext(EditorStateContext);
  const [dim, setDim] = useState(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  useEffect(() => {
    if (width && height) {
      const ret = { height: height - 270, width: width - 310 };
      setDim(ret);
    }
  }, [width, height]);

  useEffect(() => {
    if (businessProcessModel) {
      console.log("businessProcessModel -> ", businessProcessModel);

      const nodes = businessProcessModel.tasks.map((t) => {
        const ret = { id: t.id, data: { label: t.name }, position: { x: t.locationx, y: t.locationx }, type: "input" };
        return ret;
      });

      const edges = businessProcessModel.transitions.map((e) => {
        const ret = { id: e.id, source: e.originNodeId, target: e.targetNodeId, label: "", type: "step" };
        return ret;
      });
      setNodes(nodes);
      setEdges(edges);
    }
  }, [businessProcessModel]);

  const diagram = dim ? (
    <div style={{ height: `${dim.height}px`, width: `${dim.width}px`, border: "solid 1px #e5e5e5" }}>
      <ReactFlow nodes={nodes} onNodesChange={onNodesChange} edges={edges} onEdgesChange={onEdgesChange}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  ) : null;

  return diagram;
};

export default Diagram;
