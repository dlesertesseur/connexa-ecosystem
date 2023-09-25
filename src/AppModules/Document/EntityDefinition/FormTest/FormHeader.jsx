import React from "react";
import { Group, Text } from "@mantine/core";

const FormHeader = ({ text }) => {
  return (
    <Group p={0}>
      <Group position="left">
        <Text>{text}</Text>
      </Group>
    </Group>
  );
};

export default FormHeader;
