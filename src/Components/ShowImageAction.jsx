import React from "react";
import { Group, Switch, Tooltip } from "@mantine/core";
import { IconPhoto, IconPhotoOff } from "@tabler/icons-react";

const ShowImageAction = ({ checked, setChecked, toolTip, disabled }) => {
  return (
    <Tooltip label={toolTip} position="bottom" withArrow multiline>
      <Group position="center">
        <Switch
          size="md"
          onLabel={<IconPhoto size={16} />}
          offLabel={<IconPhotoOff size={16} />}
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          disabled={disabled}
        />
      </Group>
    </Tooltip>
  );
};

export default ShowImageAction;
