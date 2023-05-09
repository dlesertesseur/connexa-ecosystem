import React, { useState } from "react";
import StructurePart from "./StructurePart";
import { Circle, Group } from "react-konva";
import { PIXEL_METER_RELATION } from "../../../../Constants";

const StaticLayout = ({ layout, pixelMeterRelation, center = false, parts, setParts }) => {
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [setEditingPartId] = useState(null);

  const updatePart = (partId, geometry) => {
    const ret = parts?.map((p) => {
      if (p.id === partId) {
        p.geometry = geometry;
      }
      return p;
    });

    setParts(ret);
  };

  return (
    <Group rotation={layout.rotation} name={layout.name} >
      {parts?.map((part) => {
        return (
          <StructurePart
            key={part.id}
            partId={part.id}
            x={part.positionx * PIXEL_METER_RELATION}
            y={part.positionz * PIXEL_METER_RELATION}
            rotation={part.rotationy}
            width={part.dimensionx}
            height={part.dimensionz}
            color={part.color}
            borderColor={part.borderColor}
            geometry={part.geometries[0]}
            type={part.primitivetype}
            pixelMeterRelation={pixelMeterRelation}
            name={layout.name}
            updatePart={updatePart}
            selected={part.id === selectedPartId}
            onSelect={(id) => setSelectedPartId(id)}
            onEdit={(id) => setEditingPartId(id)}
          />
        );
      })}

      {center ? <Circle width={2} height={2} fill={"#ff0000"} /> : null}
    </Group>
  );
};

export default StaticLayout;
