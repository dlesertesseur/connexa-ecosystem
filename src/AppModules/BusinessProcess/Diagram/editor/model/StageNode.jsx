import { memo } from "react";
import { NodeResizer } from "reactflow";

const StageNode = ({ data, selected }) => {
  return (
    <>
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
      <div
        style={{
          height: "100%",
          width: "100%",
          background: data?.color ? data?.color : "rgba(255,0,0,0.1)",
          borderRadius: 5,
          border: "1px dashed rgba(255,0,0,0.5)",
        }}
      >
        <div
          style={{
            padding: 5,
            display: "block",
            color: "#000",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          {data.label}
        </div>
      </div>

      {/* <Handle type="source" position={Position.Right} /> */}
    </>
  );
};

export default memo(StageNode);
