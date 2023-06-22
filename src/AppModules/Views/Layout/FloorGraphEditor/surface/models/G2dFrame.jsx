import React from "react";
import { Rect } from "react-konva";
import { PIXEL_METER_RELATION } from "../../../../../../Constants";
import { getModulePartColor, getModulePartStrokeColor } from "../../../../../../Util";

const G2dFrame = ({ frame }) => {
  return (
    <Rect
      id={frame.id}
      x={(frame.positionx - frame.dimensionx / 2.0) * PIXEL_METER_RELATION}
      y={(frame.positionz - frame.dimensionz / 2.0) * PIXEL_METER_RELATION}
      width={frame.dimensionx * PIXEL_METER_RELATION}
      height={frame.dimensionz * PIXEL_METER_RELATION}
      rotation={frame.rotationy}
      name={frame.name}
      stroke={getModulePartStrokeColor(frame.type)}
      fill={getModulePartColor(frame)}
      strokeWidth={0.2}
      listening={false}
      perfectDrawEnabled={true}
    />
  );
};

export default G2dFrame;
