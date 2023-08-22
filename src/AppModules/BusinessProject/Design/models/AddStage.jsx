import { Button, Flex } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import React from "react";

const AddStage = ({ add }) => {
  return (
    <Flex h={"100%"} justify={"center"} align={"center"} style={{ borderRadius: 4 }}>
      <Button
        h={"100%"}
        p={3}
        onClick={() => {
          add();
        }}
      >
        <IconCirclePlus size={20} color="white"></IconCirclePlus>
      </Button>
    </Flex>
  );
};

export default AddStage;
