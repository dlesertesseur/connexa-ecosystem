import React from "react";
import { Circle, Group, Label, Tag, Text } from "react-konva";

const EditPoint = ({ id, x, y, updateLocation, endDrag, selected, setSelected, scale = 1, cx, cy }) => {
  const localSelection = (e) => {
    setSelected(id);
  };
  const tx = cx + x;
  const ty = cy + y;

  const text = `(${tx.toFixed(2)}, ${ty.toFixed(2)})`;
  return (
    <Group
      id={id}
      x={x}
      y={y}
      draggable={true}
      onDragMove={(e) => {
        updateLocation(id, e.target.x(), e.target.y());
      }}
      onMouseDown={(e) => localSelection(e)}
      onTap={(e) => localSelection(e)}
    >
      <Circle
        id={id}
        x={0}
        y={0}
        width={6}
        height={6}
        scaleX={1 / scale}
        scaleY={1 / scale}
        fill={selected ? "#ff0000" : "#0000ff"}
      />

      <Label fill="white">
        <Tag fill={"#fff"} cornerRadius={2} pointerDirection="down" pointerHeight={0.2} pointerWidth={0.2} />
        <Text
          text={text}
          fontSize={0.5}
          fontFamily={"monospace"}
          fill={"black"}
          verticalAlign="center"
          padding={0.2}
        ></Text>
      </Label>
    </Group>
  );
};

export default EditPoint;
