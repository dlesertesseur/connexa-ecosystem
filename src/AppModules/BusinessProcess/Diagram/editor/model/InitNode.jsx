import { Handle, NodeResizer, Position } from "reactflow";

function InitNode(props) {
  const { data, isConnectable, selected } = props;

  return (
    <div
      style={{
        border: "3px solid",
        minWidth: 100,
        background: selected ? "rgba(255, 0, 0, 0.2)" : data?.color,
        borderColor: selected ? "rgba(255, 0, 0, 0.8)" : data?.borderColor,
        height: "100%",
        padding: "5px",
        borderRadius: "5px",
      }}
    >
      <NodeResizer color="#ff0071" isVisible={selected} />

      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
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
        {/* <label htmlFor="taskType" className="task-node-type">
          {data.taskType}
        </label> */}
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default InitNode;
