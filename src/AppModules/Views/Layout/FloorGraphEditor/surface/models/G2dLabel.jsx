import React from "react";
import { Label, Tag, Text } from "react-konva";
import uuid from "react-uuid";

const G2dLabel = ({ x, y, text }) => {
  return (
    <Label id={uuid()} x={x} y={y}>
      <Tag
        cornerRadius={2}
        pointerDirection={"down"}
        pointerWidth={6}
        pointerHeight={6}
        fill={"#fff"}
        stroke={"#000"}
        strokeWidth={0.5}
      ></Tag>
      <Text
        padding={2}
        text={text}
        align={"center"}
      ></Text>
    </Label>
  );
};

export default G2dLabel;
