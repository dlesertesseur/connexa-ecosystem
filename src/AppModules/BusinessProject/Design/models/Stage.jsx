import { useDroppable } from "@dnd-kit/core";
import { Box, Stack, Text } from "@mantine/core";
import React from "react";
import Action from "./Action";

const Stage = (props) => {
  const { name, id, actions } = props;

  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <Box ref={setNodeRef} h={60} w={150} bg={isOver ? "red" : "lime"}>
      <Text>{name}</Text>
      <Stack>
        {actions?.map((a) => (
          <Action key={a.id} name={a.name} id={a.id} />
        ))}
      </Stack>
    </Box>
  );
};

export default Stage;
