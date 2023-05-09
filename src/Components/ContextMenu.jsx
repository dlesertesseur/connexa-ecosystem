import React from "react";

const ContextMenu = ({position}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(${position.x * 100}% - 8px)`,
        top: `calc(${position.y * 100}% - 8px)`,
        width: 50,
        height: 50,
        backgroundColor: "#00ff00",
      }}
    />
  );
};

export default ContextMenu;
