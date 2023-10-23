import { Handle, Position } from "reactflow";

function InitNode(props) {
  const { data, isConnectable, selected} = props;

  return (
    <div
      style={{
        border: selected ? "3px solid rgb(255, 0, 204)" : "3px solid rgb(0, 0, 255)",
        background: selected ? "rgba(255, 0, 204, 0.2)" : "rgba(0, 0, 255, 0.2)",
        display: "flex",
        flexDirection: "column",
        width: `${data.label.visualLength}px`,
        height: "50px",
        paddingInline: "20px",
        borderRadius: "36px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />

      <label
        htmlFor="label"
        style={{
          display: "block",
          color: selected ? "rgb(255, 0, 204)" : "rgb(0, 0, 255)",
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
          color: selected ? "rgb(255, 0, 204)" : "rgb(64, 64, 255)",
          fontWeight: "600",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        {data?.role?.name}
      </label>
    </div>
  );
}

export default InitNode;
