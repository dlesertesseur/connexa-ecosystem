import { useState } from "react";
import { Handle, NodeResizer, Position } from "reactflow";

function TaskNode(props) {
  const { data, isConnectable, selected, id } = props;
  const [nodeSize, setNodeSize] = useState({ width: data?.width, height: data?.height });

  // if (data.label.startsWith("Editar")) {
  //   console.log("TaskNode data -> ", props);
  // }

  return (
    <>
      {/* <div
        style={{
          border: "1px solid",
          background: selected ? "rgba(255, 0, 0, 0.2)" : data?.color,
          borderColor: selected ? "rgba(255, 0, 0, 0.8)" : data?.borderColor,
          height: "100%",
          padding: "5px",
          borderRadius: "5px",
        }}
      > */}
      <NodeResizer
        nodeId={id}
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
        handleStyle={{ width: 5, height: 5 }}
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
          border: "1px solid",
          background: selected ? "rgba(255, 0, 0, 0.2)" : data?.color,
          borderColor: selected ? "rgba(255, 0, 0, 0.8)" : data?.borderColor,
          padding: "5px",
          borderRadius: "5px",
          height: `${nodeSize.height}px`,
          width: `${nodeSize.width}px`,
        }}
      >
        <label
          style={{
            color: "#000",
            fontWeight: "600",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          {data.label}
        </label>
        <label className="task-node-roles">{data?.role?.name}</label>
        {/* <label htmlFor="taskType" className="task-node-type">
          {data.taskType}
        </label> */}
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      {/* </div> */}
    </>
  );
}

export default TaskNode;
