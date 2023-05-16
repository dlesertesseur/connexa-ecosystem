import React from "react";
import Rack from "./Rack";
import { Group } from "react-konva";

const Zone = ({
  name,
  racks,
  pixelMeterRelation,
  onRackClick = null,
  onRackDblClick = null,
  selectedRack = null,
  editingEnabled = false,
  showLabel = false,
  detailContent = true
}) => {
  return (
    <Group
      name={name}
    >
      {racks?.map((rack) => {
        return (
          <Rack
            key={rack.id}
            name={rack.name}
            x={rack.positionx * pixelMeterRelation}
            y={rack.positionz * pixelMeterRelation}
            width={rack.dimensionx * pixelMeterRelation}
            height={rack.dimensionz * pixelMeterRelation}
            rotation={-rack.rotationy}
            modules={rack.modules}
            frames={rack.frames}
            pixelMeterRelation={pixelMeterRelation}
            //onClick={onRackClick}
            onPress={onRackClick}
            onDblClick={onRackDblClick}
            selected={selectedRack ? selectedRack.id === rack.id : false}
            userData={rack}
            draggable={editingEnabled}
            showLabel={showLabel}
            detailContent={detailContent}
          />
        );
      })}
    </Group>
  );
};

export default Zone;
