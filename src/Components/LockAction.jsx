import React from "react";
import { Group, Switch, Tooltip } from "@mantine/core";
import { IconLock, IconLockOpen } from "@tabler/icons";

const LockAction = ({ checked, setChecked, toolTip, disabled }) => {
  return (
    <Tooltip label={toolTip} position="bottom" withArrow multiline width={220}>
      <Group position="center">
        <Switch
          size="lg"
          onLabel={<IconLockOpen size={20} />}
          offLabel={<IconLock size={20} />}
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          disabled={disabled}
        />
      </Group>
    </Tooltip>
  );
};

export default LockAction;
