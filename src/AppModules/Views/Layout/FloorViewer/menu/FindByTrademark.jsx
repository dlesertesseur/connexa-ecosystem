import { Stack, Button, Group, Select, ColorPicker } from "@mantine/core";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FloorViewerStateContext } from "../Context";

const FindByTrademark = ({ code }) => {
  const { t } = useTranslation();
  const { showData, trademarks } = useContext(FloorViewerStateContext);

  const [color, onChange] = useState("#ff0000");
  const [department, setDepartment] = useState(null);

  return (
    <Stack>
      <Select
        label={t("view.floorViewer.option.itemByTrademark.label")}
        placeholder={t("view.floorViewer.option.itemByDepartament.placeholder")}
        data={trademarks.map(t => {return({value:t.id, label:t.id})})}
        value={department}
        onChange={setDepartment}
      />

      <ColorPicker format="hex" value={color} onChange={onChange} fullWidth withPicker={true} />

      <Group position="right">
        <Button
          size="xs"
          disabled={!department}
          onClick={(evt) => {
            showData(code, department, color);
          }}
        >
          {t("button.accept")}
        </Button>
      </Group>
    </Stack>
  );
};

export default FindByTrademark;
