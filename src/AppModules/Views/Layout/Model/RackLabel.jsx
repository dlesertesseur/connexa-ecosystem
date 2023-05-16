import React from "react";
import { Group, Label, Tag, Text } from "react-konva";

const RackLabel = ({id, x, y, text, visible}) => {
  return (
    <Group key={id} visible={visible} rotation={0}>
      <Label x={x} y={y}>
        <Tag
          cornerRadius={1}
          pointerDirection={"down"}
          pointerWidth={6}
          pointerHeight={6}
          fill={"#bbb"}
          stroke={"#333"}
          strokeWidth={0.5}
        />
        <Text
          padding={1}
          fill={"#0000ff"}
          text={text}
          align={"center"}
          verticalAlign={"middle"}
          fontSize={14}
        />
      </Label>
    </Group>
  );
};

export default RackLabel;
