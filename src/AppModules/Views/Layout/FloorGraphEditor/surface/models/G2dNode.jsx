import React, { useEffect } from "react";
import { Circle, Group } from "react-konva";
import { useState } from "react";
import G2dLabel from "./G2dLabel";

const G2dNode = ({ node, selected = false, radioNode = 15, onSelect, onUpdatePosition, initialize }) => {
  const [location, setLocation] = useState({ x: node.positionx, y: node.positionz });

  useEffect(() => {
    if(initialize){
      setLocation({ x: node.positionx, y: node.positionz });
    }
  }, [initialize])

  return (
    <Group draggable onDblClick={node.onDblClick}>
      <Circle
        id={node.id}
        x={node.positionx}
        y={node.positionz}
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
          userData.positionx = e.target.position().x;
          userData.positionz = e.target.position().y;
          setLocation(e.target.position());
          onUpdatePosition ? onUpdatePosition(node.id, e.target.position()) : null;
        }}
      />
      {selected ? <G2dLabel x={location.x} y={location.y} text={node.name} /> : null}
    </Group>
  );
};

export default G2dNode;
