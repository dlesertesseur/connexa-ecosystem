import React from "react";
import { Group, Line } from "react-konva";
import { PIXEL_METER_RELATION } from "../../../../../../Constants";

const G2dPolygon = ({ part, pixelMeterRelation = 1, strokeWidth=1, closed=true}) => {
  let pp = [];
  const geometries = part.geometries;

  if (geometries && geometries.length) {
    const geometry = geometries[0];
    const points = geometry.points;

    if (points) {
      points.forEach((p) => {
        pp.push(p.positionx * pixelMeterRelation);
        pp.push(p.positiony * pixelMeterRelation);
      });
    }
  }

  return (
    <Group
      id={part.id}
      x={part.positionx * PIXEL_METER_RELATION}
      y={part.positionz * PIXEL_METER_RELATION}
      rotation={part.rotationy}
      name={part.name}
    >
      <Line points={pp} fill={part.color} stroke={part.borderColor} strokeWidth={strokeWidth} closed={closed} />
    </Group>
  );
};

export default G2dPolygon;
