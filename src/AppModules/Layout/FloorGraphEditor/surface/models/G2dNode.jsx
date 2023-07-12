import React, { useEffect } from "react";
import { Circle, Group } from "react-konva";
import { useState } from "react";
import G2dLabel from "./G2dLabel";

const G2dNode = ({ node, selected = false, radioNode = 15, onSelect, onUpdatePosition, initialize, type="G2dNode" }) => {
  const [location, setLocation] = useState({ x: node.locationx, y: node.locationz });

  useEffect(() => {
    if(initialize){
      setLocation({ x: node.locationx, y: node.locationz });
    }
  }, [initialize])

  return (
    <Group draggable onDblClick={node.onDblClick}>
      <Circle
        id={node.id}
        x={node.locationx}
        y={node.locationz}
        width={radioNode}
        height={radioNode}
        fill={node.color ? node.color : "green"}
        name={node.name}
        draggable={node.draggable}
        userData={node}
        onMouseDown={onSelect}
        onTap={onSelect}
        connectors={node.connectors}
        stroke={"red"}
        strokeWidth={selected ? 2 : 0}
        onDragMove={(e) => {
          const userData = e.target.attrs.userData;
          userData.locationx = e.target.position().x;
          userData.locationz = e.target.position().y;
          setLocation(e.target.position());
          onUpdatePosition ? onUpdatePosition(node.id, e.target.position()) : null;
        }}
      />
      {selected ? <G2dLabel x={location.x} y={location.y} text={node.name} /> : null}
    </Group>
  );
};

export default G2dNode;
