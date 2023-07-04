import React from "react";
import { Stack, Button, Group, Select, ColorPicker } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { FloorViewerStateContext } from "../Context";

const FindByType = ({code}) => {
  const { t } = useTranslation();
  const { showData, locationTypes } = useContext(FloorViewerStateContext);

  const [color, onChange] = useState("#ff0000");
  const [type, setType] = useState(null);

  return (
    <Stack>
      <Select
        label={t("view.floorViewer.option.itemByType.label")}
        placeholder={t("view.floorViewer.option.itemByType.placeholder")}
        data={locationTypes.map(l => {return({value:l.id, label:l.id})})}
        value={type}
        onChange={setType}
      />

      <ColorPicker format="hex" value={color} onChange={onChange} fullWidth withPicker={true} />

      <Group position="right">
        <Button
          size="xs"
          disabled={!type}
          onClick={(evt) => {
            showData(code, type, color);
          }}
        >
          {t("button.accept")}
        </Button>
      </Group>
    </Stack>
  );
};

export default FindByType;
