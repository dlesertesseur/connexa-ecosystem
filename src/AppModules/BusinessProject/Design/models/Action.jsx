import { useDraggable } from "@dnd-kit/core";
import React from "react";

const Action = ({name, id}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {name}
    </button>
  );
};

export default Action;
