import React from "react";
import { Stack, Button, Group, Textarea } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { FloorView3dContext } from "../Context";
import CustomColorPicker from "../../../../Components/CustomColorPicker";

const FindByDescription = ({ code }) => {
  const { t } = useTranslation();
  const { showData } = useContext(FloorView3dContext);

  const [color, onChange] = useState("#ff0000");
  const [textValue, setTextValue] = useState("");

  return (
    <Stack>
      <Textarea
        description={t("view.floorViewer.option.itemByDescription.description")}
        placeholder={t("view.floorViewer.option.itemByDescription.placeholder")}
        label={t("view.floorViewer.option.itemByDescription.label")}
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

export default FindByDescription;
