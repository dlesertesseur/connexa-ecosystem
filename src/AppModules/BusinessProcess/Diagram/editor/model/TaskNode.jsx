import { Handle, Position } from "reactflow";

function TaskNode(props) {
  const { data, isConnectable, selected } = props;

  // console.log("TaskNode props -> ", props);
  return (
    <div className="task-node" style={{ 
        border: selected ? "1px solid #f00" : "1px solid #000",
        background: selected ? "rgba(255, 0, 0, 0.2)" : "#ffffff"
        }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div>
        <label htmlFor="label" className="task-node-name">
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

export default TaskNode;
