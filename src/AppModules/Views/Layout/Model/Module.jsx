import React from "react";
import ModulePart from "./ModulePart";
import { Circle, Group, Rect } from "react-konva";

const Module = ({
  name,
  x,
  y,
  parts,
  pixelMeterRelation,
  width,
  height,
  onClick = null,
  onDblClick = null,
  boundingBox = false,
  center = false,
  selected = false,
  frontView = false
}) => {
  return (
    <Group
      x={x}
      y={y}
      name={name}
      onClick={(e) => {
        if (onClick) {
          onClick(e.target);
        }
      }}
      onDblClick={(e) => {
        if (onDblClick) {
          onDblClick(e.target);
        }
      }}
    >
      <Group>
        {parts.map((part) => {
          return (
            <ModulePart
              key={part.id}
              x={part.positionx * pixelMeterRelation}
              y={(frontView ? part.positiony : part.positionz) * pixelMeterRelation}
              name={part.name}
              width={part.dimensionx * pixelMeterRelation}
              height={(frontView ? part.dimensiony: part.dimensionz) * pixelMeterRelation}
              type={part.type}
              pixelMeterRelation={pixelMeterRelation}
              selected={selected}
            />
          );
        })}
      </Group>

      {boundingBox ? (
        <Group x={-(width / 2.0)} y={-(height / 2.0)}>
          <Rect width={width} height={height} strokeWidth={0.2} stroke={"#ffff00"} />
        </Group>
      ) : null}

      {center ? <Circle width={4} height={4} fill={"#ff00ff"} /> : null}
    </Group>
  );
};

export default Module;
