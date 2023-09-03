import { memo } from "react";
import { NodeResizer } from "reactflow";

const StageNode = ({ data, selected }) => {
  return (
    <>
      <NodeResizer color="#ff0071" isVisible={selected}  />
      <div
        style={{
          padding:0,
          height: "100%",
          width: "100%",
          borderRadius: 5,
          border: "1px solid",
          background: data?.color ? data?.color : "rgba(255,0,0,0.1)",
          borderColor: data?.borderColor ? data?.borderColor : "rgba(255,0,0,0.8)",
        }}
      >
        <div
          style={{
            paddingLeft: 5,
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
