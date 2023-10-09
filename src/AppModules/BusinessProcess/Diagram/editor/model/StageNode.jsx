import { useState } from "react";
import { memo } from "react";
import { NodeResizer } from "reactflow";

const StageNode = ({ data, selected }) => {
  const [nodeSize, setNodeSize] = useState({ width: data?.width, height: data?.height });

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        handleStyle={{ width: 6, height: 6 }}
        onResize={(evt, params) => {
          setNodeSize({ width: params.width, height: params.height });
        }}
      />
      <div
        style={{
          padding: 0,
          borderRadius: 5,
          border: "1px solid",
          background: data?.color ? data?.color : "rgba(255,0,0,0.1)",
          borderColor: data?.borderColor ? data?.borderColor : "rgba(255,0,0,0.8)",
          height: `${nodeSize.height}px`,
          width: `${nodeSize.width}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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

          <div
            style={{
              color: "#777",
              fontWeight: "600",
              fontSize: "16px",
              textAlign: "right",
              paddingRight:5
            }}
          >
            {data.stageNumber}
          </div>
        </div>

        <div
          style={{
            color: "#777",
            fontWeight: "500",
            fontSize: "10px",
            textAlign: "right",
            paddingRight:5,
            paddingBottom:5
          }}
        >
          {data.duration}
        </div>
      </div>

      {/* <Handle type="source" position={Position.Right} /> */}
    </>
  );
};

export default memo(StageNode);
