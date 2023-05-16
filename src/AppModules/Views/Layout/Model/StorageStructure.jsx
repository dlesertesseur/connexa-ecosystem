import React from "react";
import Module from "./Module";
import { Circle, Group, Rect } from "react-konva";
import { useRef } from "react";
import { getRackSelectedColor } from "../../../../Util";
import { BLOCK_SNAP_SIZE } from "../../../../Constants";

const StorageStructure = ({
  name,
  x = 0,
  y = 0,
  rotation = 0,
  modules,
  width,
  height,
  pixelMeterRelation,
  boundingBox = false,
  center = false,
  content = true,
  draggable = false,
  onClick = null,
  onDblClick = null,
  selected = false,
  userData = null,
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
      onClick={(e) => {
        if (onClick) {
          onClick(ref, userData);
        }
      }}
      onDblClick={(e) => {
        if (onDblClick) {
          onDblClick(e.target);
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
      {content ? (
        <>
          {modules?.map((module) => {
            return (
              <Module
                x={module.positionx * pixelMeterRelation}
                y={-module.positiony * pixelMeterRelation}
                width={module.dimensionx * pixelMeterRelation}
                height={module.dimensiony * pixelMeterRelation}
                key={module.id}
                name={module.name}
                parts={module.parts.sort((a, b) => {
                  return a.type - b.type;
                })}
                pixelMeterRelation={pixelMeterRelation}
                frontView={true}
              />
            );
          })}
        </>
      ) : null}

      {boundingBox ? (
        <Group x={-(width / 2.0)} y={-(height / 2.0)}>
          <Rect width={width} height={height} strokeWidth={0.2} stroke={"#00ff00"} />
        </Group>
      ) : null}

      {selected ? (
        <Group x={-(width / 2.0)} y={-(height / 2.0)}>
          <Rect width={width} height={height} strokeWidth={0.3} stroke={getRackSelectedColor()}/>
        </Group>
      ) : null}

      {center ? <Circle width={2} height={2} fill={"#ff0000"} /> : null}
    </Group>
  );
};

export default StorageStructure;
