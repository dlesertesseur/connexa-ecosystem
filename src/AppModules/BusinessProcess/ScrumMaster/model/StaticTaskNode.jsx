import { Handle, Position } from "reactflow";

function StaticTaskNode(props) {
  const { data, isConnectable, selected } = props;

  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid",
          background: selected ? "rgba(255, 0, 0, 0.2)" : data?.color,
          borderColor: selected ? "rgba(255, 0, 0, 0.8)" : data?.borderColor,
          padding: "2px",
          gap: "0px",
          borderRadius: "5px",
          height: `${data?.height}px`,
          width: `${data?.width}px`,
        }}
      >
        {data.sprint ? (
          <div
            style={{
              color: "#000",
              fontWeight: "600",
              fontSize: "8px",
              textAlign: "right",
            }}
          >
            {data.sprint.name}
          </div>
        ) : null}

        <div
          style={{
            color: "#000",
            fontWeight: "600",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          {data.label}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#777",
              fontWeight: "600",
              fontSize: "12px",
              textAlign: "left",
            }}
          >
            {data?.role?.name}
          </div>

          <div
            style={{
              display: "flex",
              color: "#777",
              fontWeight: "500",
              fontSize: "12px",
              textAlign: "right",
            }}
          >
            {data.duration ? `${data.duration} d` : null}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </>
  );
}

export default StaticTaskNode;
