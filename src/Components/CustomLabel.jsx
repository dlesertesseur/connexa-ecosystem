import { Group, Text } from "@mantine/core";
import React from "react";

const CustomLabel = ({label, value, labelW=150}) => {
  return (
    <Group align="center">
      <Text w={labelW}>{label}</Text>
      <Text>{value}</Text>
    </Group>
  );
};

export default CustomLabel;
