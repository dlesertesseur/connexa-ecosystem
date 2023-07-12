import React from "react";
import { Stack, Button, Group, Select } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { FloorViewerStateContext } from "../Context";
import CustomColorPicker from "../../../../Components/CustomColorPicker";

const FindByStatus = ({ code }) => {
  const { t } = useTranslation();
  const { showData, locationStatus } = useContext(FloorViewerStateContext);

  const [color, onChange] = useState("#ff0000");
  const [status, setStatus] = useState(null);

  return (
    <Stack>
      <Select
        label={t("view.floorViewer.option.findByStatus.label")}
        placeholder={t("view.floorViewer.option.findByStatus.placeholder")}
        data={locationStatus.map((l) => {
          return { value: l.id, label: l.id };
        })}
        value={status}
        onChange={setStatus}
      />

      <CustomColorPicker value={color} onChange={onChange} />

      <Group position="right">
        <Button
          size="xs"
          disabled={!status}
          onClick={(evt) => {
            showData(code, status, color);
          }}
        >
          {t("button.accept")}
        </Button>
      </Group>
    </Stack>
  );
};

export default FindByStatus;
