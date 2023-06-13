import { Button, ColorPicker, Group, HueSlider, Stack, TextInput } from "@mantine/core";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FloorViewerStateContext } from "../Context";

const FindByCode = ({code}) => {
  const { t } = useTranslation();

  const [color, onChange] = useState("#ff0000");
  const [textValue, setTextValue] = useState("");

  const { showData } = useContext(FloorViewerStateContext);

  return (
    <Stack>
      <TextInput
        description={t("view.floorViewer.option.itemByCode.description")}
        placeholder={t("view.floorViewer.option.itemByCode.placeholder")}
        label={t("view.floorViewer.option.itemByCode.label")}
        value={textValue}
        onChange={(event) => setTextValue(event.currentTarget.value)}
      />

      <ColorPicker format="hex" value={color} onChange={onChange} fullWidth withPicker={true} />

      <Group position="right">
        <Button
          size="xs"
          disabled={!textValue}
          onClick={(evt) => {
            showData(code, textValue, color);
          }}
        >
          {t("button.accept")}
        </Button>
      </Group>
    </Stack>
  );
};

export default FindByCode;
