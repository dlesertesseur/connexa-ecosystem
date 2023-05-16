import React from "react";

import { Circle, Group, Rect } from "react-konva";
import { getModulePartColor, getModulePartStrokeColor } from "../../../../Util";

const Frame = ({ name, x, y, width, height, type, boundingBox = false, center = false }) => {
  return (
    <Group x={-(width / 2.0)} y={-(height / 2.0)}>
      <Rect
        perfectDrawEnabled={true}
        x={x}
        y={y}
        name={name}
        width={width}
        height={height}
        fill={getModulePartColor(type)}
        stroke={getModulePartStrokeColor(type)}
        strokeWidth={0.2}
      />
      {boundingBox ? (
        <Group x={x} y={y}>
          <Rect width={width} height={height} strokeWidth={0.2} stroke={"#00ff00"} />
        </Group>
      ) : null}

      {center ? <Circle width={0.5} height={0.5} fill={"#ff0000"} /> : null}
    </Group>
  );
};

export default Frame;
