import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
import { Circle, Group, Line } from "react-konva";

const Measurement = ({ visible = true, setDistance }) => {
  const [pos1, setPos1] = useState({ x: -25, y: 0 });
  const [pos2, setPos2] = useState({ x: 25, y: 0 });
  const [pointSelected, setPointSelected] = useState(null);

  useEffect(() => {
    const ret = Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2))
    setDistance(ret);
  }, [pos1, pos2, setDistance])

  const localSelection = (e) => {
    setPointSelected(e.target.attrs.id);
  };

  return (
    <Group x={0} y={0} visible={visible} draggable={true} onDragEnd={() => {}}>
      <Circle
        id={"mp01"}
        name={"mp01"}
        x={pos1.x}
        y={pos1.y}
        width={6}
        height={6}
        stroke={pointSelected === "mp01" ? "#ff0000" : "#000000"}
        draggable={true}
        onDragMove={(e) => {
          setPos1({ x: e.target.x(), y: e.target.y() });
        }}
        onMouseDown={(e) => localSelection(e)}
        onTap={(e) => localSelection(e)}
        strokeWidth={1}
      />

      <Circle
        id={"mp02"}
        name={"mp02"}
        x={pos2.x}
        y={pos2.y}
        width={6}
        height={6}
        stroke={pointSelected === "mp02" ? "#ff0000" : "#000000"}
        draggable={true}
        onDragMove={(e) => {
          setPos2({ x: e.target.x(), y: e.target.y() });
        }}
        onMouseDown={(e) => localSelection(e)}
        onTap={(e) => localSelection(e)}
        strokeWidth={1}
      />

      <Line id={uuid()} name={"ml"} points={[pos1.x, pos1.y, pos2.x, pos2.y]} stroke={"#000000"} strokeWidth={1} />
    </Group>
  );
};

export default Measurement;
