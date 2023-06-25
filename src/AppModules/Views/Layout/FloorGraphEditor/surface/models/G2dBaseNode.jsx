import React from "react";
import uuid from "react-uuid";
import { Circle, Group } from "react-konva";
import { PIXEL_METER_RELATION } from "../../../../../../Constants";
import { useRef } from "react";

const G2dBaseNode = ({
  rack,
  module,
  radioNode = 15,
  selColor = "blue",
  color = "orange",
  draggable = false,
  selected = false,
  onSelect = null
}) => {
  const parts = module.parts;
  const partsG2d = [];
  const nodeRef = useRef();

  if (parts && parts.length) {
    parts.forEach((part) => {
      const g2dPart = (
        <Circle
          id={part.id}
          ref={nodeRef}
          key={uuid()}
          x={part.positionx * PIXEL_METER_RELATION}
          y={part.positionz * PIXEL_METER_RELATION}
          width={radioNode}
          height={radioNode}
          name={part.name}
          fill={selected ? selColor : color}
          perfectDrawEnabled={true}
          draggable={draggable}
          onMouseDown={onSelect}
          onTap={onSelect}
        />
      );
      partsG2d.push(g2dPart);
    });
  }

  return (
    <Group
      x={rack.positionx * PIXEL_METER_RELATION}
      y={rack.positionz * PIXEL_METER_RELATION}
      name={rack.name}
      width={rack.dimensionx * PIXEL_METER_RELATION}
      height={rack.dimensionz * PIXEL_METER_RELATION}
      rotation={-rack.rotationy}
    >
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
    </Group>
  );
};

export default G2dBaseNode;
