import { Handle, Position } from "reactflow";

function JoinNode({ data, isConnectable, selected }) {
  return (
    <div
      className="join-node"
      style={{
        border: selected ? "3px solid #f00" : "3px solid #0f0",
        background: selected ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 0, 0.3)",
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div>
        <label htmlFor="label" className="task-node-name">
          {"Join"}
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

export default JoinNode;
