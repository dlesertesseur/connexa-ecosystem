import React from "react";
import { PIXEL_METER_RELATION } from "../../../../../../Constants";
import { Group } from "react-konva";
import G2dPart from "./G2dPart";

const G2dModule = ({ module }) => {

  const parts = module.parts;
  const partsG2d = [];

  if (parts && parts.length) {
    parts.forEach((part) => {
      const g2dPart = <G2dPart key={part.id} part={part} />; 
      partsG2d.push(g2dPart);
    });
  }

  return (
    <Group
      x={module.positionx * PIXEL_METER_RELATION}
      y={module.positionz * PIXEL_METER_RELATION}
      name={"moduleGroup"}
      width={module.dimensionx * PIXEL_METER_RELATION}
      height={module.dimensionz * PIXEL_METER_RELATION}
      rotation={-module.rotationy}
    >
      {partsG2d}
    </Group>
  );
};

export default G2dModule;
