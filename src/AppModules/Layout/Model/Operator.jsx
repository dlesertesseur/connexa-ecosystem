import React from "react";
import useImage from "use-image";
import { Group, Image, Tag, Text } from "react-konva";

const Operator = ({ x, y, profile, name, status, bgColor, visible }) => {
  const [image] = useImage("/ccli/photo/" + profile + ".png");
  const totalW = 120;
  const totalH = 28;
  const margin = 2;
  const pointerWidth = 10;
  const pointerHeight = 10;
  const imageSize = 24;

  return (
    <Group x={x-(totalW / 2.0)} y={y - (totalH + pointerHeight)} visible={visible}>
      <Tag
        width={totalW}
        height={totalH}
        fill={bgColor}
        stroke={"#333"}
        strokeWidth={1}
        pointerDirection={"down"}
        pointerWidth={pointerWidth}
        pointerHeight={pointerHeight}
        cornerRadius={3}
      ></Tag>
      <Image x={margin} y={margin} image={image} width={imageSize} height={imageSize}/>
        <Text
          x={imageSize + (margin * 2)} 
          y={margin}
          text={name}
          fontSize={9}
          lineHeight={1}
          fill={"#000000"}
        />
      <Text
          x={imageSize + (margin * 2)} 
          y={12}
          text={status}
          fontSize={6}
          lineHeight={1}
          fill={"#000000"}
          bgColor={"#ff0000"}
          fontStyle={"bold"}
        />
    </Group>
  );
};

export default Operator;
