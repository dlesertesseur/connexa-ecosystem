import React from "react";
import EditablePolygon from "./EditablePolygon";
import { Group, Rect } from "react-konva";

const EditableStructurePart = ({
  partId,
  name,
  x,
  y,
  width,
  height,
  type,
  rotation,
  color,
  borderColor,
  geometry,
  pixelMeterRelation,
  updatePart,
  selected,
  editing
}) => {
  const drawRect = () => {
    return <Rect x={x} y={y} name={name} width={width} height={height} fill={color} perfectDrawEnabled={true} />;
  };

  const drawPolygon = (geometry) => {
    let pol = null;

    pol = (
      <EditablePolygon
        x={x}
        y={y}
        name={name}
        partId={partId}
        geometry={geometry}
        updatePart={updatePart}
        color={color}
        borderColor={borderColor}
        rotation={rotation}
        type={type}
        pixelMeterRelation={pixelMeterRelation}
        selected={selected}
        editing={editing}
      />
    );

    return pol;
  };

  return <Group>{geometry ? drawPolygon(geometry) : drawRect()}</Group>;
};

export default EditableStructurePart;
