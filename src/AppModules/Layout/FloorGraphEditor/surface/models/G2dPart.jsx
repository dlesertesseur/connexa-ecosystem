import React from "react";
import { Rect } from "react-konva";
import { PIXEL_METER_RELATION } from "../../../../../Constants";
import { getModulePartColor, getModulePartStrokeColor } from "../../../../../Util";

const G2dPart = ({ part }) => {
  return (
    <Rect
      id={part.id}
      x={(part.positionx - part.dimensionx / 2.0) * PIXEL_METER_RELATION}
      y={(part.positionz - part.dimensionz / 2.0) * PIXEL_METER_RELATION}
      width={part.dimensionx * PIXEL_METER_RELATION}
      height={part.dimensionz * PIXEL_METER_RELATION}
      rotation={part.rotationy}
      name={part.name}
      stroke={getModulePartStrokeColor(part.type)}
      fill={getModulePartColor(part)}
      strokeWidth={0.2}
      listening={false}
      perfectDrawEnabled={true}
    />
  );
};

export default G2dPart;
