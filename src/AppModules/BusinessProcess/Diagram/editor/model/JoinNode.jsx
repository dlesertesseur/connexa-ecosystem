import { Handle, Position } from "reactflow";

function JoinNode({ data, isConnectable }) {
  return (
    <div className="join-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div>
        <label htmlFor="label" className="task-node-name">
          {"JOIN"}
        </label>
        <label htmlFor="roles" className="task-node-roles">
          {data.roles}
        </label>
        <label htmlFor="taskType" className="task-node-type">
          {data.taskType}
        </label>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default JoinNode;
