import { Circle, Group } from "react-konva";
import G2dLabel from "./G2dLabel";
import uuid from "react-uuid";

const G2dSelect = ({ x, y, name, radioNode = 15, onSelect, onDblClick, type = "G2dSelect", color = "blue" }) => {
  return (
    <Group draggable onDblClick={onDblClick}>
      <Circle
        id={uuid()}
        x={x}
        y={y}
        width={radioNode}
        height={radioNode}
        fill={color ? color : "cyan"}
        name={name}
        draggable={false}
        onMouseDown={onSelect}
        onTap={onSelect}
        stroke={"red"}
        strokeWidth={2}
      />
      <G2dLabel x={x} y={y} text={name} />
    </Group>
  );
};

export default G2dSelect;
