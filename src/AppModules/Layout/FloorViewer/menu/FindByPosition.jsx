import React from "react";
import { Stack, Button, Group, Textarea } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { FloorViewerStateContext } from "../Context";
import CustomColorPicker from "../../../../Components/CustomColorPicker";

const FindByPosition = ({ code }) => {
  const { t } = useTranslation();
  const { showData } = useContext(FloorViewerStateContext);

  const [color, onChange] = useState("#ff0000");
  const [textValue, setTextValue] = useState("");

  return (
    <Stack>
      <Textarea
        description={t("view.floorViewer.option.itemByPosition.description")}
        placeholder={t("view.floorViewer.option.itemByPosition.placeholder")}
        label={t("view.floorViewer.option.itemByPosition.label")}
        value={textValue}
        onChange={(event) => setTextValue(event.currentTarget.value)}
      />

      <CustomColorPicker value={color} onChange={onChange} />

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

export default FindByPosition;
