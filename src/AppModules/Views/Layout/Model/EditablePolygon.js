import React from "react";
import EditPoint from "./EditPoint";
import { useRef } from "react";
import { Group, Line } from "react-konva";
import { useSelector } from "react-redux";

const EditablePolygon = ({
  x,
  y,
  geometry,
  color,
  borderColor,
  pixelMeterRelation,
  rotation,
  name = "no-def",
  partId,
  updatePart,
  updatePartLocation,
  selected = false,
  editing = false,
  editPointSelected,
  setEditPointSelected,
}) => {
  const polygonRef = useRef();

  const { actualScale } = useSelector((state) => state.app.value);

  const updateLocation = (id, x, y) => {
    const points = geometry.points;
    points.forEach((p) => {
      if (p.id === id) {
        p.positionx = x;
        p.positiony = y;
      }
    });

    updatePart(partId, geometry);
  };

  const drawEditing = () => {
    const points = geometry.points;
    const ret = points.map((p) => (
      <EditPoint
        key={p.id}
        id={p.id}
        x={p.positionx}
        y={p.positiony}
        updateLocation={updateLocation}
        selected={p.id === editPointSelected}
        setSelected={setEditPointSelected}
        scale={actualScale} 
      />
    ));

    return ret;
  };

  const drawPolygon = () => {
    const pointList = [];
    const points = geometry.points;

    if (points) {
      points.forEach((p) => {
        pointList.push(p.positionx);
        pointList.push(p.positiony);
      });
    }

    const colorLine = editing ? "#0000ff" : "#ff0000";

    const line = (
      <Line
        ref={polygonRef}
        name={name}
        points={pointList}
        stroke={selected ? colorLine : borderColor}
        strokeWidth={selected ? 2 * (1/actualScale) : 1 * (1/actualScale)}
        closed={true}
        fill={color ? color : "#0000ff"}
      />
    );
    return line;
  };

  const onDragEnd = (e) => {
    const attrs = e.target.attrs;
    if (attrs.id === partId) {
      const location = { x: attrs.x / pixelMeterRelation , y: attrs.y / pixelMeterRelation };
      updatePartLocation(partId, location);
    }
  };

  return (
    <Group id={partId} x={x} y={y} rotation={rotation} draggable={editing} onDragEnd={onDragEnd}>
      {drawPolygon()}
      {editing ? drawEditing() : null}
    </Group>
  );
};

export default EditablePolygon;
