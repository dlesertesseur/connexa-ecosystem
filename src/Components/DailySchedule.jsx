import { Group, Select, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

const DailySchedule = ({
  dayName,
  openingTimeTitle,
  openingTimeList,
  closingTimeTitle,
  closingTimeList,
  form = null,
  field = null,
  defaultOpen = "06:00",
  defaultClose = "20:30",
  disabled=false
}) => {

  const [open, setOpen] = useState(defaultOpen);
  const [close, setClose] = useState(defaultClose);

  useEffect(() => {
    form?.setFieldValue(field, `${open}-${close}`);
  }, []);

  const onSelectOpenTime = (data) => {
    setOpen(data);
    form.setFieldValue(field, `${open}-${close}`);
  };

  const onSelectCloseTime = (data) => {
    setClose(data);
    form.setFieldValue(field, `${open}-${close}`);
  };

  return (
    <Group grow align="center" spacing={"xs"} position="apart">
      <Text>{dayName}</Text>
      <Group grow>
        <Text align="right">{openingTimeTitle}</Text>
        <Select
          data={openingTimeList}
          value={open}
          error={form.getInputProps(field).error}
          onChange={onSelectOpenTime}
          disabled={disabled}
        />
      </Group>
      <Group grow>
        <Text align="right">{closingTimeTitle}</Text>
        <Select
          data={closingTimeList}
          value={close}
          error={form.getInputProps(field).error}
          onChange={onSelectCloseTime}
          disabled={disabled}
        />
      </Group>
    </Group>
  );
};

export default DailySchedule;
