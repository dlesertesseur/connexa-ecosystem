import React from "react";
import { Group, Rect } from "react-konva";
import { getModulePartColor, getModulePartSelectedColor, getModulePartStrokeColor } from "../../../../Util";

const ModulePart = ({ name, x, y, width, height, type, selected = false }) => {
  return (
    <Group x={-(width / 2.0)} y={-(height / 2.0)}>
      <Rect
        x={x}
        y={y}
        perfectDrawEnabled={true}
        name={name}
        width={width}
        height={height}
        fill={getModulePartColor(type)}
        stroke={selected ? getModulePartSelectedColor(type) : getModulePartStrokeColor(type)}
        strokeWidth={selected ? 0.5 : 0.2}
      />
    </Group>
  );
};

export default ModulePart;
