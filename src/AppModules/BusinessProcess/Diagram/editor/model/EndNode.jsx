import { Handle, Position } from "reactflow";

function EndNode(props) {
  const { isConnectable, selected, data } = props;

  return (
    <div
      style={{
        border: selected ? "3px solid rgb(255, 0, 204)" : "3px solid rgb(255, 0, 0)",
        background: selected ? "rgba(255, 0, 204, 0.2)" : "rgba(255, 0, 0, 0.2)",
        display: "flex",
        flexDirection:"column",
        width: "120px",
        height: "50px",
        paddingInline: "15px",
        borderRadius: "36px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <label
        htmlFor="label"
        style={{
          display: "block",
          color: selected ? "rgb(255, 0, 204)" : "rgb(255, 0, 0)",
          fontWeight: "600",
          fontSize: "16px",
          textAlign: "center",
        }}
      >
        {data.label}
      </label>

      <label
        htmlFor="roles"
        style={{
          display: "block",
          color: selected ? "rgb(255, 0, 204)" : "rgb(255, 64, 64)",
          fontWeight: "600",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        {data?.role?.name}
      </label>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default EndNode;
