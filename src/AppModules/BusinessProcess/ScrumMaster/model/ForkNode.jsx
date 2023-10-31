import { Handle, Position } from "reactflow";

function ForkNode({ data, isConnectable, selected }) {
  return (
    <div
      className="fork-node"
      style={{
        border: selected ? "3px solid #f00" : "3px solid #000",
        background: selected ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.2)",
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label
          htmlFor="label"
          style={{
            display: "block",
            color: selected ? "rgb(255, 0, 0)" : "rgb(0, 64, 64)",
            fontWeight: "600",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          {"Fork"}
        </label>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default ForkNode;
