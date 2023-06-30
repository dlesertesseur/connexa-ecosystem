import { Group, NumberInput, Text } from "@mantine/core";
import React from "react";

const NumberProperty = ({ label, value, setValue, precision = 2, w = 100}) => {
  return (
    <Group grow position="apart">
      <Text size={"xs"} weight={500}>
        {label}
      </Text>
      <NumberInput size="xs" precision={precision} value={value} onChange={setValue} w={w}/>
    </Group>
  );
};

export default NumberProperty;
