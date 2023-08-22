import { Button, Group } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import React from "react";

const AddAction = ({ stageId, newAction }) => {
  return (
    <Group grow position="center">
      <Button size="xs" onClick={() => {newAction(stageId)}}>
        <IconCirclePlus size={20}></IconCirclePlus>
      </Button>
    </Group>
  );
};

export default AddAction;
