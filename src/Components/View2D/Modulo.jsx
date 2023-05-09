import { useState } from "react";
import { Rect, Group } from "react-konva";

const Modulo = ({ id, name, x = 0, y = 0, width = 130, height = 40, rotation = 0, color = "#e5e5e5" }) => {
  const [selected, setSelected] = useState(false);

  const onPress = () => {
    setSelected(!selected);
  };

  return (
    <Group x={x} y={y} rotation={rotation} onClick={onPress} onTap={onPress}>
      <Rect
        x={0}
        y={4}
        width={width}
        height={height}
        fill={color}
        stroke={selected ? "#ff0000" : color}
        strokeWidth={0.5}
        perfectDrawEnabled={true}
      />
      <Rect
        x={0}
        y={0}
        width={width}
        height={4}
        fill={"#d5d5d5"}
        stroke={selected ? "#ff0000" : "#d5d5d5"}
        strokeWidth={0.5}
        perfectDrawEnabled={true}
      />
    </Group>
  );
};

export default Modulo;
