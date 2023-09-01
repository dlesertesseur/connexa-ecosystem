import { Handle, Position } from "reactflow";

function TaskNode({ data, isConnectable }) {
  return (
    <div className="task-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div>
        <label htmlFor="label" className="task-node-name">
          {data.label}
        </label>
        <label htmlFor="roles" className="task-node-roles">
          {data?.role?.name}
        </label>
        <label htmlFor="taskType" className="task-node-type">
          {data.taskType}
        </label>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default TaskNode;
