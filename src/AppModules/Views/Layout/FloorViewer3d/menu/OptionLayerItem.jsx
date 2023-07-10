import React from "react";
import { Checkbox, Group, Text } from "@mantine/core";

const OptionLayerItem = ({ name, checked, onCheck }) => {
  return (
    <Group position="apart">
      <Text weight={400}>{name}</Text>
      <Checkbox checked={checked} onChange={(event) => onCheck(event.currentTarget.checked)} />
    </Group>
  );
};

export default OptionLayerItem;
