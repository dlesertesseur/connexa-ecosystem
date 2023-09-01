import { Handle, Position } from "reactflow";

function ForkNode({ data, isConnectable, selected }) {
  return (
    <div
      className="fork-node"
      style={{
        border: selected ? "3px solid #f00" : "3px solid #00f",
        background: selected ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 0, 255, 0.2)",
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="label" className="task-node-name">
          {"Fork"}
        </label>
        {/* <label htmlFor="roles" className="task-node-roles">
          {data.roles}
        </label>
        <label htmlFor="taskType" className="task-node-type">
          {data.taskType}
        </label> */}
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default ForkNode;
