import { Button, Group } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import React from "react";

const AddStatus = ({ stageId, newAction }) => {
  return (
    <Group grow position="center">
      <Button
        size="xs"
        color="indigo"
        variant="light"
        onClick={() => {
          newAction(stageId);
        }}
      >
        <IconCirclePlus size={18}></IconCirclePlus>
      </Button>
    </Group>
  );
};

export default AddStatus;
