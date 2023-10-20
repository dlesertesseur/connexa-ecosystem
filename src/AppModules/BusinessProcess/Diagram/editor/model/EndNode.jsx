import { useState } from "react";
import { Handle, NodeResizer, Position } from "reactflow";

function EndNode(props) {
  const { data, isConnectable, selected, id } = props;
  const [nodeSize, setNodeSize] = useState({ width: data?.width, height: data?.height });

  return (
    <>
      <NodeResizer
        nodeId={id}
        color="#7100ff"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
        handleStyle={{ width: 6, height: 6 }}
        onResize={(evt, params) => {
          setNodeSize({ width: params.width, height: params.height });
        }}
      />

      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "3px solid",
          background: selected ? "rgba(255, 0, 0, 0.2)" : data?.color,
          borderColor: selected ? "rgba(255, 0, 0, 0.8)" : data?.borderColor,
          padding: "5px",
          borderRadius: "5px",
          height: `${nodeSize.height}px`,
          width: `${nodeSize.width}px`,
        }}
      >
        <label
          htmlFor="label"
          style={{
            color: "#000",
            fontWeight: "600",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          {data.label}
        </label>
        <label htmlFor="roles" className="task-node-roles">
          {data?.role?.name}
        </label>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </>
  );
}

export default EndNode;
