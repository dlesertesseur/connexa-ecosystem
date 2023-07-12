import React from "react";
import Polygon from "./Polygon";
import { Group, Rect } from "react-konva";

const StructurePart = ({
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
  onSelect,
  onEdit,
}) => {
  const drawRect = () => {
    return <Rect x={x} y={y} name={name} width={width} height={height} fill={color} perfectDrawEnabled={true} />;
  };

  const drawPolygon = (geometry) => {
    
    let pol = null;

    // if (!editingEnabled) {
      pol = (
        <Polygon
          x={x}
          y={y}
          name={name}
          points={geometry.points}
          color={color}
          borderColor={borderColor}
          rotation={rotation}
          type={type}
          pixelMeterRelation={pixelMeterRelation}
        />
      );
    // } else {
    //   pol = (
    //     <EditablePolygon
    //       x={x}
    //       y={y}
    //       name={name}
    //       partId={partId}
    //       geometry={geometry}
    //       updatePart={updatePart}
    //       color={color}
    //       borderColor={borderColor}
    //       rotation={rotation}
    //       type={type}
    //       pixelMeterRelation={pixelMeterRelation}
    //       selected={selected}
    //       onSelect={onSelect}
    //       onEdit={onEdit}
    //     />
    //   );
    // }

    return pol;

  };

  return <Group>{geometry ? drawPolygon(geometry) : drawRect()}</Group>;
};

export default StructurePart;
