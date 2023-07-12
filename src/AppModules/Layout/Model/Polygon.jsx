import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Group, Line } from "react-konva";

const Polygon = ({
  x,
  y,
  points,
  color,
  borderColor,
  pixelMeterRelation,
  rotation,
  name = "no-def",
}) => {

  const [pointList, setPointList] = useState([]);

  useEffect(() => {
    const pp = [];
    if (points) {
      points.forEach((p) => {
        pp.push(p.positionx * pixelMeterRelation);
        pp.push(p.positiony * pixelMeterRelation);
      });
    }
    setPointList(pp);

  }, [pixelMeterRelation, points]);
  
  return (

    <Group x={x} y={y} rotation={rotation}>
      <Line
        name={name}
        points={pointList}
        stroke={borderColor}
        strokeWidth={1}
        closed={true}
        fill={color ? color : "#0000ff"}
      />
    </Group>
  );
};

export default Polygon;
