import React from "react";
import { Group, Switch, Tooltip } from "@mantine/core";
import { IconGridDots } from "@tabler/icons-react";

const SnapToGridAction = ({ checked, setChecked, toolTip, disabled }) => {
  return (
    <Tooltip label={toolTip} position="bottom" withArrow multiline>
      <Group position="center">
        <Switch
          size="md"
          onLabel={<IconGridDots size={16} />}
          offLabel={<IconGridDots size={16} />}
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          disabled={disabled}
        />
      </Group>
    </Tooltip>
  );
};

export default SnapToGridAction;
