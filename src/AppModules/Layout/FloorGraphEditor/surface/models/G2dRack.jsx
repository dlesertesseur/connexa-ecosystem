import React from "react";
import G2dFrame from "./G2dFrame";
import G2dModule from "./G2dModule";
import { Group, Rect } from "react-konva";
import { PIXEL_METER_RELATION } from "../../../../../Constants";
import { useState } from "react";

const G2dRack = ({ rack, onSelect, onDblClick }) => {
  const frames = rack.frames;
  const modules = rack.modules;

  const framesG2d = [];
  const modulesG2d = [];

  const [basesRef, setBasesRef] = useState(new Map());

  if (frames && frames.length) {
    frames.forEach((frame) => {
      framesG2d.push(<G2dFrame key={frame.id} frame={frame} />);
    });
  }

  if (modules && modules.length) {
    modules.forEach((module) => {
      modulesG2d.push(<G2dModule key={module.id} module={module} setBasesRef={setBasesRef} basesRef={basesRef} />);
    });
  }

  return (
    <Group
      id={rack.id}
      x={rack.positionx * PIXEL_METER_RELATION}
      y={rack.positionz * PIXEL_METER_RELATION}
      name={rack.name}
      width={rack.dimensionx * PIXEL_METER_RELATION}
      height={rack.dimensionz * PIXEL_METER_RELATION}
      rotation={-rack.rotationy}
    >
      {framesG2d}
      {modulesG2d}
      
      <Rect
        id={rack.id}
        x={-(rack.dimensionx * PIXEL_METER_RELATION) / 2}
        y={-(rack.dimensionz * PIXEL_METER_RELATION) / 2}
        width={rack.dimensionx * PIXEL_METER_RELATION}
        height={rack.dimensionz * PIXEL_METER_RELATION}
        name={rack.name}
        userData={rack}
        onMouseDown={onSelect}
        onTap={onSelect}
        onDblClick={onDblClick}
        onDblTap={onDblClick}
      />
    </Group>
  );
};

export default G2dRack;
