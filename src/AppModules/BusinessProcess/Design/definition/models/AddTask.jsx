import { Button, Flex } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import React from "react";

const AddTask = ({ add }) => {
  return (
    <Flex h={"100%"} justify={"center"} align={"center"} style={{ borderRadius: 4 }}>
      <Button
        color="indigo"
        variant="default"
        size="xs"
        w={"100%"}
        p={3}
        onClick={() => {
          add();
        }}
      >
        <IconCirclePlus size={18} color="gray"></IconCirclePlus>
      </Button>
    </Flex>
  );
};

export default AddTask;
