import React from "react";
import Module from "./Module";
import Frame from "./Frame";
import { Circle, Group, Rect } from "react-konva";
import { getModulePartSelectedColor, getModulePartStrokeColor, getRackSelectedColor } from "../../../../Util";
import { useRef } from "react";
import { BLOCK_SNAP_SIZE } from "../.././../../Constants";
import RackLabel from "./RackLabel";

const Rack = ({
  name,
  x,
  y,
  rotation,
  modules,
  frames,
  width,
  height,
  pixelMeterRelation,
  boundingBox = false,
  center = false,
  draggable = false,
  onClick = null,
  onDblClick = null,
  selected = false,
  userData = null,
  onPress = null,
  showLabel = true,
  detailContent = true,
}) => {
  const ref = useRef();

  return (
    <Group
      ref={ref}
      x={x}
      y={y}
      rotation={rotation}
      name={name}
      draggable={draggable}
      onMouseDown={(e) => {
        if (onPress) {
          onPress(ref, userData);
        }
      }}
      onDblClick={(e) => {
        if (onDblClick) {
          onDblClick(ref, userData);
        }
      }}
      onDragMove={(e) => {
        const obj = e.target;
        if (userData !== null) {
          userData.positionx = (Math.round(obj.x() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE) / pixelMeterRelation;
          userData.positionz = (Math.round(obj.y() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE) / pixelMeterRelation;
          ref.current.position({
            x: Math.round(obj.x() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
            y: Math.round(obj.y() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
          });
        }
      }}
      onDragEnd={(e) => {
        const obj = e.target;

        if (userData !== null) {
          userData.positionx = (Math.round(obj.x() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE) / pixelMeterRelation;
          userData.positionz = (Math.round(obj.y() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE) / pixelMeterRelation;
          ref.current.position({
            x: Math.round(obj.x() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
            y: Math.round(obj.y() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
          });
        }
      }}
    >
      {detailContent ? (
        <>
          {modules?.map((module) => {
            return (
              <Module
                key={module.id}
                x={module.positionx * pixelMeterRelation}
                y={module.positionz * pixelMeterRelation}
                width={module.dimensionx * pixelMeterRelation}
                height={module.dimensionz * pixelMeterRelation}
                name={module.name}
                parts={module.parts}
                pixelMeterRelation={pixelMeterRelation}
              />
            );
          })}

          {frames?.map((frame) => {
            return (
              <Frame
                key={frame.id}
                type={frame.type}
                name={frame.name}
                x={frame.positionx * pixelMeterRelation}
                y={frame.positionz * pixelMeterRelation}
                width={frame.dimensionx * pixelMeterRelation}
                height={frame.dimensionz * pixelMeterRelation}
              />
            );
          })}
        </>
      ) : (
        <Group x={-(width / 2.0)} y={-(height / 2.0)}>
          <Rect
            perfectDrawEnabled={false}
            width={width}
            height={height}
            strokeWidth={0.2}
            fill={selected ? getModulePartSelectedColor(1) : getModulePartStrokeColor(2)}
          />
        </Group>
      )}

      {boundingBox ? (
        <Group x={-(width / 2.0)} y={-(height / 2.0)}>
          <Rect width={width} height={height} strokeWidth={0.2} stroke={"#00ff00"} />
        </Group>
      ) : null}

      {selected ? (
        <Group x={-(width / 2.0)} y={-(height / 2.0)}>
          <Rect width={width} height={height} strokeWidth={1} stroke={getRackSelectedColor()} dash={[4, 2]} />
        </Group>
      ) : null}

      {selected && draggable && showLabel ? (
        <Group x={-(width / 2.0)} y={-(height / 2.0)}>
          <RackLabel text={name} x={width / 2.0} y={height / 2.0} />
        </Group>
      ) : null}

      {center ? <Circle width={2} height={2} fill={"#ff0000"} /> : null}
    </Group>
  );
};

export default Rack;
